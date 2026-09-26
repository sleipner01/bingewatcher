import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    title: { type: String, required: true },
    genre_ids: [{ type: Number, ref: 'Genre', required: true }],
    overview: { type: String, required: true },
    release_date: { type: String, required: true },
    adult: { type: Boolean, default: false },
    backdrop_path: { type: String },
    original_language: { type: String },
    original_title: { type: String },
    popularity: { type: Number },
    poster_path: { type: String },
    video: { type: Boolean, default: false },
    vote_average: { type: Number },
    vote_count: { type: Number },
  },
  { collection: 'movies' },
);

const Movie = mongoose.model('Movie', MovieSchema);

export default Movie;
