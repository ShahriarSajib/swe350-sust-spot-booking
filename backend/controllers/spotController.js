const Spot = require('../models/spotModel');

exports.addNewSpot = (req, res) => {
    const { name, description, location, approval_copy_recipient, rules } = req.body;
    
    // Multer আপলোড করার পর ফাইলের নামটা এখানে পাওয়া যাবে
    const display_image = req.file ? req.file.filename : null;

    Spot.create({ name, description, location, display_image, approval_copy_recipient }, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const spotId = result.insertId;

        // Postman থেকে rules পাঠানোর সময় JSON স্ট্রিং হিসেবে পাঠাতে হয়, তাই parse করতে হতে পারে
        let rulesArray = rules;
        if (typeof rules === 'string') {
            try {
                rulesArray = JSON.parse(rules);
            } catch (e) {
                rulesArray = [rules]; // যদি সিঙ্গেল স্ট্রিং হয়
            }
        }

        if (rulesArray && rulesArray.length > 0) {
            Spot.addRules(spotId, rulesArray, (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                res.status(200).json({ message: "Spot and rules added successfully!", spotId });
            });
        } else {
            res.status(200).json({ message: "Spot added without rules!" });
        }
    });
};

exports.onlyAddRules = (req, res) => {
    const { spot_id, rules } = req.body;

    let rulesArray = rules;
    if (typeof rules === 'string') {
        try {
            rulesArray = JSON.parse(rules);
        } catch (e) {
            rulesArray = [rules];
        }
    }

    if (!spot_id || !rulesArray || rulesArray.length === 0) {
        return res.status(400).json({ error: "Spot ID and rules are required!" });
    }

    Spot.addRules(spot_id, rulesArray, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Rules added successfully to the spot!" });
    });
};

exports.getSpotById = (req, res) => {
    const spotId = req.params.id;

    Spot.getSpotDetails(spotId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Spot not found!" });
        }

        const spot = results[0];

        // '||' সেপারেটর দিয়ে রুলসগুলোকে আলাদা করে অ্যারে বানানো হচ্ছে
        const rulesArray = spot.rules ? spot.rules.split('||') : [];

        // রেসপন্স থেকে 'approval_copy_recipient' বাদ দেওয়া হয়েছে
        res.status(200).json({
            id: spot.id,
            name: spot.name,
            description: spot.description,
            location: spot.location,
            display_image: spot.display_image,
            image1: spot.image1,
            image2: spot.image2,
            image3: spot.image3,
            rules: rulesArray
        });
    });
};