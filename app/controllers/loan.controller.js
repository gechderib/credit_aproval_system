const { checkLoanEligibility, calculateEMI } = require("../middleware/check-eligibility.middleware");
const db = require("../models/index");
const Loan = db.loan;
const Customer = db.customer;
const Op = db.Sequelize.Op;

// Create and Save a new loan
const addLoan = async (req, res) => {
    // validate request

    const customerData = req.body;
    const customer = await Customer.findAll({ where: { customer_id: req.body.customer_id } })

    if (!customer) {
        res.status(400).send({
            message: "Loan should have owner or wrong customer id"
        })
    }
    // add loan
    const loan = {
        ...customerData
    }

    try {

        // Process loan data
        const [loan_status, interest_rate] = await checkLoanEligibility(customerData);
        const monthly_installment = calculateEMI(customerData.loan_amount, customerData.interest_rate, customerData.tenure)

        // save the customer in the database
        const result = {
            customer_id: customerData.customer_id,
            loan_status,
            approval: interest_rate != 0,
            interest_rate: customerData.interest_rate,
            tenure: customerData.tenure,
            corrected_interest_rate: Math.min(interest_rate, 16),
            monthly_installment: monthly_installment
        };

        if (result.approval) {
            const response = await Loan.create(loan)
            if (response) {
                res.status(201).send({
                    "loan_id": response.loan_id,
                    "customer_id": customerData.customer_id,
                    "loan_approved": result.approval,
                    "message": result.loan_status,
                    "monthly_installment": result.monthly_installment
                })
                return
            }
        } else {
            res.status(400).send({ message: "your request is not eligible" })
            return;
        }

    } catch (err) {
        res.status(500).send({
            message: err.message || "some error occurred while add a loan"
        })
        return
    }
}

// Retrieve all loan from the database.

const getAllLoan = async (req, res) => {
    const first_name = req.body.first_name
    var condition = first_name ? { first_name: { [Op.iLike]: `%${first_name}%` } } : null;

    try {
        const response = await Loan.findAll({ where: condition, include: ["customer"] })
        if (response) {
            res.status(200).send(response)
            return
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "some error happen while getting loans" })
        return
    }
}

// Find a single Loan with an id

const getOneLoan = async (req, res) => {
    const loan_id = req.params.loan_id
    try {
        const response = await Loan.findByPk(loan_id, {
            attributes: { exclude: ["start_date", "end_date", "createdAt", "updatedAt", "customer_id", "emis", "id"] }, include: [{
                model: Customer,
                as: 'customer',
                attributes: { exclude: ["updatedAt", "createdAt", "current_debt", "approved_limit", "monthly_salary", "customer_id"] }

            }]
        })
        if (response) {
            res.status(200).send(response)
        } else {
            res.status(400).send({ message: "can't find loan with id " + id })
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error happen whil getting the loan" });
        return
    }
}

// Update a Customer by the id in the request


const updateLoan = async (req, res) => {
    const id = req.params.id
    try {
        const response = await Loan.update(req.body, { where: { id: id } })
        if (response[0] == 1) {
            const updatedRecord = await Loan.findByPk(id)
            res.status(200).send({ message: "Loan successfully updated", data: updatedRecord })
        } else {
            res.status(400).send({ message: "can't update the data with id " + id + " you may have entered wrong id" })
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error happen while updating the loan" })
        return
    }
}

// Delete a Customer with the specified id in the request

const deleteLoan = async (req, res) => {
    const id = req.params.id
    try {
        const response = await Loan.destroy({ where: { id: id } })
        if (response == 1) {
            res.status(200).send({ message: "loan successfully deleted", removedId: id });
            return;
        } else {
            res.status(400).send({ message: "can't delete loan with id " + id })
            return
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error happen while deleting the loan" });
        return;
    }
}

// Delete all Loan from the database.

const deleteAllLoan = async (req, res) => {
    try {
        const response = await Loan.destroy({ where: {}, truncate: false })
        if (response >= 1) {
            res.status(200).send({ message: response + " loan deleted successfully" })
            return
        } else {
            res.status(400).send({ message: "can't remove the data or it might be empty" })
            return
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "some error happen while removing loans" });
        return;
    }
}



module.exports = {
    addLoan,
    getAllLoan,
    getOneLoan,
    deleteAllLoan,
    deleteLoan,
    updateLoan
}