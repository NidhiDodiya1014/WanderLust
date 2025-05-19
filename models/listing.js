const mongoose=require("mongoose")
const Schema=mongoose.Schema

const listingSchema=Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String
    },
    image:{
        type: String,
        default:'https://i.pinimg.com/736x/4c/a7/e6/4ca7e662f6b80919a318fd323c7c3ac4.jpg',
        set:(v)=>v===""?'https://i.pinimg.com/736x/4c/a7/e6/4ca7e662f6b80919a318fd323c7c3ac4.jpg':v
    },
    price:{
        type: Number
    },
    location:{
        type: String
    },
    country:{
        type: String
    },
})

const Listing=mongoose.model("Listing",listingSchema)
module.exports=Listing