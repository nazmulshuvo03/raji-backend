const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// Import model definitions
const User = require("./user")(sequelize, DataTypes);
const UserCredential = require("./userCredential")(sequelize, DataTypes);
const Group = require("./group")(sequelize, DataTypes);
const Project = require("./project")(sequelize, DataTypes);
const Task = require("./task")(sequelize, DataTypes);

// Define associations
// User ↔ Group
User.belongsTo(Group, { foreignKey: "groupId" });
Group.hasMany(User, { foreignKey: "groupId" });

// Group ↔ Project
Project.belongsTo(Group, { foreignKey: "groupId" });
Group.hasMany(Project, { foreignKey: "groupId" });

// Project ↔ Task
Task.belongsTo(Project, { foreignKey: "projectId" });
Project.hasMany(Task, { foreignKey: "projectId" });

// User ↔ Project (creator)
Project.belongsTo(User, { as: "creator", foreignKey: "createdBy" });
User.hasMany(Project, { foreignKey: "createdBy", as: "createdProjects" });

// User ↔ Task (assignee and creator)
Task.belongsTo(User, { as: "assignee", foreignKey: "assignedTo" });
User.hasMany(Task, { foreignKey: "assignedTo", as: "assignedTasks" });

Task.belongsTo(User, { as: "creator", foreignKey: "createdBy" });
User.hasMany(Task, { foreignKey: "createdBy", as: "createdTasks" });

// User ↔ UserCredential
User.hasOne(UserCredential, { foreignKey: "userId", onDelete: "CASCADE" });
UserCredential.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Export everything
module.exports = {
  sequelize,
  User,
  UserCredential,
  Group,
  Project,
  Task,
};
