const Spot = require('../models/spotModel');

exports.addNewSpot = async (req, res) => {
    try {
        const { name, description, location, approval_copy_recipient, rules } = req.body;
        const display_image = req.file ? req.file.filename : null;

        // Create the spot
        const result = await Spot.create({ name, description, location, display_image, approval_copy_recipient });
        const spotId = result.insertId;

        // Parse rules
        let rulesArray = rules;
        if (typeof rules === 'string') {
            try {
                rulesArray = JSON.parse(rules);
            } catch (e) {
                rulesArray = [rules];
            }
        }

        // Add rules if they exist
        if (rulesArray && rulesArray.length > 0) {
            await Spot.addRules(spotId, rulesArray);
            return res.status(200).json({ message: "Spot and rules added successfully!", spotId });
        } 
        
        res.status(200).json({ message: "Spot added without rules!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSpotById = async (req, res) => {
    try {
        const spotId = req.params.id;
        console.log("spot_id request:", req.params.id)
        const results = await Spot.getSpotDetails(spotId);

        if (results.length === 0) {
            return res.status(404).json({ message: "Spot not found!" });
        }

        const spot = results[0];
        const rulesArray = spot.rules ? spot.rules.split('||') : [];

        res.status(200).json({
            id: spot.spot_id, // Adjusted to match your SQL column name
            name: spot.name,
            description: spot.description,
            location: spot.location,
            display_image: spot.display_image,
            image1: spot.image1,
            image2: spot.image2,
            image3: spot.image3,
            rules: rulesArray
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.onlyAddRules = async (req, res) => {
    try {
        const { spot_id, rules } = req.body;

        if (!spot_id || !rules) {
            return res.status(400).json({ error: "Spot ID and rules are required!" });
        }

        // Logic to parse rules if they come as a string or array
        let rulesArray = rules;
        if (typeof rules === 'string') {
            try {
                rulesArray = JSON.parse(rules);
            } catch (e) {
                rulesArray = [rules];
            }
        }

        // Call the model method (which we already updated to be async)
        await Spot.addRules(spot_id, rulesArray);

        res.status(200).json({ message: "Rules added successfully to the spot!" });
    } catch (err) {
        console.error("Error adding rules:", err);
        res.status(500).json({ error: err.message });
    }
};