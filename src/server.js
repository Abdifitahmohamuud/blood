require('dotenv').config();
require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const hospitalRoutes = require('./routes/hospitals');
const requestRoutes = require('./routes/requests');
const adminRoutes = require('./routes/admins');

const app = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admins', adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
