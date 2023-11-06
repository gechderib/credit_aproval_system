const checkEligibilityRoute = app => {
    const checkEligibility = require("../controllers/check-eligibility.controller")
  
    var router = require("express").Router();
  
    // check eligibility endpoint
    router.post("/check-eligibility/", checkEligibility.checkLoanEligibilityController);
  
  
    app.use('/api', router);
  };


  module.exports = checkEligibilityRoute