const { calculateEMI } = require("../middleware/check-eligibility.middleware");
const db = require("../models/index")
const Loan = db.loan;

const paymentController = async (req, res) => {
    const { customer_id, loan_id } = req.params;
    const { payment_amount } = req.body;

    try {
        // Fetch the loan record
        const loan = await Loan.findOne({ where: { customer_id, loan_id } });

        if (!loan) {
            return res.status(404).json({ error: 'Loan not found' });
        }

        const dueInstallment = calculateEMI(loan.loan_amount, loan.interest_rate, loan.tenure);

        if (payment_amount < dueInstallment) {
            return res.status(400).json({ error: 'Insufficient payment amount' });
        }


        if (payment_amount > dueInstallment) {
            // Recalculate the monthly_payment
            loan.monthly_payment = calculateEMI(
                loan.loan_amount - payment_amount,
                loan.interest_rate,
                loan.tenure
            );
        }

        await loan.save();

        return res.status(200).json({ message: 'Payment processed successfully', loan });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {paymentController}