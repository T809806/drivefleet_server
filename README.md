# DriveFleet Server (Backend API)

This is the backend server for the DriveFleet Car Rental Website. It is built using Node.js, Express.js, and MongoDB.

---

##  Live API / Server Info

Base URL: http://localhost:5000

---

##  Technologies Used

- Node.js
- Express.js
- MongoDB (Atlas / Local)
- JWT Authentication
- Cookie Parser
- CORS

---

##  Authentication System (JWT with Cookies)

- User login generates a JWT token
- Token is stored in HTTPOnly cookie
- Middleware verifies token for protected routes
- Logout clears authentication cookie

### Protected Routes:
- POST /cars (Add car)
- GET /my-cars (User specific cars)

---

##  Car API Routes

- GET /cars → Get all cars
- GET /cars/:id → Get single car details
- POST /cars → Add new car (Protected)
- PUT /cars/:id → Update car
- DELETE /cars/:id → Delete car

---

##  Search & Filter System

- Search cars by name using MongoDB `$regex`
- Filter cars by type (SUV, Sedan, etc.)

Example:  /cars?search=BMW
/cars?type=SUV


---

##  Booking System

- Users can book cars
- Each booking is stored in database
- Booking count increases using `$inc`
Example:
```js
$inc: { booking_count: 1 }

---

## Live_Link : https://drivefleet-server-2y7v.onrender.com
