const express = require('express');
const route = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../MiddleWare/auth'); 
const { getAllJobs } = require('../controllers/jobController');
const userController = require('../controllers/userController'); 
const upload = require('../MiddleWare/uploads'); 


route.post('/Add-job', auth,userController.isEmployer, upload.single('image'), jobController.PostJob);
route.put('/:id', auth, upload.single('image'), jobController.EditJob);
route.delete('/:id', auth, jobController.deleteJob);
route.get('/getAllJobs', getAllJobs);
route.get('/search',auth, jobController.searchJobs);

module.exports = route;