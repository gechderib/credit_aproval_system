const { checkLoanEligibility, calculateEMI } = require("../middleware/check-eligibility.middleware");

const checkLoanEligibilityController = async (req, res) => {
    const customerData = req.body;
    // Process loan data
    const [loan_status, interest_rate] = await checkLoanEligibility(customerData);
    const monthly_installment = calculateEMI(customerData.loan_amount,customerData.interest_rate,customerData.tenure)
    const result = {
        customer_id: customerData.customer_id,
        loan_status,
        approval:interest_rate != 0,
        interest_rate: customerData.interest_rate,
        tenure: customerData.tenure,
        corrected_interest_rate: Math.min(interest_rate, 16),
        monthly_installment:monthly_installment
    };
    res.status(200).json(result);
}


module.exports = { checkLoanEligibilityController }