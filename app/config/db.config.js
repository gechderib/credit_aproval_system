module.exports = {
    HOST: "localhost",
    USER: "etech",
    PASSWORD: "etech",
    DB: "credit_approval",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  