import {User} from '../model/userModel.js';

 export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
const user = await User.findOne({ verificationToken: token, tokenExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).send('Token is invalid or has expired');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.tokenExpires = undefined;

    await user.save();
    res.send('Email has been verified successfully');
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    res.status(500).send('Internal Server Error');
  }
};

