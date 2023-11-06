const paymentRoute = app => {
    const payment = require("../controllers/payment.controller")

    var router = require("express").Router();

    router.post("/:customer_id/:loan_id/", payment.paymentController);

    app.use('/api/make-payment', router);
};


module.exports = paymentRoute

