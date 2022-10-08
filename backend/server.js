const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

const PORT = process.env.PORT || 5000;
const scheduleApiRoutes = require("./routes/scheduleApi");
const subjectApiRoutes = require("./routes/subjectApi");
const periodApiRoutes = require("./routes/periodApi");

app.use(morgan("dev"));

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));
app.use("/api/schedule", scheduleApiRoutes);
app.use("/api/subject", subjectApiRoutes);
app.use("/api/period",periodApiRoutes);

app.get("/", (req, res) => {
  res.send("Default route up!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});