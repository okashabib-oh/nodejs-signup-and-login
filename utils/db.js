import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_STRING)
        .then(() => {
            console.log("Database connection established");
        })
        .catch(err => console.error("Error while Connecting db: ", err));
}
