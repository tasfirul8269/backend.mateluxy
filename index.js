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
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import propertyRoutes from './Routes/propertyRoutes.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

dotenv.config();

const app = express();

// Security middleware
// Set security HTTP headers
app.use(helmet());

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://mateluxy-frontend-sudw.vercel.app',
  'https://real-state-frontend-sigma.vercel.app',
  'https://frontend-mateluxy.vercel.app'
];
  
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // Cache preflight requests for 24 hours
}));

// Body parsers with size limits
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

// CSRF protection middleware
app.get('/api/csrf-token', (req, res) => {
  // Generate a CSRF token
  const csrfToken = require('crypto').randomBytes(32).toString('hex');
  
  // Set the token in a cookie
  res.cookie('XSRF-TOKEN', csrfToken, {
    httpOnly: false, // Must be accessible from JavaScript
    secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-site requests
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
  
  // Send the token in the response
  res.status(200).json({ csrfToken });
});

// Verify CSRF token for non-GET requests
app.use((req, res, next) => {
  // Skip for GET requests and the CSRF token endpoint
  if (req.method === 'GET' || req.path === '/api/csrf-token') {
    return next();
  }
  
  // Get the CSRF token from the request header
  const csrfToken = req.headers['x-xsrf-token'];
  
  // Get the CSRF token from the cookie
  const csrfCookie = req.cookies['XSRF-TOKEN'];
  
  // If in development mode, allow requests without CSRF token
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  
  // Verify that the tokens match
  if (!csrfToken || !csrfCookie || csrfToken !== csrfCookie) {
    return res.status(403).json({ 
      success: false, 
      message: 'CSRF token validation failed' 
    });
  }
  
  next();
});

// Database connection
mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Routes
app.use('/api', agentsRouter);
app.use('/api/agents', addAgents);
app.use('/api', adminsRouter);
app.use('/api/admins', addAdmins);
app.use('/api', adminSignIn);
app.use('/api/admin', authRouter);
app.use('/api/properties', propertyRoutes);
app.use('/api/notifications', notificationsRouter);

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(err);
    }
    
    return res.status(statusCode).json({ 
        success: false,
        status: statusCode,
        message,
        // Include stack trace only in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
     });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});




