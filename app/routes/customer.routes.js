const customerRoute = app => {
    const customers = require("../controllers/customer.controller");
  
    var router = require("express").Router();
  
    // Create a new Customer
    router.post("/register/", customers.addCustomer);
  
    // retrieve all customers
    router.get("/", customers.getAllCustomer);
    
    // retrieve a single customer with id
    router.get("/:id", customers.getOneCustomer);
  
    // update a customer with id
    router.patch("/:id", customers.updateCustomer);
  
    // delete a customer with id
    router.delete("/:id", customers.deleteCustomer);
  
    // delete all customer
    router.delete("/", customers.deleteAllCustomer);
  
    app.use('/api/customers', router);
  };


  module.exports = customerRoute