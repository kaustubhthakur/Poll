const mongoose = require('mongoose')
const PollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    queries: {
        type: [String],
        default: [],
    },
    userId:{
        type:String,
        required:true,
    }
},
{
    timestamps: true,
})
module.exports = mongoose.model("Poll", PollSchema);