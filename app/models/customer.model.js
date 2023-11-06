const { DataTypes } = require("sequelize");


const customerModel = (sequelize, Sequelize) => {
  let Customer = sequelize.define("customer", {
    customer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    age:{
      type: DataTypes.INTEGER
    },
    phone_number: {
      type: DataTypes.BIGINT
    },
    monthly_salary: {
      type: DataTypes.INTEGER
    },
    approved_limit:{
      type: DataTypes.INTEGER
    },
    current_debt:{
      type:DataTypes.DOUBLE
    },

  });

  return Customer;
};



module.exports = customerModel