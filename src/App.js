import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Navbar from './components/Navbar';
import ProductPage from './components/ProductPage';
import ServicePage from './components/ServicePage';
import ClientPage from './components/ClientPage';
import SupplierPage from './components/SupplierPage';
import RentalPage from './components/RentalPage';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container-fluid mt-5 pt-3">
                <Routes>
                    <Route path="/" element={<div>/* Seu conteúdo principal aqui */</div>} />
                    <Route path="/produtos" element={<ProductPage />} />
                    <Route path="/servicos" element={<ServicePage />} />
                    <Route path="/clientes" element={<ClientPage />} />
                    <Route path="/fornecedores" element={<SupplierPage />} />
                    <Route path="/locacoes" element={<RentalPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

