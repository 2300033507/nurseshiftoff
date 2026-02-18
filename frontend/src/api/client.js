import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export const submitRequest = (data) => API.post('/patient/request', data);
export const getQueue = () => API.get('/doctor/queue');
export const submitHandoff = (data) => API.post('/nurse/handoff', data);

export default API;