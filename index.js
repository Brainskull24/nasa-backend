const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db.js");
const authRoutes = require("./routes/authRoute.js");
const router = express.Router();
const projectRoutes = require("./routes/projectRoute.js");
const app = express();
app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "https://openscience.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));
dotenv.config();

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/project", projectRoutes);

app.listen(process.env.PORT, () => {
  console.log(`OPENSCIENCE STARTED AT ${process.env.PORT}`);
});
