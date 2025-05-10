import express from 'express';
import mongoose from 'mongoose'; 
import dotenv from 'dotenv';
import agentsRouter from './Routes/agents.routes.js';
import addAgents from './Routes/addAgents.routes.js';
import adminsRouter from './Routes/admins.routes.js';
import addAdmins from './Routes/addAdmins.route.js';
import adminSignIn from './Routes/adminSignIn.route.js';
import authRouter from './Routes/authStatus.js';
import notificationsRouter from './Routes/notifications.routes.js';
import contactRouter from './Routes/contact.routes.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import propertyRoutes from './Routes/propertyRoutes.js';



dotenv.config();

const app = express();
// Configure CORS to allow requests from all origins during development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true, // Allow credentials (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Extend timeout for large requests
app.use((req, res, next) => {
  // Set timeout to 5 minutes
  req.setTimeout(300000);
  res.setTimeout(300000);
  next();
});

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});


app.use('/api', agentsRouter);
app.use('/api/agents', addAgents);
app.use('/api', adminsRouter);
app.use('/api/admins', addAdmins);
app.use('/api', adminSignIn);
app.use('/api/admin', authRouter);
app.use('/api/properties', propertyRoutes);
app.use('/api/notifications', notificationsRouter);
// Contact routes
console.log('Registering contact routes at /api/contact');
app.use('/api/contact', contactRouter);




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




