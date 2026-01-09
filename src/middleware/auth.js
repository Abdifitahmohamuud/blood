const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Admin = require('../models/Admin');

// protect routes
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded: { id, role }
    if (decoded.role === 'user') {
      req.user = await User.findById(decoded.id).select('-password');
    } else if (decoded.role === 'hospital') {
      req.hospital = await Hospital.findById(decoded.id).select('-password');
    } else if (decoded.role === 'admin') {
      req.admin = await Admin.findById(decoded.id).select('-password');
    }
    req.auth = decoded; // keep payload
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token invalid' });
  }
};

// role based
exports.authorize = (...roles) => {
  return (req, res, next) => {
    const role = req.auth?.role;
    if (!roles.includes(role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    next();
  };
};
