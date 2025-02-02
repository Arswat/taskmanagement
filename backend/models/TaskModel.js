import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  dueDate: { type: String, required: true },
  status: { type: String, required: true },
  attachment: { type: String } // File URL if needed
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;
