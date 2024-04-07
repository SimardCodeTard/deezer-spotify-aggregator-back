import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    deezerAccessToken: {
        type: String,
        required: false,
    },
    spotifyAccessToken: {
        type: String,
        required: false,
    },
});

export const UserModel = mongoose.model('User', UserSchema);