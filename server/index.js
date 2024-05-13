import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import passwordRoutes from './routes/passwordRoutes.js'
import accountRoutes from './routes/accountRoutes.js'
import { passwordGenerator } from './controllers/passwordGeneratorControllers.js';

const app = express();

// setup
app.use(express.json());
app.use(express.urlencoded({limit: '15mb', extended: true}));
app.use(cookieParser())
app.use(cors());
app.use(helmet());

app.post('/generate', passwordGenerator);

// routes
app.use('/accounts', accountRoutes)
app.use('/passwords', passwordRoutes)

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    })
  }).catch((err) => {
    console.log(err);
  });