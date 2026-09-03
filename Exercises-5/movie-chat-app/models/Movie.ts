import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  rating: {             
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  description: {        
    type: String,
    required: true,
  },
}, {timestamps: true});

const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);

export default Movie;