import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ThresholdSettings = () => {
    const [thresholds, setThresholds] = useState([]);
    const [formData, setFormData] = useState({
        pH_min: "",
        pH_max: "",
        temp_min: "",
        temp_max: "",
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchThresholds();
    }, []);

    const fetchThresholds = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/thresholds/get-thresholds");
            if (response.data.success) {
                setThresholds(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching thresholds:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value ? parseFloat(e.target.value) : "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { pH_min, pH_max, temp_min, temp_max } = formData;

        if (pH_min < 0 || pH_max > 14 || pH_min >= pH_max) {
            toast.error("Invalid pH range! Must be between 0-14 and min < max.");
            return;
        }
        if (temp_min >= temp_max) {
            toast.error("Invalid temperature range! Min must be less than max.");
            return;
        }

        try {
            if (editingId) {
                const response = await axios.put(
                    `http://localhost:4000/api/thresholds/update-thresholds/${editingId}`,
                    formData
                );
                console.log("Update Response:", response);
                if (response.data.success) {
                    toast.success("Threshold updated successfully!");
                }
            } else {
                const response = await axios.post("http://localhost:4000/api/thresholds/create-threshold", formData);
                console.log("Create Response:", response);
                if (response.data.success) {
                    toast.success("Threshold added successfully!");
                }
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to save threshold!");
        }
    };

    const handleEdit = (threshold) => {
        setFormData({
            pH_min: threshold.pH_min,
            pH_max: threshold.pH_max,
            temp_min: threshold.temp_min,
            temp_max: threshold.temp_max,
        });
        setEditingId(threshold._id);
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Threshold Settings</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="pH_min"
                        placeholder="pH Min"
                        value={formData.pH_min}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded w-full"
                    />
                    <input
                        type="number"
                        name="pH_max"
                        placeholder="pH Max"
                        value={formData.pH_max}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded w-full"
                    />
                    <input
                        type="number"
                        name="temp_min"
                        placeholder="Temperature Min (°C)"
                        value={formData.temp_min}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded w-full"
                    />
                    <input
                        type="number"
                        name="temp_max"
                        placeholder="Temperature Max (°C)"
                        value={formData.temp_max}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    {editingId ? "Update Threshold" : "Save Threshold"}
                </button>
            </form>

            {/* Display Thresholds */}
            <h3 className="text-xl font-semibold mt-6 text-center">Existing Thresholds</h3>
            <ul className="mt-4">
                {thresholds.map((threshold) => (
                    <li key={threshold._id} className="p-3 border rounded flex justify-between items-center bg-white shadow-sm mt-2">
                        <span>
                            <strong>pH:</strong> {threshold.pH_min} - {threshold.pH_max} |
                            <strong> Temp:</strong> {threshold.temp_min}°C - {threshold.temp_max}°C
                        </span>
                        <button
                            onClick={() => handleEdit(threshold)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 cursor-none"
                        >
                            Edit
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThresholdSettings;
