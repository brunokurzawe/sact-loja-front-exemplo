import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchSuppliers = () => {
    return axios.get(`${API_URL}/fornecedores`);
}

export const fetchSuppliersPage = (page = 1) => {
    return axios.get(`${API_URL}/fornecedores?page=${page}`);
}

export const fetchSuppliersFilterPage = (filter = 1) => {
    console.log(filter);
    return axios.get(`${API_URL}/fornecedores${filter}`);
}

export const createSupplier = (product) => {
    return axios.post(`${API_URL}/fornecedores`, product);
}

export const updateSupplier = (id, product) => {
    return axios.put(`${API_URL}/fornecedores/${id}`, product);
}

export const deleteSupplier = (id) => {
    return axios.delete(`${API_URL}/fornecedores/${id}`);
}

export const getSupplierById = (id) => {
    return axios.get(`${API_URL}/fornecedores/${id}`);
}
