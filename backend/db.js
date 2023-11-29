// const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017/" 


// const connectToMongo = () =>{

//     mongoose.connect(mongoURI, () =>{

//         console.log("Connect Database ok");
//     })
// }
// module.exports = connectToMongo;



const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/"

const connectToMongo = async () => {
try {
    mongoose.set('strictQuery', false)
    mongoose.connect(mongoURI) 
    console.log('Mongo connected success')
}
catch(error) {
    console.log(error)
    process.exit()
}
}
module.exports = connectToMongo;