import * as mongoose from 'mongoose';
import IVoltId from '../interfaces/IVoltId';

const voltIdSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    max: {
        type: Number,
        required: true,
    }
})

const voltIdModel = mongoose.model<IVoltId>('voltId', voltIdSchema);

export default voltIdModel;
