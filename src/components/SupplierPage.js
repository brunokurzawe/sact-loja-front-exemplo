import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier, getSupplierById, fetchSuppliersPage, fetchSuppliersFilterPage } from '../services/SupplierService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';
import {convertBackendDateToFrontend} from './Utils';

function SupplierPage() {
    const [showModal, setShowModal] = useState(false);

    const [supplier, setSupplier] = useState({
        descricao: '',
        valorUnitario: '',
        estocavel: false,
        qtde_horas: 0
    });

    const resetSupplier = () => {
        setSupplier({
            descricao: '',
            valorUnitario: '',
            estocavel: false,
            qtde_horas: 0
        });
    }

    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetchSuppliers()
          .then(response => {
            setSuppliers(response.data.content);
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

    const indexOfLastSupplier = currentPage * itemsPerPage;
    const indexOfFirstSupplier = indexOfLastSupplier - itemsPerPage;

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
        resetSupplier();
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSupplier(prevSupplier => ({
            ...prevSupplier,
            [name]: value
        }));
    };

    function handleFecthList(){
        if (descriptionFilter) {
            const filterValue = `descricao%2Blike%2B${encodeURIComponent(descriptionFilter)}`;
            fetchSuppliersFilterPage(`?filter=${filterValue}`).then(response => {
                setSuppliers(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        } else {
            fetchSuppliers()
            .then(response => {
                setSuppliers(response.data.content);
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
            fetchSuppliersFilterPage(`?filter=${filterValue}`).then(response => {
                setSuppliers(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        } else if(dateValidityFilter && dateValidityFinalFilter){
            const filterValue = `dataValidade%2Bbetween%2B${encodeURIComponent(dateValidityFilter)}%2B${encodeURIComponent(dateValidityFinalFilter)}`;
            fetchSuppliersFilterPage(`?filter=${filterValue}`).then(response => {
                setSuppliers(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        } else {
            fetchSuppliers()
            .then(response => {
                setSuppliers(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        }
    }

    const handleDelete = async (supplierId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir este produto?");
            if (confirmation) {
                await deleteSupplier(supplierId);
                alert('Produto excluído com sucesso!');
                handleFecthList();  // para atualizar a lista após a exclusão
            }
        } catch (error) {
            console.error("Houve um erro ao excluir o produto:", error);
            alert('Erro ao excluir o produto. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (supplierToUpdate) => {
        try {
            await updateSupplier(supplierToUpdate.id,supplierToUpdate);
            alert('Produto atualizado com sucesso!');
            handleFecthList();  // Atualiza a lista de produtos após a alteração
            handleCloseModal();
            resetSupplier();
        } catch (error) {
            console.error("Houve um erro ao atualizar o produto:", error);
            alert('Erro ao atualizar o produto. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditSupplier = async (supplier) => {
        const response = await getSupplierById(supplier.id);
        // response.data.dataValidade = convertBackendDateToFrontend(response.data.dataValidade);;
        // response.data.dataPrazo = convertBackendDateToFrontend(response.data.dataPrazo);
        setSupplier(response.data); // Define o estado com os dados do produto selecionado
        handleOpenModal(); // Abre a modal
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault(); // Para prevenir o comportamento padrão do formulário
    
        try {
            const response = await createSupplier(supplier);
            
            // Verificar a resposta conforme necessário (por exemplo, ver se o produto foi criado com sucesso)
            if (response.data) {
                alert('Produto criado com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetSupplier();
            } else {
                alert('Erro ao criar o produto.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar o produto:", error.response.data.erro);
            alert('Erro ao criar o produto: '+error.response.data.erro);
        }
    }

    const fetchSuppliersFromApi = async (page = 1) => {
        const response = await fetchSuppliersPage(page - 1);
        setSuppliers(response.data.content);
        setTotalItens(response.data.totalElements);
    }
    
    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Fonecedores</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Fornecedor</Button>
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
                    {suppliers.map(supplier => (
                        <tr key={supplier.id}>
                            <td>{supplier.id}</td>
                            <td>{supplier.nome}</td>
                            <td>{supplier.telefone}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditSupplier(supplier)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(supplier.id)}>Deletar</button>
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
                    onChangePage={(page) => fetchSuppliersFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
        <div>
            <label>Nome:</label>
            <input type="text" className="form-control" name="nome" value={supplier.nome} onChange={handleInputChange} />
        </div>
        <div>
            <label>Telefone:</label>
            <input type="text" className="form-control" name="telefone" value={supplier.telefone} onChange={handleInputChange} />
        </div>
        <div>
            <label>Email:</label>
            <input type="text" className="form-control" name="email" value={supplier.email} onChange={handleInputChange} />
        </div>
        <div>
            <label>Endereço:</label>
            <input type="text" className="form-control" name="endereco" value={supplier.endereco} onChange={handleInputChange} />
        </div>
        <div>
            <label>CNPJ:</label>
            <input type="text" className="form-control" name="cnpj" value={supplier.cnpj} onChange={handleInputChange} />
        </div>
        <div>
            <label>Inscrição Estadual:</label>
            <input type="text" className="form-control" name="incricaoEstadual" value={supplier.incricaoEstadual} onChange={handleInputChange} />
        </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => supplier.id ? handleUpdate(supplier) : handleSubmit(event)}>
                        {supplier.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SupplierPage;