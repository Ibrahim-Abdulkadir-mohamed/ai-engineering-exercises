import mongoose from 'mongoose';

const MovieCacheSchema = new mongoose.Schema({
    imdbID: { type: String, required: true, unique: true },
    title: {type: String , },
    year: {type: String},
    genre: {type: String},
    director: {type: String},
    actors: {type: String},
    plot: {type: String},
    poster: {type: String},
    imdbRating: {type: String},
    runtime: {type: String},

}, { timestamps: true });

const MovieCache = mongoose.models.MovieCache || mongoose.model('MovieCache', MovieCacheSchema);

export default MovieCache;