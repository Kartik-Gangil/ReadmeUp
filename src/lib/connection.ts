import mongoose from 'mongoose';


export function connectToServer(){
    mongoose.connect(process.env.mongoDB_URL!)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB:", err);
        });
}
