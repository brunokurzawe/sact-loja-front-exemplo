import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchRentals = () => {
    return axios.get(`${API_URL}/locacoes`);
}

export const fetchRentalsPage = (page = 1) => {
    return axios.get(`${API_URL}/locacoes?page=${page}`);
}

export const fetchRentalsFilterPage = (filter = 1) => {
    console.log(filter);
    return axios.get(`${API_URL}/locacoes${filter}`);
}

export const createRental = (rental) => {
    return axios.post(`${API_URL}/locacoes`, rental);
}

export const updateRental = (id, rental) => {
    return axios.put(`${API_URL}/locacoes/${id}`, rental);
}

export const deleteRental = (id) => {
    return axios.delete(`${API_URL}/locacoes/${id}`);
}

export const getRentalById = (id) => {
    return axios.get(`${API_URL}/locacoes/${id}`);
}
