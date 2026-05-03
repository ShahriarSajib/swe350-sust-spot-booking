const { Approver, Spot } = require('../models/approverModel'); 

const getApprovalDetails = async (req, res) => {
    try {
        const { spot_id } = req.params;

        // 1. Fetch the spot details
        const spot = await Spot.getById(spot_id);
        
        if (!spot) {
            return res.status(404).json({ message: "Spot not found" });
        }

        // 2. Helper to parse and fetch approvers from an order array
        const fetchApproversFromOrder = async (orderSource) => {
            if (!orderSource) return [];
            try {
                const order = typeof orderSource === 'string' ? JSON.parse(orderSource) : orderSource;
                const list = await Promise.all(order.map(id => Approver.getById(id)));
                return list.filter(Boolean);
            } catch (e) {
                return [];
            }
        };

        // 3. Fetch BOTH lists in parallel
        const [internalApprovers, externalApprovers] = await Promise.all([
            fetchApproversFromOrder(spot.approval_order),
            fetchApproversFromOrder(spot.external_approval_order)
        ]);

        // 4. Return everything back to the frontend
        res.status(200).json({
            success: true,
            rules: spot.rules,
            internalApprovers, // Used in your standard PDF
            externalApprovers  // Used in your External Modal
        });

    } catch (error) {
        console.error("Error in getApprovalDetails:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getApprovalDetails };