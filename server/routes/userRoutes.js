import express from "express";
import { createUser, getUser, updateUser, deleteUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/create', createUser);
userRouter.get('/get', getUser);
userRouter.put('/update/:id', updateUser);
userRouter.delete('/delete/:id', deleteUser);

export default userRouter;