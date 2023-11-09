import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchServices = () => {
    return axios.get(`${API_URL}/servicos`);
}

export const fetchServicesPage = (page = 1) => {
    return axios.get(`${API_URL}/servicos?page=${page}`);
}

export const fetchServicesFilterPage = (filter = 1) => {
    console.log(filter);
    return axios.get(`${API_URL}/servicos${filter}`);
}

export const createService = (product) => {
    return axios.post(`${API_URL}/servicos`, product);
}

export const updateService = (id, product) => {
    return axios.put(`${API_URL}/servicos/${id}`, product);
}

export const deleteService = (id) => {
    return axios.delete(`${API_URL}/servicos/${id}`);
}

export const getServiceById = (id) => {
    return axios.get(`${API_URL}/servicos/${id}`);
}
