require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const ActivityRouter = require('./activity/activity-router');
const CategoriesRouter = require('./categories/categories-router')
const authRouter = require('./auth/auth-router')
const userRouter = require('./user/user-router')

const profileRouter = require('./profile/profile-router')

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'dev';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.options('*', cors());


app.use('/api/activity', ActivityRouter);
app.use('/api/categories', CategoriesRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/profile', profileRouter)




app.use('/', (error, req, res, next) => {
    let response;
    if (NODE_ENV === 'production') {
        response = {error: {message: 'server error'}}
    }
    else {
        response = {message: error.message, error}
    }
    res.status(500).json(response)
});


module.exports = app;