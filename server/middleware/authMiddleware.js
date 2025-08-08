const jwt = require('jsonwebtoken');

exports.verifyUser = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Verified User:', decoded);  // Add this
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Token Verification Failed:', err.message);
    res.status(400).json({ message: 'Invalid Token' });
  }
};


exports.verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Not an admin.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Token Verification Failed:', err.message);
    return res.status(400).json({ message: 'Invalid Token' });
  }
};
