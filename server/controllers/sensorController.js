import sensorModel from "../models/sensorModel.js";
// Store Data
export const storeSensorData = async (req, res) => {
    try {
        const { pH, temperature } = req.body;
        // Validate input
        if (pH === undefined || temperature === undefined) {
            return res.status(400).json({ success: false, message: "pH and temperature are required" });
        }
        // Create a new sensor data entry
        const newSensorData = new sensorModel({ pH, temperature });
        // Save to MongoDB
        await newSensorData.save();
        return res.status(201).json({ success: true, message: "Sensor data stored successfully", data: newSensorData });
    } catch (error) {
        console.error("Error storing sensor data:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// get latest data
export const getLatestSensorData = async (req, res) => {
    try {
        // const { device_id } = req.params;
        // Fetch the most recent sensor data for the device
        const latestData = await sensorModel.findOne()
            .sort({ timestamp: -1 }) // Sort by timestamp in descending order
            .exec();
        if (!latestData) {
            return res.status(404).json({ message: "No sensor data found for this device" });
        }
        res.status(200).json({ success: true, message: "Latest sensor data retrieved successfully", data: latestData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching latest sensor data", error: error.message });
    }
};

// Get historical sensor data
export const getHistoricalSensorData = async (req, res) => {
    try {
        const historicalData = await sensorModel.find().sort({ timestamp: -1 }).limit(10); // Fetch last 50 entries
        res.status(200).json({ success: true, data: historicalData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching historical data", error });
    }
};