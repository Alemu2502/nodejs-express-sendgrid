import jwt from 'jsonwebtoken';
import { User } from '../model/userModel.js';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Bearer realm="Access to the protected resource"');
    return res.status(403).send('Access Denied: No token provided');
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    res.setHeader('WWW-Authenticate', 'Bearer realm="Access to the protected resource"');
    return res.status(401).send('Access Denied: Malformed token');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Decoded token:', decoded);  // Log decoded token for debugging

    const user = await User.findById(decoded._id);
    if (!user) {
      console.log('User not found');
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.setHeader('WWW-Authenticate', 'Bearer error="invalid_token"');
    res.status(401).send('Invalid token');
  }
};
