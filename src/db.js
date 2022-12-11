const { Sequelize } = require('sequelize');
const User = require('./model/User');
const Team = require('./model/Team');

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: console.log,
  }
);

const UserModel = User(db);
const TeamModel = Team(db);

UserModel.Teams = UserModel.hasMany(TeamModel, {
  foreignKey: 'user_id',
  foreignKeyConstraint: true,
});
TeamModel.User = TeamModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  foreignKeyConstraint: true,
});
module.exports = { db, UserModel, TeamModel };
