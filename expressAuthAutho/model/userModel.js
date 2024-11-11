import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new Schema({
name: {
    type: String,
    required: [true, 'please fill out your name'],
    
},
email: {
    type: String,
    required: [true, 'please fill out your email'],
    unique: true,
    
},
password: {
    type: String,
    required: [true, 'please fill out your password '],
    minlength: [8, 'password must be greater than 7 characters'],
},
role: {
    type: String,
    enum:['Admin', 'User', 'Editor'],
    //default: 'User', 
},
isVerified: {
    type: Boolean,
    default: false,
},
verificationToken: {
    type: String
},
tokenExpires: {
    type: Date,
}

});

userSchema.pre('save', async function(next){
if(this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
};
next();
});


 export const User = mongoose.model('users', userSchema);

