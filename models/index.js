const sequelize = require("../core/orm");
const Type = require("./type");
const Task = require("./task");

Task.belongsTo(Type);
Type.hasMany(Task);

// sequelize.sync({ alter: true });

module.exports = {
  Type: Type,
  Task: Task,
};