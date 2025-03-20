import thresholdModel from "../models/thresholdModel.js";

// Create a new threshold
export const createThreshold = async (req, res) => {
    try {
        const { pH_min, pH_max, temp_min, temp_max} = req.body;

        // Validation
        if (pH_min < 0 || pH_max > 14 || pH_min >= pH_max) {
            return res.status(400).json({ success: false, message: "Invalid pH range (must be between 0-14 and min < max)" });
        }
        if (temp_min >= temp_max) {
            return res.status(400).json({ success: false, message: "Invalid temperature range (min must be less than max)" });
        }

        const newThreshold = await thresholdModel.create({ pH_min, pH_max, temp_min, temp_max});
        res.status(201).json({ success: true, data: newThreshold });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all thresholds
export const getThresholds = async (req, res) => {
    try {
        const thresholds = await thresholdModel.find();
        res.status(200).json({ success: true, data: thresholds });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a threshold
export const updateThreshold = async (req, res) => {
    try {
        const threshold = await thresholdModel.findById(req.params.id);
        if (!threshold) {
            return res.status(404).json({ success: false, message: "Threshold not found" });
        }
        const { pH_min, pH_max, temp_min, temp_max } = req.body;
        // Validation
        if (pH_min !== undefined && (pH_min < 0 || pH_min > 14)) {
            return res.status(400).json({ success: false, message: "pH_min must be between 0-14" });
        }
        if (pH_max !== undefined && (pH_max < 0 || pH_max > 14)) {
            return res.status(400).json({ success: false, message: "pH_max must be between 0-14" });
        }
        if (pH_min !== undefined && pH_max !== undefined && pH_min >= pH_max) {
            return res.status(400).json({ success: false, message: "pH_min must be less than pH_max" });
        }
        if (temp_min !== undefined && temp_max !== undefined && temp_min >= temp_max) {
            return res.status(400).json({ success: false, message: "temp_min must be less than temp_max" });
        }
        const updatedThreshold = await threshold.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedThreshold });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};