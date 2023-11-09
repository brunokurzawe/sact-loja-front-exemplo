import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchClients = () => {
    return axios.get(`${API_URL}/clientes`);
}

export const fetchClientsPage = (page = 1) => {
    return axios.get(`${API_URL}/clientes?page=${page}`);
}

export const fetchClientsFilterPage = (filter = 1) => {
    console.log(filter);
    return axios.get(`${API_URL}/clientes${filter}`);
}

export const createClient = (product) => {
    return axios.post(`${API_URL}/clientes`, product);
}

export const updateClient = (id, product) => {
    return axios.put(`${API_URL}/clientes/${id}`, product);
}

export const deleteClient = (id) => {
    return axios.delete(`${API_URL}/clientes/${id}`);
}

export const getClientById = (id) => {
    return axios.get(`${API_URL}/clientes/${id}`);
}
