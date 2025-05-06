import express from 'express';
import mongoose from 'mongoose'; 
import dotenv from 'dotenv';
import agentsRouter from './Routes/agents.routes.js';
import addAgents from './Routes/addAgents.routes.js';
import adminsRouter from './Routes/admins.routes.js';
import addAdmins from './Routes/addAdmins.route.js';
import adminSignIn from './Routes/adminSignIn.route.js';
import authRouter from './Routes/authStatus.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import propertyRoutes from './Routes/propertyRoutes.js';



dotenv.config();

const app = express();
const allowedOrigins = [
    'http://localhost:5173',
    'https://mateluxy-frontend-sudw.vercel.app',
    'https://real-state-frontend-sigma.vercel.app',
    'https://frontend-mateluxy.vercel.app'
  ];
  
  app.use(cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // if you're using cookies/auth
  }));

app.use(bodyParser.json());
app.use(express.json());


mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});


app.use('/api', agentsRouter);
app.use('/api/agents', addAgents);
app.use('/', adminsRouter);
app.use('/admins', addAdmins);
app.use('/api', adminSignIn);
app.use(cookieParser());
app.use('/api/admin', authRouter);
app.use('/api/properties', propertyRoutes);




app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({ 
        success: false,
        status: statusCode,
        message
     });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on  ${PORT}`);
});




