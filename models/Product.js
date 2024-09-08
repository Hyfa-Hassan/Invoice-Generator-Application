import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    rate: { type: Number, required: true },
    gst: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default model('Product', ProductSchema);
