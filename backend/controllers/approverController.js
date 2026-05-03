const { Approver, Spot } = require('../models/approverModel');
const db = require('../config/db');

const getApprovalDetails = async (req, res) => {
    try {
        const { spot_id } = req.params;

        // 1. Fetch the spot details
        const spot = await Spot.getById(spot_id);
        if (!spot) return res.status(404).json({ message: "Spot not found" });

        // --- HELPER FUNCTION (Must be defined to be used) ---
        const fetchApproversFromOrder = async (orderSource) => {
            if (!orderSource) return [];
            try {
                const order = typeof orderSource === 'string' ? JSON.parse(orderSource) : orderSource;
                const list = await Promise.all(order.map(id => Approver.getById(id)));
                return list.filter(Boolean);
            } catch (e) { return []; }
        };

        // 2. Fetch all raw data parts
        const [additionalRecipients] = await db.query(
            'SELECT recipient_email AS approver_email, recipient_designation AS approver_designation FROM approval_copy_recipients WHERE spot_id = ?',
            [spot_id]
        );

        const officialApprovers = await fetchApproversFromOrder(spot.approval_order);
        const externalList = await fetchApproversFromOrder(spot.external_approval_order);

        // 3. Merge: Recipients FIRST, then Official Approvers
        const rawCombined = [...additionalRecipients, ...officialApprovers];

        // 4. De-duplicate using Map (Key = Email)
        const uniqueMap = new Map();
        rawCombined.forEach(item => {
            if (item.approver_email) {
                uniqueMap.set(item.approver_email.toLowerCase(), item);
            }
        });

        // 5. Convert back to array (Insertion order is preserved)
        const finalInternalList = Array.from(uniqueMap.values());

        res.status(200).json({
            success: true,
            rules: spot.rules,
            internalApprovers: finalInternalList, 
            externalApprovers: externalList 
        });

    } catch (error) {
        console.error("Error in getApprovalDetails:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getApprovalDetails };