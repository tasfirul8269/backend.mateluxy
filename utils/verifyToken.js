// backend/middleware/verifyToken.js
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT tokens
 * Supports both cookie-based and header-based authentication
 */
export const verifyToken = (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.access_token;
    
    // If no token in cookie, check Authorization header
    if (!token && req.headers.authorization) {
      // Format should be "Bearer [token]"
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    // If no token found, return unauthorized
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required. Please log in." 
      });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if token is expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        return res.status(401).json({ 
          success: false, 
          message: "Token expired. Please log in again." 
        });
      }
      
      // Attach user data to request
      req.user = decoded;
      next();
    } catch (jwtError) {
      // Handle different JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: "Token expired. Please log in again." 
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid token. Please log in again." 
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication failed. Please log in again." 
        });
      }
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error during authentication." 
    });
  }
};

/**
 * Middleware to verify admin role
 * Must be used after verifyToken
 */
export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: "Authentication required" 
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: "Admin access required" 
    });
  }
  
  next();
};

/**
 * Middleware to verify agent role
 * Must be used after verifyToken
 */
export const verifyAgent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: "Authentication required" 
    });
  }
  
  if (req.user.role !== 'agent') {
    return res.status(403).json({ 
      success: false, 
      message: "Agent access required" 
    });
  }
  
  next();
};
