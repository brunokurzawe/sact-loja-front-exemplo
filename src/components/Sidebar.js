import React from 'react';

function Sidebar() {
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{width: '280px'}}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <span className="fs-4">Nome da Marca</span>
            </a>
            <hr/>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <a href="#" className="nav-link active" aria-current="page">
                        <i className="bi bi-house-door"></i>
                        Home
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link link-dark">
                        <i className="bi bi-file-earmark-text"></i>
                        Produtos
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link link-dark">
                        <i className="bi bi-bar-chart"></i>
                        Relatórios
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link link-dark">
                        <i className="bi bi-cash"></i>
                        Vendas
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link link-dark">
                        <i className="bi bi-cog"></i>
                        Configurações
                    </a>
                </li>
            </ul>
            <hr/>
        </div>
    );
}

export default Sidebar;