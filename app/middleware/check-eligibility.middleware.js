const db = require("../models/index")
const Customer = db.customer;
const Loan = db.loan;


const calculateCreditScore = async (customerData) => {
    let num_loans_taken = 0;
    let past_loans_paid_on_time;
    let loan_activity_current_year;
    let loan_approved_volume = 0;
    let sum_current_loans = 0;

    try {
        let creditScore = 0;
        
        const customerLoan = await Loan.findAll({ where: { customer_id: customerData.customer_id }, include: ["customer"] })
        if (customerLoan) {
            num_loans_taken = customerLoan.length
            past_loans_paid_on_time = customerLoan.filter((loan) => loan.emis > 0).length > 0

            const currentYear = new Date().getFullYear();
            const loansInCurrentYear = customerLoan.filter((loan) => {
                const loanYear = new Date(loan.start_date).getFullYear();
                return loanYear === currentYear;
            });

            loan_activity_current_year = loansInCurrentYear.length > 0;
            const totalLoanAmount = customerLoan.reduce((total, loan) => total + loan.loan_amount, 0);
            sum_current_loans = totalLoanAmount
            loan_approved_volume = totalLoanAmount <= customerData.loan_amount

            if (past_loans_paid_on_time) {
                creditScore += 20;
            }
            if (num_loans_taken > 0) {
                creditScore += Math.min(10, num_loans_taken * 2);
            }
            if (loan_activity_current_year) {
                creditScore += 10;
            }
            if (sum_current_loans <= loan_approved_volume) {
                creditScore += 20;
            }
        }
        return creditScore;
    } catch (err) {
        return "error happen while loading the data"
    }

}


const checkLoanEligibility = async (customerData) => {
    let monthly_salary;
    let sum_current_emis;
    const credit_score = await calculateCreditScore(customerData)
    const interest_rate = customerData.interest_rate;
    try {
        const customer = await Customer.findByPk(customerData.customer_id)
        if (customer) {
            monthly_salary = customer.monthly_salary
            sum_current_emis = await Loan.sum('emis', { where: { customer_id: customerData.customer_id } })

            if (credit_score > 50) {
                if (sum_current_emis <= 0.5 * monthly_salary) {
                    return ['Loan Approved', interest_rate];
                }
            } else if (30 < credit_score && credit_score <= 50) {
                return ['Loan Approved with interest rate > 12%', Math.max(interest_rate, 12)];
            } else if (10 < credit_score && credit_score <= 30) {
                return ['Loan Approved with interest rate > 16%', Math.max(interest_rate, 16)];
            }

            return ['Loan Not Approved', 0];
        }
    } catch (err) {
        return ["Loan Not approve error happen",0]
    }

}

function calculateEMI(loan_amount, annualInterestRate, tenureInMonths) {

    const monthlyInterestRate = (annualInterestRate / 12) / 100;

    const emi = loan_amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths) / (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);
  
    return emi;
  }
  


module.exports = {checkLoanEligibility,calculateCreditScore, calculateEMI}