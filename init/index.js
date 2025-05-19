const mongoose=require("mongoose")
const {data}=require("./data")

const Listing=require('../models/listing')

async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust')
}

main()
.then((res)=>console.log('connected to DB✅')).catch((err)=>console.log('got an errorrr',err))

const initDB= async()=>{
    await Listing.deleteMany({})
    await Listing.insertMany(data)
    console.log("Db was initialised!")
}
initDB()