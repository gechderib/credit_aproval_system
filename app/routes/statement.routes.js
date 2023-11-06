const statementRoute = app => {
    const statement = require("../controllers/statement.controller")

    var router = require("express").Router();

    router.get("/:customer_id/:loan_id/", statement.viewLoanStatement);

    app.use('/api/view-statement', router);
};


module.exports = statementRoute
