const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 4545;

// Enable CORS for frontend requests
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from frontend
    methods: "GET, POST, PUT, DELETE,PATCH", // Specify allowed request methods
    credentials: true, // Allow credentials (cookies, auth headers)
  })
);

// Middleware for parsing JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing Routes
const memberRoutes = require("./src/Routes/membersRoute");
const maintenanceRoutes = require("./src/Routes/maintenanceRoutes");
const complaintRoutes = require("./src/Routes/complaintsRouter");
const communityHallRoutes = require("./src/Routes/communityHallRoutes");
const noticeBoardRouter = require("./src/Routes/noticeBoardRoutes");
const vehicleRouter = require("./src/Routes/vehicleRoutes");
const visitorRoutes = require("./src/Routes/visitorRoutes");
const authRoutes = require("./src/Auth/authRoutes");

// Using Routes
app.use("/api/members", memberRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/bookings", communityHallRoutes);
app.use("/api/notices", noticeBoardRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/visitors", visitorRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the World of PERN stack");
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
