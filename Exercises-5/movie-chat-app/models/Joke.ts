import mongoose from 'mongoose';

const JokeSchema = new mongoose.Schema({
    joke_id: { type: String, required: true, unique: true },
    text: { type: String, required: true },
    category: { type: String, required: true },
    source: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
}, { timestamps: true });

const Joke = mongoose.models.Joke || mongoose.model('Joke', JokeSchema);

export default Joke;