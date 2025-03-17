const Poll = require('../models/Poll');
const createPoll = async(req,res)=>{
    try {
        const newPoll = new Poll(req.body);
        const savepoll = await newPoll.save();
        res.status(201).json(savepoll);
    } catch (error) {
        console.error(error);
    }
}
const getPoll = async(req,res)=>{
    try {
        const poll = await Poll.findById(req.params.id);
        res.status(201).json(poll);
    } catch (error) {
        console.error(error);
    }
}
const getPolls = async(req,res)=>{
    try {
        const polls = await Poll.find();
        res.status(201).json(polls);
    } catch (error) {
        console.error(error);
    }
}
const deletePoll = async(req,res)=>{
    try {
        await Poll.findByIdAndDelete(req.params.id);
        res.status(201).json({message:"poll is deleted by user"});
    } catch (error) {
        console.error(error);
    }
}
module.exports = {deletePoll,getPoll,getPolls,createPoll}