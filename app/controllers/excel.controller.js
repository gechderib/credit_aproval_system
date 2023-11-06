const db = require("../models/index")
const readXlsxFile = require("read-excel-file/node");

const Customer = db.customer;
const Loan = db.loan;


const upload = async (req, res) => {
  const modelName = req.params.model
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path = "./app/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();


      if (modelName == "customer") {
        let datas = [];
        rows.forEach((row) => {
          let data = {
            customer_id: row[0],
            first_name: row[1],
            last_name: row[2],
            age: row[3],
            phone_number: row[4],
            monthly_salary: row[5],
            approved_limit: row[6]
          };

          datas.push(data);

        });
        Customer.bulkCreate(datas)
          .then(() => {
            res.status(200).send({
              message: "Uploaded the file successfully: " + req.file.originalname,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Fail to import data into database!",
              error: error.message,
            });
          });
      }
      if (modelName == "loan") {
        let datas = [];
        rows.forEach((row) => {
          let data = {
            customer_id: row[0],
            loan_id: row[1],
            loan_amount: row[2],
            tenure: row[3],
            interest_rate: row[4],
            monthly_payment: row[5],
            emis: row[6],
            start_date: row[7],
            end_date: row[8]
          };

          datas.push(data);
        });
        Loan.bulkCreate(datas)
          .then(() => {
            res.status(200).send({
              message: "Uploaded the file successfully: " + req.file.originalname,
            });
          })
          .catch((error) => {
            
            res.status(500).send({
              message: "Fail to import data into database!",
              error: error,
            });
          });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};


module.exports = {
  upload
};
