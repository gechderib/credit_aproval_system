const loanRoute = app => {
    const loans = require("../controllers/loan.controller");
  
    var router = require("express").Router();
  
    // Create a new loan
    router.post("/create-loan", loans.addLoan);
  
    // Retrieve all loans
    router.get("/", loans.getAllLoan);
  
    // Retrieve loan by loan_id
    router.get("/:loan_id", loans.getOneLoan);
  
    app.use('/api/loans', router);
  };


  module.exports = loanRoute