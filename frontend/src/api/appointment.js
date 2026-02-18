import axios from 'axios';

const API_URL = 'http://localhost:5000/api/appointment';

export const createAppointment = (data) => axios.post(`${API_URL}`, data);
export const getAllAppointments = () => axios.get(`${API_URL}`);
export const getMyAppointments = () => axios.get(`${API_URL}/my-appointments`);
export const updateAppointmentStatus = (id, status) => axios.put(`${API_URL}/${id}/status`, { status });
