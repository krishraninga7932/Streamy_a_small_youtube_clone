import express from "express";
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();

import uploadRoutes from "./routes/upload.routes.js"


const app = express()
const PORT = process.env.PORT || 9000 

app.use(cors())
app.use(express.json())


app.use("/api", uploadRoutes)

app.get("/", (req, res) => {
    res.send("Streamy Media Server Running 🚀");
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

 