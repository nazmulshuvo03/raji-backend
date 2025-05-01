const { Task, User, Project } = require("../models");

exports.createTask = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    const { title, description, dueDate, projectId, assignedTo } = req.body;

    if (user.getDataValue("role") !== "admin") {
      return res.status(403).json({ message: "Only admins can create tasks" });
    }

    const project = await Project.findByPk(projectId);
    if (
      !project ||
      project.getDataValue("groupId") !== user.getDataValue("groupId")
    ) {
      return res
        .status(404)
        .json({ message: "Project not found or not in your group" });
    }
    const parsedDueDate = dueDate ? new Date(dueDate) : null;

    const task = await Task.create({
      title,
      description,
      dueDate: parsedDueDate,
      projectId,
      assignedTo,
      createdBy: user.getDataValue("id"),
    });

    res.status(201).json({ task });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    const project = await Project.findByPk(req.params.projectId);

    if (
      !project ||
      project.getDataValue("groupId") !== user.getDataValue("groupId")
    ) {
      return res
        .status(404)
        .json({ message: "Project not found or not in your group" });
    }

    const tasks = await Task.findAll({
      where: { projectId: project.getDataValue("id") },
    });
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findByPk(task.getDataValue("projectId"));
    if (
      !project ||
      project.getDataValue("groupId") !== user.getDataValue("groupId")
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const isAdmin = user.getDataValue("role") === "admin";
    const isAssignee =
      task.getDataValue("assignedTo") === user.getDataValue("id");

    if (!isAdmin && !isAssignee) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    const { title, description, status, dueDate, assignedTo } = req.body;
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (assignedTo && isAdmin) task.assignedTo = assignedTo;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (user.getDataValue("role") !== "admin") {
      return res.status(403).json({ message: "Only admins can delete tasks" });
    }

    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findByPk(task.getDataValue("projectId"));
    if (
      !project ||
      project.getDataValue("groupId") !== user.getDataValue("groupId")
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this task" });
    }

    await task.destroy();
    res.status(204).send();
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
