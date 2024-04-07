import type { ObjectId } from "mongodb";

export type User = {
    _id: ObjectId;
    username: string;
    password: string;
    deezerAccessToken?: string;
    spotifyAccessToken?: string;
}