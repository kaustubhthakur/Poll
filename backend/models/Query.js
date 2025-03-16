const mongoose = require('mongoose')
const QuerySchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    vote:{
        type:[String],
        default:[],
    }
},{
    timestamps:true
})
module.exports = mongoose.model("Query",QuerySchema)