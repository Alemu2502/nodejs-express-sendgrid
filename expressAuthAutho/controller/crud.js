import { User } from "../model/userModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const createUser = async (req, res) => {
  try {
    const { name, email, password, passwordCheck, role } = req.body;
    if (!name || !email || !password || !passwordCheck || !role) return res.status(400).send('Missing required fields');
    if (password !== passwordCheck) return res.status(400).send('Passwords do not match');
    
    const existEmail = await User.findOne({ email });
    if (existEmail) return res.status(400).send('Email already taken');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign({ _id: newUser._id, role: newUser.role }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).send('Error creating user');
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.status(200).send('User deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) return res.status(400).send('Missing required fields');
    
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true });
    if (!updatedUser) return res.status(404).send('User not found');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send('Error updating user');
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send('Error retrieving user');
  }
};

export const userData = { createUser, deleteUser, getUser, updateUser };
