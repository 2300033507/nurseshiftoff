import axios from 'axios';

const API_URL = 'http://localhost:5000/api/patient';

export const getMe = () => axios.get(`${API_URL}/me`);
