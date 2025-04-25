const DB = require('./DbContext');
const bcrypt = require('bcrypt')
const express = require('express');
const app = express();
const cors = require('cors');
const User = require('./Models/User');
const Job = require('./Models/Job');
const userRoute = require('./Routes/userRoute');
const jobRoute = require('./Routes/jobRoute');
const port = 3000;
DB.connectDB();

// User.create({
//     name: 'Job Seeker',
//     email: 'XZDdX@example.com',
//     password: 'jobseeker',
//     role: 'jobseeker',
//     following: [],
//     bio: ''});

    // Job.create({
    //     title : 'Software Engineer',
    //     description: 'Looking for a software engineer to join our team.',
    //     tags: ['Software', 'Engineering'],
    //     company: 'ABC Company',
    //     image: '',
    //     postedBy:'68052c5fbd1e5f3bf3d8c690'
    // });


app.use(express.json());
app.use(express.urlencoded());
app.use('/uploads', express.static('uploads'));

app.use('/', jobRoute);
app.use('/', userRoute);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))