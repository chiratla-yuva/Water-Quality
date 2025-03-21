import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import axios from "axios";

const RealtimeData = () => {
    const [sensorData, setSensorData] = useState(null);

    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                const response = await axios.get("https://water-quality-backend-v5h7.onrender.com/api/sensors/latest");
                if (response.data.success) {
                    setSensorData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching sensor data:", error);
            }
        };

        fetchSensorData();
        const interval = setInterval(fetchSensorData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col sm:flex-col items-center justify-center p-20">
            <h2 className="text-xl font-bold mb-4">Realtime Sensor Data</h2>
            {sensorData ? (
                <div className="flex flex-col sm:flex-row gap-6">
                    
                    {/* pH Bar Chart */}
                    <div className="p-4 bg-white shadow-lg rounded-lg">
                        <h3 className="text-lg font-semibold text-center">pH Level</h3>
                        <BarChart width={300} height={200} data={[{ name: "pH", value: sensorData.pH }]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 14]} />
                            <Tooltip />
                            <Bar dataKey="value" fill={sensorData.pH <= 7 ? "#4caf50" : "#ffcc00"} />
                        </BarChart>
                        <p className="text-center mt-2">pH = {sensorData.pH}</p>
                    </div>

                    {/* Temperature Bar Chart */}
                    <div className="p-4 bg-white shadow-lg rounded-lg">
                        <h3 className="text-lg font-semibold text-center">Temperature (°C)</h3>
                        <BarChart width={300} height={200} data={[{ name: "Temperature", value: sensorData.temperature }]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="value" fill={sensorData.temperature < 20 ? "#4d79ff" : sensorData.temperature > 30 ? "#ff4d4d" : "#4caf50"} />
                        </BarChart>
                        <p className="text-center mt-2">Temperature =  {sensorData.temperature}°C</p>
                    </div>

                </div>
            ) : (
                <p>Loading sensor data...</p>
            )}
        </div>
    );
};

export default RealtimeData;
