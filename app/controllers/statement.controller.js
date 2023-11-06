const db = require("../models/index")
const Loan = db.loan;


const viewLoanStatement = async (req, res) => {
    const { customer_id, loan_id } = req.params;

    try {
        // Fetch the loan record
        const loan = await Loan.findOne({ where: { customer_id, loan_id } });

        if (!loan) {
            return res.status(404).json({ error: 'Loan not found' });
        }

        // Calculate the number of EMIs left
        const emisPaid = loan.emis || 0;
        const repaymentsLeft = loan.tenure - emisPaid;

        // Prepare the response body
        const statement = {
            customer_id: loan.customer_id,
            loan_id: loan.loan_id,
            principal: loan.loan_amount,
            interest_rate: loan.interest_rate,
            // amount_paid: loan.paid_amount,
            monthly_installment: loan.monthly_payment,
            repayments_left: repaymentsLeft,
        };

        res.status(200).json(statement);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' || error.message });
    }
}


module.exports = {viewLoanStatement}