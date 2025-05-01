const { Group, User } = require("../models");

exports.createGroup = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);

    // Check if user is already part of a group
    if (user.groupId) {
      return res
        .status(400)
        .json({ message: "User already belongs to a group" });
    }

    const { name, description } = req.body;

    // Create new group
    const group = await Group.create({ name, description });

    // Assign group and role=admin to user
    user.groupId = group.getDataValue("id");
    user.role = "admin";
    await user.save();

    res.status(201).json({ group });
  } catch (err) {
    console.error("Group creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyGroup = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, { include: ["Group"] });
    if (!user.groupId)
      return res.status(404).json({ message: "No group assigned" });

    const group = await Group.findByPk(user.groupId);
    res.json(group);
  } catch (err) {
    console.error("Get group error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
