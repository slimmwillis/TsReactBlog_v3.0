import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
   
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200,
        unique: true,
    }

}, {
    timestamps: true,
})

const subscriberModel = mongoose.model("Subscriber", subscriberSchema);
export default subscriberModel;