const express = require("express")
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db.js")
const authRoutes = require("./routes/authRoute.js")
const router = express.Router();

const app = express();
app.use(express.json());
app.use(cors())

dotenv.config();

connectDB();

app.use("/api/v1/auth",authRoutes);


app.listen(process.env.PORT , ()=>{
    console.log(`OPENSCIENCE STARTED AT ${process.env.PORT}`)
})



