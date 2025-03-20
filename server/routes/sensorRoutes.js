import express from 'express';
import { storeSensorData, getLatestSensorData, getHistoricalSensorData } from '../controllers/sensorController.js';

const sensorRouter = express.Router();

sensorRouter.post('/store', storeSensorData);
sensorRouter.get('/latest', getLatestSensorData);
sensorRouter.get('/historical', getHistoricalSensorData);

export default sensorRouter;