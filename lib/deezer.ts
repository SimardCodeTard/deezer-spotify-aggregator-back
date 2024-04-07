import axios from "axios"
const API_URL = 'https://api.deezer.com'

export const getAllPlaylists = async (userAccessToken: string) => {
    const response = await axios.get(`${API_URL}/user/${userAccessToken}/playlists`);
    console.log(response.data);
    return response.data;
}