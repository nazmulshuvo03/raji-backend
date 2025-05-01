const { Project, User } = require("../models");

exports.createProject = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can create projects" });
    }

    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      groupId: user.getDataValue("groupId"),
      createdBy: user.id,
    });

    res.status(201).json({ project });
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    const projects = await Project.findAll({
      where: { groupId: user.groupId },
    });
    res.json(projects);
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        groupId: user.groupId,
      },
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("Get project error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update projects" });
    }

    const project = await Project.findOne({
      where: {
        id: req.params.id,
        groupId: user.groupId,
      },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    const { name, description } = req.body;
    if (name) project.name = name;
    if (description) project.description = description;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete projects" });
    }

    const project = await Project.findOne({
      where: {
        id: req.params.id,
        groupId: user.groupId,
      },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.destroy();
    res.status(204).send();
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
