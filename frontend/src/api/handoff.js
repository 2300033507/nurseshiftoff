import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getPatients = async () => {
    return axios.get(`${API_URL}/patient/list`); // Need to implement this endpoint or use existing? 
    // Wait, I didn't create a GET /patient/list endpoint. I only have POST /patient.
    // I need to add GET /patient to backend/routes/patient.js first!
};

export const generateHandoffPreview = async (patientId, notes) => {
    return axios.post(`${API_URL}/handoff/preview`, { patientId, notes });
};

export const saveHandoff = async (data) => {
    return axios.post(`${API_URL}/handoff`, data);
};

export const getHandoffHistory = async (patientId) => {
    return axios.get(`${API_URL}/handoff/history/${patientId}`);
};
