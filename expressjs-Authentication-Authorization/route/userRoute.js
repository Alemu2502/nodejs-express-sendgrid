import { userData } from "../controller/userController.js";
import express from "express";
import { authenticate } from "../controller/auth.js";
import { verifyEmail } from "../controller/verifyEmail.js";
import { authorize } from "../controller/Roles.js";
import { User } from "../model/userModel.js";

export const router = express.Router();

router.post('/register', userData.register);
router.post('/login', userData.login);
    
router.get('/protected', authenticate, (req, res)=>{
              res.send('this is protected route');
       });

router.post('/forgot-password', userData.forgotPassword);
router.post('/reset-password/:token', userData.resetPassword);       
router.post('/verify-email/:token', verifyEmail); 

router.post('/admin/create-user', authorize('Admin', 'createUser'), (req, res) => {
       res.send('User created');
     });
     
router.delete('/admin/delete-user/:_id', authorize('Admin', 'deleteUser'), (req, res) => {
       res.send('User deleted');
     });
     
router.get('/editor/update-user/:_id', authorize('Editor', 'updateUser'), (req, res) => {
       res.send('Content edited');
     });
     
router.get('/user/view-user', authorize(['Admin', 'Editor', 'User'], 'getUser'), (req, res) => {
       res.json(User).send('Content viewed');
     });
     
     

      