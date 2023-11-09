import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchRentals, createRental, updateRental, deleteRental, getRentalById, fetchRentalsPage, fetchRentalsFilterPage } from '../services/RentalService';

import { fetchClients } from '../services/ClientService';
import { fetchProducts } from '../services/ProductService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';
import {convertBackendDateToFrontend} from './Utils';

function RentalPage() {
    const [showModal, setShowModal] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState(null);
    const [showItemModal, setShowItemModal] = useState(false);

    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);

    const [rental, setRental] = useState({
        dataLocacao: null,
        dataDevolucao: null,
        cliente: {
            id: null,
            nome: '',
            telefone: '',
            endereco: '',
            email: ''
        },
        endereco: '',
        observacao: '',
        itens: []
    });
    
    const resetRental = () => {
        setRental({
            dataLocacao: null,
            dataDevolucao: null,
            cliente: {
                id: null,
                nome: '',
                telefone: '',
                endereco: '',
                email: ''
            },
            endereco: '',
            observacao: '',
            itens: []
        });
    }
    
    const [tempItem, setTempItem] = useState({
        desconto: 0,
        produto: {
            id: null
        },
        quantidade: 1,
        valorUnitario: 0
    });
    

    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        fetchRentals()
          .then(response => {
            setRentals(response.data.content);
            setTotalItens(response.data.totalElements);

            fetchClients().then(response => {
                setClients(response.data.content);
            })
            .catch(error => {
              console.log('Erro ao buscar serviços:', error);
            });

            fetchProducts().then(response => {
                setProducts(response.data.content);
            })
            .catch(error => {
              console.log('Erro ao buscar serviços:', error);
            });
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

    const indexOfLastRental = currentPage * itemsPerPage;
    const indexOfFirstRental = indexOfLastRental - itemsPerPage;

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
        resetRental();
    }

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        if (name.includes('.')) {
            const [objName, objProp] = name.split('.');
            setRental(prevState => ({
                ...prevState,
                [objName]: {
                    ...prevState[objName],
                    [objProp]: value
                }
            }));
        } else {
            setRental(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }

    const handleAddItem = () => {
        if (editingItemIndex !== null) {
            // Atualizar o item
            const updatedItens = [...rental.itens];
            updatedItens[editingItemIndex] = tempItem;
            setRental({
                ...rental,
                itens: updatedItens
            });
            setEditingItemIndex(null);
            setShowItemModal(false);
        } else {
            // Adicionar novo item
            setRental(prevState => ({
                ...prevState,
                itens: [...prevState.itens, tempItem]
            }));
        }
    
        // Resetar o item temporário
        setTempItem({
            desconto: 0,
            produto: {
                id: null
            },
            quantidade: 1,
            valorUnitario: 0
        });
    };


    const handleEditItem = (index) => {
        setTempItem(rental.itens[index]);
        setEditingItemIndex(index);
        setShowItemModal(true);
    };
    

    
    const handleRemoveItem = (index) => {
        const newItens = [...rental.itens];
        newItens.splice(index, 1);
        setRental(prevState => ({
            ...prevState,
            itens: newItens
        }));
    };
    

    function handleFecthList(){
        if (descriptionFilter) {
            const filterValue = `descricao%2Blike%2B${encodeURIComponent(descriptionFilter)}`;
            fetchRentalsFilterPage(`?filter=${filterValue}`).then(response => {
                setRentals(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        } else {
            fetchRentals()
            .then(response => {
                setRentals(response.data.content);
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
            fetchRentalsFilterPage(`?filter=${filterValue}`).then(response => {
                setRentals(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        } else if(dateValidityFilter && dateValidityFinalFilter){
            const filterValue = `dataValidade%2Bbetween%2B${encodeURIComponent(dateValidityFilter)}%2B${encodeURIComponent(dateValidityFinalFilter)}`;
            fetchRentalsFilterPage(`?filter=${filterValue}`).then(response => {
                setRentals(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        } else {
            fetchRentals()
            .then(response => {
                setRentals(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        }
    }

    const handleDelete = async (rentalId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir este produto?");
            if (confirmation) {
                await deleteRental(rentalId);
                alert('Produto excluído com sucesso!');
                handleFecthList();  // para atualizar a lista após a exclusão
            }
        } catch (error) {
            console.error("Houve um erro ao excluir o produto:", error);
            alert('Erro ao excluir o produto. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (rentalToUpdate) => {
        try {
            await updateRental(rentalToUpdate.id,rentalToUpdate);
            alert('Produto atualizado com sucesso!');
            handleFecthList();  // Atualiza a lista de produtos após a alteração
            handleCloseModal();
            resetRental();
        } catch (error) {
            console.error("Houve um erro ao atualizar o produto:", error);
            alert('Erro ao atualizar o produto. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditRental = async (rental) => {
        const response = await getRentalById(rental.id);
         response.data.dataLocacao = convertBackendDateToFrontend(response.data.dataLocacao);;
         response.data.dataDevolucao = convertBackendDateToFrontend(response.data.dataDevolucao);
        setRental(response.data); // Define o estado com os dados do produto selecionado
        handleOpenModal(); // Abre a modal
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault(); // Para prevenir o comportamento padrão do formulário
    
        try {
            const response = await createRental(rental);
            
            // Verificar a resposta conforme necessário (por exemplo, ver se o produto foi criado com sucesso)
            if (response.data) {
                alert('Produto criado com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetRental();
            } else {
                alert('Erro ao criar o produto.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar o produto:", error.response.data.erro);
            alert('Erro ao criar o produto: '+error.response.data.erro);
        }
    }

    const fetchRentalsFromApi = async (page = 1) => {
        const response = await fetchRentalsPage(page - 1);
        setRentals(response.data.content);
        setTotalItens(response.data.totalElements);
    }
    
    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Locações</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Locação</Button>
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
                    {rentals.map(rental => (
                        <tr key={rental.id}>
                            <td>{rental.id}</td>
                            <td>{rental.cliente.nome}</td>
                            <td>{rental.telefone}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditRental(rental)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rental.id)}>Deletar</button>
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
                    onChangePage={(page) => fetchRentalsFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Cliente:</label>
                        <select 
                            className="form-control" 
                            name="cliente.id" 
                            value={rental.cliente.id}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>Selecione um cliente</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Data de Locação:</label>
                        <input type="date" className="form-control" name="dataLocacao" value={rental.dataLocacao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Data de Locação:</label>
                        <input type="date" className="form-control" name="dataDevolucao" value={rental.dataDevolucao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Endereço Entrega:</label>
                        <input type="text" className="form-control" name="endereco" value={rental.endereco} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Observação:</label>
                        <input type="text" className="form-control" name="observacao" value={rental.observacao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <h4>Itens</h4>
                        <button className="btn btn-success mb-2" onClick={() => setShowItemModal(true)}>Adicionar Item</button>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Quantidade</th>
                                    <th>Valor Unitário</th>
                                    <th>Desconto</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rental.itens.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.produto.id}</td>
                                        <td>{item.quantidade}</td>
                                        <td>{item.valorUnitario}</td>
                                        <td>{item.desconto}</td>
                                        <td>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditItem(index)}>Editar</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(index)}>Remover</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Modal show={showItemModal} onHide={() => setShowItemModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Adicionar/Editar Item</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <label>Produto:</label>
                                    <select 
                                        className="form-control mb-2" 
                                        value={tempItem.produto.id} 
                                        onChange={e => setTempItem({...tempItem, produto: {id: e.target.value}})}
                                    >
                                        {products.map(produto => 
                                            <option value={produto.id} key={produto.id}>{produto.nome}</option>
                                        )}
                                    </select>
                                    
                                    <label>Quantidade:</label>
                                    <input 
                                        type="number" 
                                        className="form-control mb-2" 
                                        value={tempItem.quantidade} 
                                        onChange={e => setTempItem({...tempItem, quantidade: e.target.value})}
                                    />

                                    <label>Valor Unitário:</label>
                                    <input 
                                        type="number" 
                                        className="form-control mb-2" 
                                        value={tempItem.valorUnitario} 
                                        onChange={e => setTempItem({...tempItem, valorUnitario: e.target.value})}
                                    />

                                    <label>Desconto:</label>
                                    <input 
                                        type="number" 
                                        className="form-control mb-2" 
                                        value={tempItem.desconto} 
                                        onChange={e => setTempItem({...tempItem, desconto: e.target.value})}
                                    />
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowItemModal(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={handleAddItem}>
                                    {editingItemIndex !== null ? 'Atualizar' : 'Adicionar'}
                                </Button>
                            </Modal.Footer>
                        </Modal>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => rental.id ? handleUpdate(rental) : handleSubmit(event)}>
                        {rental.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default RentalPage;