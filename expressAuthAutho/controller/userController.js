import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../model/userModel.js';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT || 5000;

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const register = async (req, res) => {
  console.log('Received registration request:', req.body);
  try {
    const { name, email, password, passwordCheck, role } = req.body; // Ensure role is included
    // Validate required fields
    if (!name || !email || !password || !passwordCheck || !role) {
      console.log('Missing required fields');
      return res.status(400).send('Missing required fields');
    }
    // Validate password match
    if (password !== passwordCheck) {
      console.log('Passwords do not match');
      return res.status(400).send('Passwords do not match');
    }
    // Check if email already exists
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      console.log('Email already taken');
      return res.status(400).send('Email already taken');
    }
    // Hash the password
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const tokenExpires = Date.now() + 60 * 1000; // 1 minute for testing
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role, verificationToken, tokenExpires });
    await user.save();

    const verificationLink = `http://localhost:${PORT}/users/verify-email/${verificationToken}`;
    const msg = {
      to: email,
      from: process.env.EMAIL,
      subject: 'Verify your email',
      html: `<p>Please click <a href="${verificationLink}">here</a> to verify your email</p>`,
    };
    
    try {
      await sgMail.send(msg);
      console.log('Verification email sent to:', email);
    } catch (error) {
      console.error('Error sending verification email to:', email, error);
    }

    // Include the user’s role in the token
    const token = jwt.sign({ _id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    console.log('User registered successfully');
    res.status(201).json(user);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal Server Error');
  }
};

const login = async (req, res) => {
  console.log('Received login request:', req.body);
  try {
    const { email, password } = req.body;
    // Validate required fields
    if (!email || !password) {
      console.log('Missing required fields');
      return res.status(400).send('Missing required fields');
    }
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid Credentials - User not found');
      return res.status(401).send('Invalid Credentials, user not found');
    }
    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid Credentials - Password mismatch');
      return res.status(401).send('Invalid Credentials, password mismatch');
    }
    // Generate JWT with role
    const token = jwt.sign({ _id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    console.log('User logged in successfully');
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error Logging In');
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    const resetLink = `http://localhost:3000/users/reset-password/${token}`;

    const msg = {
      to: email,
      from: process.env.EMAIL,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Password reset email sent to:', email);
    } catch (error) {
      console.error('Error sending password reset email to:', email, error);
    }

    res.send('Password reset link sent to your email');
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).send('Internal Server Error');
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
     
    if(!newPassword || !confirmPassword) return res.send('missed required field');
    if (newPassword !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send('User not found');

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.send('Password has been reset successfully');
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const userData = { register, login, forgotPassword, resetPassword };
