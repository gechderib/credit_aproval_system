const { DataTypes } = require("sequelize")


const loanModel = (sequelize, Sequelize) => {
    const Loan = sequelize.define("loan", {
        loan_id: {
            type: DataTypes.INTEGER,
            // primaryKey: true,
            // autoIncrement: true,
        },
        customer_id: {
            type: DataTypes.INTEGER
        },
        loan_amount:{
            type: DataTypes.DOUBLE
        },
        tenure: {
            type:DataTypes.INTEGER
        },
        interest_rate:{
            type:DataTypes.DOUBLE
        },
        monthly_payment:{
            type: DataTypes.DOUBLE
        },
        emis:{
            type: DataTypes.DOUBLE
        },
        start_date:{
            type:DataTypes.DATE
        },
        end_date:{
            type:DataTypes.DATE
        }

    })

    return Loan
}


module.exports = loanModel