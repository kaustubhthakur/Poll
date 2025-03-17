const Poll = require('../models/Poll')
const Query = require('../models/Query')
const createQuery = async (req, res) => {
    const pollId = req.params.pollid;
    const newQuery = new Query(req.body);

    try {
        const savedQuery = await newQuery.save();
        try {
            await Poll.findByIdAndUpdate(pollId, {
                $push: { queries: savedQuery._id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(savedQuery);
    } catch (err) {
        next(err);
    }
};
const updateQuery = async (req, res, next) => {
    try {
        const updatedQuery = await Query.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedQuery);
    } catch (err) {
        next(err);
    }
};
const deleteQuery = async (req, res, next) => {
    const pollId = req.params.pollid;
    try {
        await Query.findByIdAndDelete(req.params.id);
        try {
            await Poll.findByIdAndUpdate(pollId, {
                $pull: { queries: req.params.id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json("Room has been deleted.");
    } catch (err) {
        next(err);
    }
};
const voteQuery = async (req, res) => {
    try {
        const { queryId } = req.params;
        const userId = req.user.id; // Assuming you have user authentication middleware
        const { pollId } = req.body;

        // Check if the query exists
        const query = await Query.findById(queryId);
        if (!query) {
            return res.status(404).json({ 
                success: false, 
                message: 'Query not found' 
            });
        }
        
        // Get the poll and verify it exists
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ 
                success: false, 
                message: 'Poll not found' 
            });
        }
        
        // Find all queries for this poll
        const pollQueries = await Query.find({
            _id: { $in: poll.queries }
        });
        
        // Check if user has already voted for any query in this poll
        const hasVotedInPoll = pollQueries.some(pq => 
            pq.vote.includes(userId)
        );
        
        if (hasVotedInPoll) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have already voted for a query in this poll' 
            });
        }
        
        // Add user to vote array
        query.vote.push(userId);
        
        // Save the updated query
        const updatedQuery = await query.save();
        
        res.status(200).json({
            success: true,
            data: updatedQuery,
            message: 'Vote recorded successfully'
        });
        
    } catch (error) {
        console.error('Error in voteQuery:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to record vote',
            error: error.message
        });
    }
};

const getQueries = async(req,res)=>{
    try {
        const queries = await Query.find();
        res.status(201).json(queries);
    } catch (error) {
        console.error(error);
    }
}
module.exports = {createQuery,updateQuery,deleteQuery,getQueries}