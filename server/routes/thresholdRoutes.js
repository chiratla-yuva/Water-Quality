import express from 'express';
import { createThreshold, getThresholds, updateThreshold } from '../controllers/thresholdController.js';

const thresholdRouter = express.Router();

thresholdRouter.post('/create-threshold', createThreshold);
thresholdRouter.get('/get-thresholds', getThresholds);
thresholdRouter.put('/update-thresholds/:id', updateThreshold);

export default thresholdRouter;