const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const householdRoutes = require('./routes/household.routes');
const tdsRoutes = require('./routes/tds.routes');
const reportRoutes = require('./routes/report.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json());


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // max 10 login attempts per 15 minutes
    message: { message: 'Too many login attempts, please try again after 15 minutes' }
});


app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});


app.use('/api/auth', authRoutes);
app.use('/api/auth/login', loginLimiter);
app.use('/api/households', householdRoutes);
app.use('/api/tds', tdsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'TapAware API is running!' });
});

module.exports = app;