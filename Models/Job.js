const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title : {
        type : String, 
        required : true
    },
    description: {
        type : String, 
        required : true
    },
    tags:{
        type : [String],
        required : true
    },
    company: {
        type : String,
        required : true
    },
    image :{
        type : String
    }, 
    postedBy:{

        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{
    timestamps : true
});
JobSchema.index({ title: 'text', company: 'text', tags: 'text' });
const Job = mongoose.model('Job', JobSchema);
module.exports = Job;