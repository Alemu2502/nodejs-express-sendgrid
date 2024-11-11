import { connectDB } from './mongodbConn.js';
import cron from 'node-cron';
import { User } from '../model/userModel.js';

// Schedule the cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  await connectDB();
  const currentTime = new Date().toISOString();
  console.log('Cron job executed at:', currentTime);
  try {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000; // 1 day ago
    console.log('Checking for users with tokens expired before:', new Date(oneDayAgo).toISOString());
    
    const unverifiedUsers = await User.find({ tokenExpires: { $lt: oneDayAgo }, isVerified: false });
    console.log(`Found ${unverifiedUsers.length} unverified users to remove at ${currentTime}:`, unverifiedUsers);
    
    const result = await User.deleteMany({ tokenExpires: { $lt: oneDayAgo }, isVerified: false });
    console.log(`Deleted ${result.deletedCount} expired unverified users at ${currentTime}`);
  } catch (error) {
    console.error('Error cleaning up expired users:', error.message, error.stack);
  }
});
//the follow code are only for testing purpose locally
// import { connectDB } from './mongodbConn.js';
// import cron from 'node-cron';
// import { User } from '../model/userModel.js';

// // Schedule the cron job to run every 2 minutes
// cron.schedule('*/2 * * * *', async () => {
//   await connectDB();
//   const currentTime = new Date().toISOString();
//   console.log('Cron job executed at:', currentTime);
//   try {
//     const oneMinuteAgo = Date.now() - 60 * 1000; // 1 minute ago
//     console.log('Checking for users with tokens expired before:', new Date(oneMinuteAgo).toISOString());

//     const unverifiedUsers = await User.find({ tokenExpires: { $lt: oneMinuteAgo }, isVerified: false });
//     console.log(`Found ${unverifiedUsers.length} unverified users to remove at ${currentTime}:`, unverifiedUsers);

//     const result = await User.deleteMany({ tokenExpires: { $lt: oneMinuteAgo }, isVerified: false });
//     console.log(`Deleted ${result.deletedCount} expired unverified users at ${currentTime}`);
//   } catch (error) {
//     console.error('Error cleaning up expired users:', error.message, error.stack);
//   }
// });


