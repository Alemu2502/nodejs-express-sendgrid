import express from 'express';
import dotenv from 'dotenv';
import { router } from './route/userRoute.js';
import cookieParser from 'cookie-parser';
import { connectDB } from './controller/mongodbConn.js';
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
connectDB();
app.use('/users', router);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

import './controller/removeUnverifiedUser.js';
