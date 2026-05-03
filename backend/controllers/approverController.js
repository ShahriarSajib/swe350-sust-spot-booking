const { Approver, Spot } = require('../models/approverModel');
const db = require('../config/db'); // Ensure you have access to the DB for the raw query

const getApprovalDetails = async (req, res) => {
    try {
        const { spot_id } = req.params;

        // 1. Fetch the spot details
        const spot = await Spot.getById(spot_id);
        if (!spot) return res.status(404).json({ message: "Spot not found" });

        // 2. Helper to fetch approvers from the 'approver' table (via spot order columns)
        const fetchApproversFromOrder = async (orderSource) => {
            if (!orderSource) return [];
            try {
                const order = typeof orderSource === 'string' ? JSON.parse(orderSource) : orderSource;
                const list = await Promise.all(order.map(id => Approver.getById(id)));
                return list.filter(Boolean);
            } catch (e) { return []; }
        };

        // 3. NEW QUERY: Fetch additional recipients from 'approval_copy_recipients' table
        const [additionalRecipients] = await db.query(
            'SELECT recipient_email AS approver_email, recipient_designation AS approver_designation FROM approval_copy_recipients WHERE spot_id = ?',
            [spot_id]
        );

        // 4. Fetch the standard lists
        const [internalList, externalApprovers] = await Promise.all([
            fetchApproversFromOrder(spot.approval_order),
            fetchApproversFromOrder(spot.external_approval_order)
        ]);

        // 5. MERGE & DE-DUPLICATE (Specifically for internal copy)
        // We combine internalList and additionalRecipients
        const combinedInternal = [...internalList, ...additionalRecipients];
        
        // Use a Map to keep only unique entries based on email
        const uniqueInternalMap = new Map();
        combinedInternal.forEach(item => {
            if (item.approver_email) {
                uniqueInternalMap.set(item.approver_email.toLowerCase(), item);
            }
        });

        res.status(200).json({
            success: true,
            rules: spot.rules,
            internalApprovers: Array.from(uniqueInternalMap.values()), // Unique list
            externalApprovers: externalApprovers
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getApprovalDetails };