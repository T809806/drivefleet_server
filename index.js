import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔥 MongoDB setup
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// 🚗 MAIN FUNCTION (এটাই তুমি জিজ্ঞেস করেছো)
async function run() {
  try {
     await client.connect();
    const carCollection = client.db("drivefleet").collection("cars");
    const bookingCollection = client.db("drivefleet").collection("bookings");

    // GET ALL CARS
    app.get("/cars", async (req, res) => {
      const cars = await carCollection.find().toArray();
      res.send(cars);
    });

    // ADD CAR
    app.post("/cars", async (req, res) => {
      const car = req.body;
      const result = await carCollection.insertOne(car);
      res.send(result);
    });

  } finally {
    // optional
  }
}

run().catch(console.dir);

// 🧪 TEST ROUTE
app.get("/", (req, res) => {
  res.send("DriveFleet Server Running");
});

// 🚀 SERVER START
app.listen(port, () => {
  console.log("Server running on port", port);
});