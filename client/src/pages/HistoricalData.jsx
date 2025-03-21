import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import axios from "axios";

const HistoricalData = () => {
    const [historicalData, setHistoricalData] = useState([]);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                const response = await axios.get("https://water-quality-backend-v5h7.onrender.com/api/sensors/historical");
                if (response.data.success) {
                    setHistoricalData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching historical data:", error);
            }
        };

        fetchHistoricalData();
    }, []);

    return (
        <div className="flex flex-col items-center p-24">
            <h2 className="text-xl font-bold mb-4">Historical Sensor Data</h2>
            <BarChart width={450} height={300} data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pH" fill="#4caf50" name="pH Level" />
                <Bar dataKey="temperature" fill="#ff5733" name="Temperature (°C)" />
            </BarChart>
        </div>
    );
};

export default HistoricalData;
