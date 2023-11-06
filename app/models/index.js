const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");

const customer = require("./customer.model")
const loan = require("./loan.model")

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.customer = customer(sequelize, Sequelize)
db.loan = loan(sequelize, Sequelize)


// association 
db.customer.hasMany(db.loan, {foreignKey: "customer_id", as: "loans" });
db.loan.belongsTo(db.customer, {
  foreignKey: "customer_id",
  as: "customer",
})

module.exports = db;