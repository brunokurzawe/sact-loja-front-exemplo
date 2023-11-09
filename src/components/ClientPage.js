import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchClients, createClient, updateClient, deleteClient, getClientById, fetchClientsPage, fetchClientsFilterPage } from '../services/ClientService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';
import {convertBackendDateToFrontend} from './Utils';

function ClientPage() {
    const [showModal, setShowModal] = useState(false);

    const [client, setClient] = useState({
        descricao: '',
        valorUnitario: '',
        estocavel: false,
        qtde_horas: 0
    });

    const resetClient = () => {
        setClient({
            descricao: '',
            valorUnitario: '',
            estocavel: false,
            qtde_horas: 0
        });
    }

    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetchClients()
          .then(response => {
            setClients(response.data.content);
            setTotalItens(response.data.totalElements);
          })
          .catch(error => {
            console.log('Erro ao buscar serviços:', error);
          });
    }, []);

    const [descriptionFilter, setDescriptionFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateValidityFilter, setDateValidityFilter] = useState('');
    const [dateValidityFinalFilter, setDateValidityFinalFilter] = useState('');

    const [showFilters, setShowFilters] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItens, setTotalItens] = useState(1);
    const [itemsPerPage] = useState(10); 

    const indexOfLastClient = currentPage * itemsPerPage;
    const indexOfFirstClient = indexOfLastClient - itemsPerPage;

    function limparFiltrosEspeciais() {
        setStatusFilter('');
        setDateValidityFilter('');
        setDateValidityFinalFilter('');
    }

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        resetClient();
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setClient(prevClient => ({
            ...prevClient,
            [name]: value
        }));
    };

    function handleFecthList(){
        if (descriptionFilter) {
            const filterValue = `descricao%2Blike%2B${encodeURIComponent(descriptionFilter)}`;
            fetchClientsFilterPage(`?filter=${filterValue}`).then(response => {
                setClients(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        } else {
            fetchClients()
            .then(response => {
                setClients(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        }
    }

    function handleFecthEspecialFilterList(){
        if (statusFilter) {
            const filterValue = `status%2Bequal%2B${encodeURIComponent(statusFilter)}`;
            fetchClientsFilterPage(`?filter=${filterValue}`).then(response => {
                setClients(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        } else if(dateValidityFilter && dateValidityFinalFilter){
            const filterValue = `dataValidade%2Bbetween%2B${encodeURIComponent(dateValidityFilter)}%2B${encodeURIComponent(dateValidityFinalFilter)}`;
            fetchClientsFilterPage(`?filter=${filterValue}`).then(response => {
                setClients(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        } else {
            fetchClients()
            .then(response => {
                setClients(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        }
    }

    const handleDelete = async (clientId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir este produto?");
            if (confirmation) {
                await deleteClient(clientId);
                alert('Produto excluído com sucesso!');
                handleFecthList();  // para atualizar a lista após a exclusão
            }
        } catch (error) {
            console.error("Houve um erro ao excluir o produto:", error);
            alert('Erro ao excluir o produto. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (clientToUpdate) => {
        try {
            await updateClient(clientToUpdate.id,clientToUpdate);
            alert('Produto atualizado com sucesso!');
            handleFecthList();  // Atualiza a lista de produtos após a alteração
            handleCloseModal();
            resetClient();
        } catch (error) {
            console.error("Houve um erro ao atualizar o produto:", error);
            alert('Erro ao atualizar o produto. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditClient = async (client) => {
        const response = await getClientById(client.id);
        // response.data.dataValidade = convertBackendDateToFrontend(response.data.dataValidade);;
        // response.data.dataPrazo = convertBackendDateToFrontend(response.data.dataPrazo);
        setClient(response.data); // Define o estado com os dados do produto selecionado
        handleOpenModal(); // Abre a modal
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault(); // Para prevenir o comportamento padrão do formulário
    
        try {
            const response = await createClient(client);
            
            // Verificar a resposta conforme necessário (por exemplo, ver se o produto foi criado com sucesso)
            if (response.data) {
                alert('Produto criado com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetClient();
            } else {
                alert('Erro ao criar o produto.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar o produto:", error.response.data.erro);
            alert('Erro ao criar o produto: '+error.response.data.erro);
        }
    }

    const fetchClientsFromApi = async (page = 1) => {
        const response = await fetchClientsPage(page - 1);
        setClients(response.data.content);
        setTotalItens(response.data.totalElements);
    }
    
    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Clientes</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Cliente</Button>
            </div>
            
            <div className="d-flex mb-3">
                {/* Dropdown para filtros especiais */}
                <div className="dropdown me-2">
                    <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" onClick={() => setShowFilters(!showFilters)}>
                        Filtros Especiais
                    </button>
                    <div className={`dropdown-menu ${showFilters ? 'show' : ''}`} style={{width: '300px'}}>
                        {/* Filtro por Status */}
                        <div className="p-2">
                            <label className="form-label">Filtrar por status</label>
                            <select 
                                className="form-select" 
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option value="">Selecione</option>
                                <option value="ALUGADO">Alugado</option>
                                <option value="DISPONIVEL">Disponível</option>
                                <option value="INDISPONIVEL">Indisponível</option>
                            </select>
                        </div>

                        {/* Filtro por Data de Validade */}
                        <div className="p-2">
                            <label className="form-label">Filtrar por data de validade</label>
                            <input 
                                type="date" 
                                className="form-control"
                                value={dateValidityFilter}
                                onChange={e => setDateValidityFilter(e.target.value)}
                            />
                            <br></br>
                            <input 
                                type="date" 
                                className="form-control"
                                value={dateValidityFinalFilter}
                                onChange={e => setDateValidityFinalFilter(e.target.value)}
                            />
                        </div>
                        <div className="p-2 d-flex justify-content-end">
                            <Button className="btn btn-default btn-sm me-2" onClick={() => limparFiltrosEspeciais()}>Limpar</Button>
                            <Button className="btn btn-primary btn-sm" onClick={() => handleFecthEspecialFilterList()}>Buscar</Button>
                        </div>
                    </div>
                </div>

                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Filtrar por descrição" aria-describedby="button-addon2" value={descriptionFilter}
                    onChange={e => setDescriptionFilter(e.target.value)}/>
                    <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => setDescriptionFilter('')}>Limpar</button>
                    <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleFecthList()}>Buscar</button>
                </div>
            </div>

            {/* Lista de produtos */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.id}>
                            <td>{client.id}</td>
                            <td>{client.nome}</td>
                            <td>{client.telefone}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClient(client)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(client.id)}>Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-end">
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItens}
                    currentPage={currentPage}
                    onChangePage={(page) => fetchClientsFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
        <div>
            <label>Nome:</label>
            <input type="text" className="form-control" name="nome" value={client.nome} onChange={handleInputChange} />
        </div>
        <div>
            <label>Telefone:</label>
            <input type="text" className="form-control" name="telefone" value={client.telefone} onChange={handleInputChange} />
        </div>
        <div>
            <label>Email:</label>
            <input type="text" className="form-control" name="email" value={client.email} onChange={handleInputChange} />
        </div>
        <div>
            <label>Endereço:</label>
            <input type="text" className="form-control" name="endereco" value={client.endereco} onChange={handleInputChange} />
        </div>
        <div>
            <label>CPF:</label>
            <input type="text" className="form-control" name="cpf" value={client.cpf} onChange={handleInputChange} />
        </div>
        <div>
            <label>RG:</label>
            <input type="text" className="form-control" name="rg" value={client.rg} onChange={handleInputChange} />
        </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => client.id ? handleUpdate(client) : handleSubmit(event)}>
                        {client.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ClientPage;