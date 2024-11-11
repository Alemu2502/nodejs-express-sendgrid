import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const permissions = {
  Admin: ['createUser', 'deleteUser', 'updateUser', 'getUser'],
  Editor: ['updateUser', 'getUser'],
  User: ['getUser']
};

export const authorize = (roles = [], permissionsRequired = []) => {
  if (typeof roles === 'string') roles = [roles];
  if (typeof permissionsRequired === 'string') permissionsRequired = [permissionsRequired];

  return (req, res, next) => {
    const token = req.cookies?.token; // Safe access to cookies
    if (!token) return res.status(401).send('Access Denied');
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      console.log('Decoded token:', decoded); // Log decoded token

      if (roles.length && !roles.includes(req.user.role)) {
        console.log(`Role mismatch: required roles - ${roles}, user role - ${req.user.role}`); // Log role mismatch
        return res.status(403).send('Forbidden');
      }
      const userPermissions = permissions[req.user.role] || [];
      const hasPermission = permissionsRequired.every(permission => userPermissions.includes(permission));
      if (!hasPermission) {
        console.log(`Permission mismatch: required permissions - ${permissionsRequired}, user permissions - ${userPermissions}`); // Log permission mismatch
        return res.status(403).send('Forbidden');
      }
      next();
    } catch (err) {
      console.log('Token verification failed:', err.message); // Log token verification failure
      return res.status(401).send('Invalid Token');
    }
  };
};
