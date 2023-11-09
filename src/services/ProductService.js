import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchProducts = () => {
    return axios.get(`${API_URL}/produtos`);
}

export const fetchProductsPage = (page = 1) => {
    return axios.get(`${API_URL}/produtos?page=${page}`);
}

export const fetchProductsFilterPage = (filter = 1) => {
    console.log(filter);
    return axios.get(`${API_URL}/produtos${filter}`);
}

export const createProduct = (product) => {
    return axios.post(`${API_URL}/produtos`, product);
}

export const updateProduct = (id, product) => {
    return axios.put(`${API_URL}/produtos/${id}`, product);
}

export const deleteProduct = (id) => {
    return axios.delete(`${API_URL}/produtos/${id}`);
}

export const getProductById = (id) => {
    return axios.get(`${API_URL}/produtos/${id}`);
}
