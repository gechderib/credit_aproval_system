const db = require("../models/index")
const Customer = db.customer;
const Loan = db.loan;
const Op = db.Sequelize.Op;

// Create and Save a new Customer
const addCustomer = async (req, res) => {
    // validate request
    if (!req.body.first_name || !req.body.last_name) {
        res.status(400).send({
            message: "first name and last name cant be empty"
        })
    }

    // add customer

    try {
        // save the customer in the database
        const customerExist = await Customer.findAll({});
        if (customerExist.length > 0) {
            const max = await Customer.max('customer_id');

            const customer = {
                customer_id: max + 1,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                age: req.body.age,
                phone_number: req.body.phone_number,
                monthly_salary: req.body.monthly_salary,
                approved_limit: 36 * req.body.monthly_salary,
                current_debt: req.body.current_debt
            }
            const response = await Customer.create(customer)
            if (response) {
                const addedCustomer = await Customer.findByPk(response.customer_id, {
                    attributes: {
                        exclude: ['current_debt', 'createdAt', 'updatedAt'],
                    }
                })

                res.status(201).send(addedCustomer)
                return
            }
        } else {
            const customer = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                age: req.body.age,
                phone_number: req.body.phone_number,
                monthly_salary: req.body.monthly_salary,
                approved_limit: 36 * req.body.monthly_salary,
                current_debt: req.body.current_debt
            }
            const response = await Customer.create(customer)
            if (response) {
                const addedCustomer = await Customer.findByPk(response.customer_id, {
                    attributes: {
                        exclude: ['current_debt', 'createdAt', 'updatedAt'],
                    }
                })
                res.status(201).send(addedCustomer)
                return
            }
        }


    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: err.message || "some error occurred while creating the user"
        })
        return
    }
}

// Retrieve all Customers from the database.

const getAllCustomer = async (req, res) => {
    const first_name = req.body.first_name
    var condition = first_name ? { first_name: { [Op.iLike]: `%${first_name}%` } } : null;

    try {
        const response = await Customer.findAll({ where: condition, include: { model: Loan, as: "loans" } })
        if (response) {

            res.status(200).send(response)
            return
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "some error happen while getting users" })
        return
    }
}

// Find a single Customer with an id

const getOneCustomer = async (req, res) => {
    const id = req.params.id
    try {
        const response = await Customer.findByPk(id, { include: ["loans"] })
        if (response) {
            res.status(200).send(response)
        } else {
            res.status(400).send({ message: "can't find customer with id " + id })
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error happen whil getting the customer" });
        return
    }
}

// Update a Customer by the id in the request


const updateCustomer = async (req, res) => {
    const id = req.params.id
    try {
        const response = await Customer.update(req.body, { where: { id: id } })
        if (response[0] == 1) {
            const updatedRecord = await Customer.findByPk(id)
            res.status(200).send({ message: "customer successfully updated", data: updatedRecord })
        } else {
            res.status(400).send({ message: "can't update the data with id " + id + " you may have entered wrong id" })
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error happen while updating the customer" })
        return
    }
}

// Delete a Customer with the specified id in the request

const deleteCustomer = async (req, res) => {
    const id = req.params.id
    try {
        const response = await Customer.destroy({ where: { id: id } })
        console.log(response)
        if (response == 1) {
            res.status(200).send({ message: "customer successfully deleted", removedId: id });
            return;
        } else {
            res.status(400).send({ message: "can't delete customer with id " + id })
            return
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error happen while deleting the customer" });
        return;
    }
}

// Delete all Customers from the database.

const deleteAllCustomer = async (req, res) => {
    try {
        const response = await Customer.destroy({ where: {}, truncate: false })
        console.log(response)
        if (response >= 1) {
            res.status(200).send({ message: response + " customers deleted successfully" })
            return
        } else {
            res.status(400).send({ message: "can't remove the data or it might be empty" })
            return
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "some error happen while removing customres" });
        return;
    }
}



module.exports = {
    addCustomer,
    getAllCustomer,
    getOneCustomer,
    updateCustomer,
    deleteCustomer,
    deleteAllCustomer,
}