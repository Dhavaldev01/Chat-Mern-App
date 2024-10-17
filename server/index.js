import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const Port = process.env.PORT || 3000 ;
const databaseURL = process.env.DATABASE_URL ;

app.use(cors());
const server = app.listen(Port , () =>{
        console.log(`Server is running http://localhost:${Port}`);
});

console.log(databaseURL)

mongoose.connect(databaseURL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

