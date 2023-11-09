import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchProducts, createProduct, updateProduct, deleteProduct, getProductById, fetchProductsPage, fetchProductsFilterPage } from '../services/ProductService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';
import {convertBackendDateToFrontend} from './Utils';

function ProductPage() {
    const [showModal, setShowModal] = useState(false);

    const [product, setProduct] = useState({
        descricao: '',
        valorUnitario: '',
        estocavel: false,
        nome: '',
        precoCompra: '',
        dataValidade: '',
        dataPrazo: '',
        status: 'DISPONIVEL'
    });

    const resetProduct = () => {
        setProduct({
            descricao: "",
            valorUnitario: null,
            estocavel: false,
            nome: "",
            precoCompra: null,
            dataValidade: null,
            dataPrazo: null,
            status: ""
        });
    }

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts()
          .then(response => {
            setProducts(response.data.content);
            setTotalItens(response.data.totalElements);
          })
          .catch(error => {
            console.log('Erro ao buscar produtos:', error);
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

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

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
        resetProduct();
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };

    function handleFecthList(){
        if (descriptionFilter) {
            const filterValue = `descricao%2Blike%2B${encodeURIComponent(descriptionFilter)}`;
            fetchProductsFilterPage(`?filter=${filterValue}`).then(response => {
                setProducts(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        } else {
            fetchProducts()
            .then(response => {
                setProducts(response.data.content);
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
            fetchProductsFilterPage(`?filter=${filterValue}`).then(response => {
                setProducts(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        } else if(dateValidityFilter && dateValidityFinalFilter){
            const filterValue = `dataValidade%2Bbetween%2B${encodeURIComponent(dateValidityFilter)}%2B${encodeURIComponent(dateValidityFinalFilter)}`;
            fetchProductsFilterPage(`?filter=${filterValue}`).then(response => {
                setProducts(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        } else {
            fetchProducts()
            .then(response => {
                setProducts(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
        }
    }

    const handleDelete = async (productId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir este produto?");
            if (confirmation) {
                await deleteProduct(productId);
                alert('Produto excluído com sucesso!');
                handleFecthList();  // para atualizar a lista após a exclusão
            }
        } catch (error) {
            console.error("Houve um erro ao excluir o produto:", error);
            alert('Erro ao excluir o produto. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (productToUpdate) => {
        try {
            await updateProduct(productToUpdate.id,productToUpdate);
            alert('Produto atualizado com sucesso!');
            handleFecthList();  // Atualiza a lista de produtos após a alteração
            handleCloseModal();
            resetProduct();
        } catch (error) {
            console.error("Houve um erro ao atualizar o produto:", error);
            alert('Erro ao atualizar o produto. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditProduct = async (product) => {
        const response = await getProductById(product.id);
        response.data.dataValidade = convertBackendDateToFrontend(response.data.dataValidade);;
        response.data.dataPrazo = convertBackendDateToFrontend(response.data.dataPrazo);
        setProduct(response.data); // Define o estado com os dados do produto selecionado
        handleOpenModal(); // Abre a modal
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault(); // Para prevenir o comportamento padrão do formulário
    
        try {
            const response = await createProduct(product);
            
            // Verificar a resposta conforme necessário (por exemplo, ver se o produto foi criado com sucesso)
            if (response.data) {
                alert('Produto criado com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetProduct();
            } else {
                alert('Erro ao criar o produto.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar o produto:", error.response.data.erro);
            alert('Erro ao criar o produto: '+error.response.data.erro);
        }
    }

    const fetchProductsFromApi = async (page = 1) => {
        const response = await fetchProductsPage(page - 1);
        setProducts(response.data.content);
        setTotalItens(response.data.totalElements);
    }
    
    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Produtos</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Produto</Button>
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
                        <th>Descrição</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.descricao}</td>
                            <td>{product.status}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditProduct(product)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>Deletar</button>
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
                    onChangePage={(page) => fetchProductsFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div>
        <label>Nome:</label>
            <input type="text" className="form-control" name="nome" value={product.nome} onChange={handleInputChange} />
        </div>
        <div>
            <label>Descrição:</label>
            <input type="text" className="form-control" name="descricao" value={product.descricao} onChange={handleInputChange} />
        </div>
        <div>
            <label>Valor Unitário:</label>
            <input type="number" className="form-control" name="valorUnitario" value={product.valorUnitario} onChange={handleInputChange} />
        </div>
        <div>
            <label>Preço de Compra:</label>
            <input type="number" className="form-control" name="precoCompra" value={product.precoCompra} onChange={handleInputChange} />
        </div>
        <div>
            <label>Data de Validade:</label>
            <input type="date" className="form-control" name="dataValidade" value={product.dataValidade} onChange={handleInputChange} />
        </div>
        <div>
            <label>Data de Prazo:</label>
            <input type="date" className="form-control" name="dataPrazo" value={product.dataPrazo} onChange={handleInputChange} />
        </div>
        <div>
            <label>Status:</label>
            <select className="form-control" name="status" value={product.status} onChange={handleInputChange}>
                <option value="DISPONIVEL">Disponível</option>
                <option value="INDISPONIVEL">Indisponível</option>
                <option value="ALUGADO">Alugado</option>
            </select>
        </div>
        <br></br>
        <div>
            <label>Estocável:</label>
            <input type="checkbox" className="form-check-input" name="estocavel" checked={product.estocavel} onChange={e => setProduct(prev => ({ ...prev, estocavel: e.target.checked }))} />
        </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => product.id ? handleUpdate(product) : handleSubmit(event)}>
                        {product.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProductPage;