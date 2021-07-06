import * as mongoose from 'mongoose';
import IUser from '../interfaces/IUser';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        phoneNumber1 :{
            type: String,
            required: true
        },
        phoneNumber2: String
    },
    role: {
        type: String,
        required: true
    },
    voltId: {
        type: String,
        required: true
    }
});


const userModel = mongoose.model<IUser>('User' , userSchema);

export default userModel;