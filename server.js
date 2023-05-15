const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/todo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  description: String,
  time: String, // Update property name to 'time'
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    const tasksData = tasks.map((task) => ({
      _id: task._id,
      description: task.description,
      time: task.time, // Include the time property
      completed: task.completed,
    }));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { description, time, completed } = req.body; // Include the 'time' property
    const task = new Task({ description, time, completed });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});


// Update a task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;
    const task = await Task.findByIdAndUpdate(
      id,
      { description, completed },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
