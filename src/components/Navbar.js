import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">Satc eCommerce</NavLink>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" exact>Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/produtos">Produtos</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/servicos">Serviços</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/clientes">Clientes</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/fornecedores">Fornecedores</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/locacoes">Locações</NavLink>
                        </li>
                        {/* Outros links aqui */}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;