const User = require('../Models/User');
const Job = require('../Models/Job');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 


async function register(req, res) {
    try{
        const {name, email, password, role, bio} = req.body;
        //Validation if user exist

        const isUser= await User.findOne({email});
        if (isUser){
            return res.status(400).json({msg : 'Email already exists'});
        }

        //Hashing Password 
        const salt = await bcrypt.genSalt(10); //generate random value used with password and it increases security
        const hashedPassword= await bcrypt.hash(password, salt);

        const user = await User.create({
            name, email, password : hashedPassword, role, bio
        });

        res.json({
            msg: 'user was registered successfully'
        });

    }
    catch(err){
        console.log(err);
        res.status(500).json({ msg: err.message || 'Internal server error' });
        
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid password' });
        }

        const token = JWT.sign(
            { id: user._id, email: user.email,role: user.role },
            'PrivateKey'
        );
        res.status(200).json({
            msg: 'Logged in successfully',
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message || 'Something went wrong' });
    }
}

//Authorization 
 async function isEmployer(req, res, next) {
    if (req.user.role !== 'employer') {
        return res.status(403).json({ msg: 'Only employers can perform this action' });
    }
    next();
}

async function follow(req, res) {
    try {
        const userId = req.user._id; 
        const targetId = req.params.id; 

        if (userId.toString() === targetId) {
            return res.status(400).json({ msg: "You can't follow yourself" });
        }

        const user = await User.findById(userId);
        if (!user.following.includes(targetId)) {
            user.following.push(targetId);
            await user.save();
            return res.json({ msg: "You are now following this user  " });
        } else {
            return res.status(400).json({ msg: "You are already following this user" });
        }
    } catch (error) {
        res.status(500).json({ msg: " server error ", error });
    }
};

async function unfollow  (req, res)  {
    try {
        const userId = req.user._id;
        const targetId = req.params.id;
        const user = await User.findById(userId);
        const index = user.following.indexOf(targetId);
        if (index > -1) {
            user.following.splice(index, 1);
            await user.save();
            return res.json({ msg: "You are no longer following this user" });
        } else {
            return res.status(400).json({ msg: " You are not following this user" });
        }
    } catch (error) {
        res.status(500).json({ msg: " server error ", error });
    }
};

async function FollowingList  (req, res) {
    try {
        const user = await User.findById(req.user._id).populate('following', 'name email role bio');
        res.json({ following: user.following });
    } catch (error) {
        res.status(500).json({ msg: "  server error ", error });
    }
};

async function getUserById  (req, res)  {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};


module.exports = {register, login,isEmployer,follow ,unfollow, FollowingList, getUserById};