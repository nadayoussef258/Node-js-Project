const express = require('express');
const route = express.Router();
const auth = require('../MiddleWare/auth');
const userController = require('../controllers/userController');

route.post('/register', userController.register)
route.post('/login', userController.login)
route.post('/follow/:id', auth, userController.follow);
route.delete('/unfollow/:id', auth, userController.unfollow);
route.get('/following-list', auth, userController.FollowingList);
route.get('/user/:id',auth, userController.getUserById);
module.exports = route;