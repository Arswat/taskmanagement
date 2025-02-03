import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
const app = express();
const corsOptions = {
  origin: 'https://taskmanagement-frontend-eun9.onrender.com/', 
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
console.log("MongoDB URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
