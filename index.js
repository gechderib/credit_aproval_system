const express = require("express")
const cors = require("cors")

const app = express()


var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models/index");
const customerRoute = require("./app/routes/customer.routes");
const loanRoute = require("./app/routes/loan.route");
const ingestRoute = require("./app/routes/ingest.route");
const checkEligibilityRoute = require("./app/routes/check-loan-eligibility.route");
const paymentRoute = require("./app/routes/payment.route");
const statementRoute = require("./app/routes/statement.routes");

db.sequelize.sync({ force: true })
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });


ingestRoute(app)
customerRoute(app)
loanRoute(app)
checkEligibilityRoute(app)
paymentRoute(app)
statementRoute(app)


// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});