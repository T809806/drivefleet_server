import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";

  dotenv.config();

    const app = express();
    const port = process.env.PORT || 5000;

app.use(cors({

  origin: "http://localhost:5173",
  credentials: true

}));

app.use(express.json());
app.use(cookieParser());

     const uri = process.env.MONGO_URI;
     const client = new MongoClient(uri);
     const verifyToken = (req, res, next) => {
     const token = req.cookies?.token;

 if (!token) {

    return res.status(401).send({ message: "Unauthorized" });

  }

try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send({ message: "Invalid token" });
  }
};

async function run() {

  try {

    await client.connect();
    console.log("MongoDB Connected Successfully");

    const db = client.db("drivefleet");
    const carCollection = db.collection("cars");
    const bookingCollection = db.collection("bookings");

   app.post("/login", async (req, res) => {
   const { email } = req.body;
   const token = jwt.sign(

    { email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
 );

res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/"

  });

res.send({ success: true, message: "Login success" });

});

app.get("/me", verifyToken, (req, res) => {
res.send({ user: req.user });

});

 app.post("/logout", (req, res) => {

  res.clearCookie("token", {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  path: "/"
 });

 res.send({ success: true, message: "Logged out" });

 });

app.get("/cars", async (req, res) => {

const search = req.query.search;
 const type = req.query.type;
let query = {};
if (search) {

  query.name = { $regex: search, $options: "i" };

 }

 if (type) {

   query.type = type;

 }

 const cars = await carCollection.find(query).toArray();
 res.send(cars);
 });


app.get("/cars/:id", async (req, res) => {
   const id = req.params.id;
  const car = await carCollection.findOne({
    _id: new ObjectId(id),
 });

  res.send(car);
 });

    
 app.post("/cars", verifyToken, async (req, res) => {
   try {
     const car = {
     ...req.body,
    booking_count: 0
  };
  const result = await carCollection.insertOne(car);

  res.send({
    success: true,
   insertedId: result.insertedId,
  });

  } catch (err) {
     res.status(500).send({ message: "Server error" });
 }
   });

 app.delete("/cars/:id", async (req, res) => {
   const id = req.params.id;
   const result = await carCollection.deleteOne({
      _id: new ObjectId(id),
  });
  res.send(result);
    });

 app.put("/cars/:id", async (req, res) => {
   const id = req.params.id;
   const result = await carCollection.updateOne(
     { _id: new ObjectId(id) },
    { $set: req.body }
 );

 res.send(result);
 });

 app.get("/my-cars", verifyToken, async (req, res) => {
   const email = req.user.email;
   const result = await carCollection.find({
      ownerEmail: email,
  }).toArray();

 res.send(result);
   });

    
 app.post("/bookings", async (req, res) => {
    const booking = req.body;
   const result = await bookingCollection.insertOne(booking);

  await carCollection.updateOne(
  { _id: new ObjectId(booking.carId) },
  { $inc: { booking_count: 1 } }
 );

 res.send(result);
 });

 app.get("/bookings", async (req, res) => {

 const email = req.query.email;
  const query = {
    userEmail: email
  };

const result = await bookingCollection.find(query).toArray();

  res.send(result);
});

  } catch (err) {
    console.log(err);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("DriveFleet Server Running 🚗");

});

app.listen(port, () => {
  console.log("Server running on port", port);
});