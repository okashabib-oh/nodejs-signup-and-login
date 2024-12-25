import express from 'express';
import authRoutes from './routes/authRoutes.js';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
dotenv.config()
connectDB();

const app = express();

app.use(express.json());
app.use(morgan());

app.use('/api/auth', authRoutes)

app.listen(process.env.PORT, () => {
    console.log("Server is running");
})