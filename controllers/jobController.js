const Job = require('../Models/Job');
const path = require('path');


async function PostJob (req, res){
  try {
    const { title, description, tags, company } = req.body;
    const imgUrl = req.file.path;
    const job = await Job.create({
      title,
      description,
      tags: tags.split(','),
      company,
      image: imgUrl || '',
      postedBy: req.user._id
    });

    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

async function EditJob  (req, res) {
    try {
      const job = await Job.findById(req.params.id);
  
      if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
      }
  
      if (job.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: 'Unauthorized to update this job' });
      }
  
      const { title, description, tags } = req.body;
      job.title = title || job.title;
      job.description = description || job.description;
      job.tags = tags ? tags.split(',') : job.tags;
      
      if (req.file) {
        job.image = req.file.filename;
      }
  
      const updated = await job.save();
      res.json(updated);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  };


  async function deleteJob (req, res){
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
      }
      if (job.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: 'Unauthorized to delete this job' });
      }
      await job.deleteOne();
      res.json({ msg: 'Job deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error', err });
    }
  };
  
  async function getAllJobs(req, res) {
    try {
      // pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
  
      const jobs = await Job.find()
        .populate('postedBy', 'name email description') 
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // latest jobs first
  
      const total = await Job.countDocuments();
  
      res.json({
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        jobs
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Something went wrong' });
    }
  }
  
 
  async function searchJobs(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ msg: "Please provide a search query" });
      }
      const jobs = await Job.find({ $text: { $search: q } }).populate('postedBy', 'name');
      res.json({ jobs });
    } catch (error) {
      res.status(500).json({ msg: "Server error", error });
    }
  }
  
module.exports = {PostJob,EditJob, deleteJob, getAllJobs, searchJobs};