import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
   
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024,
    }

}, {
    timestamps: true,
})

const adminModel = mongoose.model("Admin", adminSchema);
export default adminModel;