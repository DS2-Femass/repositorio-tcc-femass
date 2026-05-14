import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { SubcategoriaService } from '../../service/SubcategoriaService';
import { CategoriaService } from '../../service/CategoriaService';
import Select from 'react-select';

function withNavigate(Component) {
    return (props) => {
      const navigate = useNavigate();
      return <Component {...props} navigate={navigate} />;
    };
}

class Subcategoria extends Component {
  
    state = {
        subcategorias: [],
        filteredItems: [],
        optionsCategorias: [],
        filterNome: '',
        filterDescricao: '',
        filterCategoria: null,
        toDeleteItem: null,
        showModalDeletion: false,
        showModalEdit: false,
        showModalCreate: false,
        showModalView: false,
        toEditItem: null,
        toViewItem: null,
        nomeSubcategoria: '',
        descricaoSubcategoria: '',
        selectedCategoria: null,
        isCategoriaInvalid: false,
    }

    subcategoriaService = new SubcategoriaService();
    categoriaService = new CategoriaService();

    applyFilters = () => {
        let filtered = [...this.state.subcategorias];
        
        if (this.state.filterNome) {
            filtered = filtered.filter(item => 
                item.nomeSubcategoria.toLowerCase().includes(this.state.filterNome.toLowerCase())
            );
        }

        if (this.state.filterDescricao) {
            filtered = filtered.filter(item => 
                item.descricaoSubcategoria.toLowerCase().includes(this.state.filterDescricao.toLowerCase())
            );
        }

        if (this.state.filterCategoria) {
            filtered = filtered.filter(item => 
                item.idCategoria === this.state.filterCategoria.value
            );
        }

        this.setState({ filteredItems: filtered });
    }

    handleFilterChange = (event) => {
        this.setState({ [event.target.name]: event.target.value }, this.applyFilters);
    };

    handleFilterCategoriaChange = (selectedOption) => {
        this.setState({ filterCategoria: selectedOption }, this.applyFilters);
    };

    clearFilters = () => {
        this.setState({filterNome: '', filterDescricao: '', filterCategoria: null}, this.applyFilters);
    }

    handleChange = (event) => {
        this.setState({ 
            [event.target.name]: event.target.value 
        });
    };

    handleCategoriaChange = (selectedOption) => {
        this.setState({ 
            selectedCategoria: selectedOption,
            isCategoriaInvalid: !selectedOption
        });
    };

    fillLists = () => {
        Promise.all([
            this.subcategoriaService.listAll(),
            this.categoriaService.listAll()
        ])
            .then(([subcategoriasResponse, categoriasResponse]) => {
                const categoriasMap = {};
                categoriasResponse.data.forEach(cat => {
                    categoriasMap[cat.id] = cat.nomeCategoria;
                });

                // Adiciona o nome da categoria a cada subcategoria
                const subcategoriasComCategoria = subcategoriasResponse.data.map(sub => ({
                    ...sub,
                    nomeCategoria: categoriasMap[sub.idCategoria] || 'N/A'
                }));

                this.setState({
                    subcategorias: subcategoriasComCategoria, 
                    filteredItems: subcategoriasComCategoria
                });
            })
            .catch((error) => {
                toast.error('Erro ao carregar os dados', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
            });
    }

    fillOptionsCategorias = () => {
        this.categoriaService.listAll()
            .then((response) => {
                const optionsCategorias = response.data.map(categoria => ({
                    value: categoria.id,
                    label: categoria.nomeCategoria
                }));
                this.setState({ optionsCategorias });
            })
            .catch((error) => {
                console.error('Erro ao carregar categorias:', error);
            });
    }

    beginInsertion = () => {
        this.fillOptionsCategorias();
        this.setState({
            showModalCreate: true,
            nomeSubcategoria: '',
            descricaoSubcategoria: '',
            selectedCategoria: null,
            isCategoriaInvalid: false
        });
    }

    validateForm = () => {
        if (!this.state.nomeSubcategoria || this.state.nomeSubcategoria.trim() === '') {
            toast.error('O nome da subcategoria é obrigatório');
            return false;
        }
        if (this.state.nomeSubcategoria.length > 50) {
            toast.error('O nome da subcategoria deve ter no máximo 50 caracteres');
            return false;
        }
        if (!this.state.descricaoSubcategoria || this.state.descricaoSubcategoria.trim() === '') {
            toast.error('A descrição da subcategoria é obrigatória');
            return false;
        }
        if (!this.state.selectedCategoria) {
            toast.error('A categoria é obrigatória');
            this.setState({ isCategoriaInvalid: true });
            return false;
        }
        return true;
    }

    clearState = () => {
        this.setState({
            nomeSubcategoria: '',
            descricaoSubcategoria: '',
            selectedCategoria: null,
            isCategoriaInvalid: false
        });
    }

    beginDeletion = (subcategoria) => {
        this.setState({ toDeleteItem: subcategoria, showModalDeletion: true });
    }

    delete = () => {
        this.subcategoriaService.delete(this.state.toDeleteItem.id)
            .then(() => {
                toast.success('Subcategoria excluída com sucesso!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                this.fillLists();
                this.closeModal('Deletion');
            })
            .catch((error) => {
                const message = error.response?.data?.message || 'Erro ao excluir subcategoria';
                toast.error(message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    }

    closeModal = (operationName) => {
        this.clearState();
        const modalKey = 'showModal' + operationName;
        let itemKey = null;
        
        if (operationName === 'Deletion') {
            itemKey = 'toDeleteItem';
        } else if (operationName === 'Edit') {
            itemKey = 'toEditItem';
        } else if (operationName === 'View') {
            itemKey = 'toViewItem';
        } else if (operationName === 'Create') {
            itemKey = null;
        }
        
        const updateState = { [modalKey]: false };
        if (itemKey) {
            updateState[itemKey] = null;
        }
        
        this.setState(updateState);
    }

    beginView = (subcategoria) => {
        // Busca o nome da categoria
        if (subcategoria.idCategoria) {
            this.categoriaService.findById(subcategoria.idCategoria)
                .then((response) => {
                    this.setState({ 
                        showModalView: true,
                        toViewItem: {
                            ...subcategoria,
                            nomeCategoria: response.data.nomeCategoria
                        }
                    });
                })
                .catch(() => {
                    this.setState({ 
                        showModalView: true,
                        toViewItem: subcategoria
                    });
                });
        } else {
            this.setState({ 
                showModalView: true,
                toViewItem: subcategoria
            });
        }
    }

    beginEdit = (subcategoria) => {
        this.fillOptionsCategorias();
        
        // Busca o nome da categoria para o select
        const categoriaOption = subcategoria.idCategoria ? {
            value: subcategoria.idCategoria,
            label: 'Carregando...'
        } : null;

        this.setState({ 
            showModalEdit: true,
            toEditItem: subcategoria,
            nomeSubcategoria: subcategoria.nomeSubcategoria,
            descricaoSubcategoria: subcategoria.descricaoSubcategoria,
            selectedCategoria: categoriaOption,
            isCategoriaInvalid: false
        });

        // Busca o nome da categoria
        if (subcategoria.idCategoria) {
            this.categoriaService.findById(subcategoria.idCategoria)
                .then((response) => {
                    this.setState({
                        selectedCategoria: {
                            value: subcategoria.idCategoria,
                            label: response.data.nomeCategoria
                        }
                    });
                })
                .catch(() => {
                    // Mantém o estado mesmo se não conseguir buscar
                });
        }
    }

    submitForm = (event) => {
        event.preventDefault();
        if (!this.validateForm()) return;

        const data = {
            nomeSubcategoria: this.state.nomeSubcategoria.trim(),
            descricaoSubcategoria: this.state.descricaoSubcategoria.trim(),
            idCategoria: this.state.selectedCategoria.value
        };

        if (this.state.showModalCreate) {
            this.subcategoriaService.insert(data)
                .then(() => {
                    toast.success('Subcategoria criada com sucesso!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    this.fillLists();
                    this.closeModal('Create');
                })
                .catch((error) => {
                    const message = error.response?.data?.message || 'Erro ao criar subcategoria';
                    toast.error(message, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                });
        } else if (this.state.showModalEdit) {
            this.subcategoriaService.update(this.state.toEditItem.id, data)
                .then(() => {
                    toast.success('Subcategoria atualizada com sucesso!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    this.fillLists();
                    this.closeModal('Edit');
                })
                .catch((error) => {
                    const message = error.response?.data?.message || 'Erro ao atualizar subcategoria';
                    toast.error(message, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                });
        }
    }

    componentDidMount() {
        this.fillLists();
        this.fillOptionsCategorias();
    }

    render() {
        return (
        <div className="tcc-page bg-light min-vh-100">
            <Navbar />
            <ToastContainer/>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='page-content container-fluid px-4'
            >
                <div className="row mb-4 mt-4">
                    <div className="col-12">
                        <h1 className='display-5 fw-bold mb-4 tittle tittleAfter'>Subcategorias</h1>
                    </div>
                </div>

                <div className="row align-items-center mb-4">
                    <div className="col-auto">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary btn-lg d-flex align-items-center new-tcc-button styled-button"
                            onClick={this.beginInsertion}
                        >
                            <i className="bi bi-file-earmark-plus fs-4 me-2"></i>
                            <span>Nova Subcategoria</span>
                        </motion.button>
                    </div>
                    <div className="col-auto">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-secondary btn-lg d-flex align-items-center categories-button styled-button"
                            onClick={() => this.props.navigate('/categorias')}
                        >
                            <i className="bi bi-tags fs-4 me-2"></i>
                            <span>Categorias</span>
                        </motion.button>
                    </div>
                    <div className="col-auto">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-secondary btn-lg d-flex align-items-center categories-button styled-button"
                            onClick={() => this.props.navigate('/tcc')}
                        >
                            <i className="bi bi-filter-square fs-4 me-2"></i>
                            <span>TCC's</span>
                        </motion.button>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h5 className="card-title mb-3">Filtros</h5>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="filterNome" className="form-label">Nome</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="filterNome"
                                            name="filterNome"
                                            placeholder="Buscar por nome..."
                                            value={this.state.filterNome}
                                            onChange={this.handleFilterChange}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="filterDescricao" className="form-label">Descrição</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="filterDescricao"
                                            name="filterDescricao"
                                            placeholder="Buscar por descrição..."
                                            value={this.state.filterDescricao}
                                            onChange={this.handleFilterChange}
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="filterCategoria" className="form-label">Categoria</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isClearable={true}
                                            isSearchable={true}
                                            name="filterCategoria"
                                            options={this.state.optionsCategorias}
                                            noOptionsMessage={() => "Não há categorias cadastradas"}
                                            placeholder="Filtrar por categoria..."
                                            value={this.state.filterCategoria}
                                            onChange={this.handleFilterCategoriaChange}
                                        />
                                    </div>
                                    <div className="col-md-1 mb-3 d-flex align-items-end">
                                        <button 
                                            className="btn btn-secondary w-100" 
                                            onClick={this.clearFilters}
                                        >
                                            Limpar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">Nome</th>
                                                <th scope="col">Descrição</th>
                                                <th scope="col">Categoria</th>
                                                <th scope="col" className="text-end">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.filteredItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-muted py-5">
                                                        Nenhuma subcategoria encontrada
                                                    </td>
                                                </tr>
                                            ) : (
                                                this.state.filteredItems.map((subcategoria) => (
                                                    <tr key={subcategoria.id}>
                                                        <td>{subcategoria.nomeSubcategoria}</td>
                                                        <td>
                                                            <span className="text-truncate d-inline-block" style={{maxWidth: '400px'}} title={subcategoria.descricaoSubcategoria}>
                                                                {subcategoria.descricaoSubcategoria}
                                                            </span>
                                                        </td>
                                                        <td>{subcategoria.nomeCategoria || 'N/A'}</td>
                                                        <td className="text-end">
                                                            <button 
                                                                className="btn btn-sm btn-outline-info me-2"
                                                                onClick={() => this.beginView(subcategoria)}
                                                            >
                                                                <i className="bi bi-eye me-1"></i>
                                                                Ver
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => this.beginEdit(subcategoria)}
                                                            >
                                                                <i className="bi bi-pencil me-1"></i>
                                                                Editar
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => this.beginDeletion(subcategoria)}
                                                            >
                                                                <i className="bi bi-trash me-1"></i>
                                                                Excluir
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div id='modals'>
                <AnimatePresence>
                    {this.state.showModalDeletion && (
                        <Modal show={this.state.showModalDeletion} onHide={() => this.closeModal('Deletion')} centered>
                            <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                <Modal.Title>Confirmar Exclusão</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Tem certeza que deseja excluir a subcategoria "{this.state.toDeleteItem?.nomeSubcategoria}"?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.closeModal('Deletion')}>
                                    Cancelar
                                </Button>
                                <Button variant="danger" onClick={this.delete}>
                                    Confirmar Exclusão
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {this.state.showModalView && (
                        <Modal show={this.state.showModalView} onHide={() => this.closeModal('View')} centered size='lg'>
                            <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                <Modal.Title>Detalhes da Subcategoria</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nome da Subcategoria:</label>
                                    <p className="form-control-plaintext">{this.state.toViewItem?.nomeSubcategoria}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Descrição:</label>
                                    <p className="form-control-plaintext">{this.state.toViewItem?.descricaoSubcategoria}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Categoria:</label>
                                    <p className="form-control-plaintext">{this.state.toViewItem?.nomeCategoria || 'N/A'}</p>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.closeModal('View')}>
                                    Fechar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {this.state.showModalEdit && (
                        <Modal show={this.state.showModalEdit} onHide={() => this.closeModal('Edit')} centered size='lg'>
                            <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                <Modal.Title>Editar Subcategoria</Modal.Title>
                            </Modal.Header>
                            <form onSubmit={this.submitForm}>
                                <Modal.Body>
                                    <div className="mb-3">
                                        <label htmlFor="editNomeSubcategoria" className="form-label">Nome da Subcategoria *</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="editNomeSubcategoria"
                                            name="nomeSubcategoria"
                                            placeholder="Digite o nome da subcategoria..."
                                            value={this.state.nomeSubcategoria}
                                            onChange={this.handleChange}
                                            maxLength="50"
                                            required
                                        />
                                        <small className="form-text text-muted">Máximo 50 caracteres</small>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editDescricaoSubcategoria" className="form-label">Descrição *</label>
                                        <textarea 
                                            className="form-control" 
                                            id="editDescricaoSubcategoria"
                                            name="descricaoSubcategoria"
                                            placeholder="Digite a descrição da subcategoria..."
                                            value={this.state.descricaoSubcategoria}
                                            onChange={this.handleChange}
                                            rows="4"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editCategoria" className="form-label">Categoria *</label>
                                        <Select
                                            className={`basic-single ${this.state.isCategoriaInvalid ? 'is-invalid' : ''}`}
                                            classNamePrefix="select"
                                            isClearable={false}
                                            isSearchable={true}
                                            name="selectCategoria"
                                            options={this.state.optionsCategorias}
                                            noOptionsMessage={() => "Não há categorias cadastradas"}
                                            placeholder="Selecione uma categoria..."
                                            value={this.state.selectedCategoria}
                                            onChange={this.handleCategoriaChange}
                                            required
                                        />
                                        {this.state.isCategoriaInvalid && (
                                            <div className="invalid-feedback d-block">Por favor, selecione uma categoria.</div>
                                        )}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.closeModal('Edit')}>
                                        Cancelar
                                    </Button>
                                    <button type='submit' className="btn btn-primary">Salvar</button>
                                </Modal.Footer>
                            </form>
                        </Modal>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {this.state.showModalCreate && (
                        <Modal show={this.state.showModalCreate} onHide={() => this.closeModal('Create')} centered size='lg'>
                            <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                <Modal.Title>Nova Subcategoria</Modal.Title>
                            </Modal.Header>
                            <form onSubmit={this.submitForm}>
                                <Modal.Body>
                                    <div className="mb-3">
                                        <label htmlFor="createNomeSubcategoria" className="form-label">Nome da Subcategoria *</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="createNomeSubcategoria"
                                            name="nomeSubcategoria"
                                            placeholder="Digite o nome da subcategoria..."
                                            value={this.state.nomeSubcategoria}
                                            onChange={this.handleChange}
                                            maxLength="50"
                                            required
                                        />
                                        <small className="form-text text-muted">Máximo 50 caracteres</small>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="createDescricaoSubcategoria" className="form-label">Descrição *</label>
                                        <textarea 
                                            className="form-control" 
                                            id="createDescricaoSubcategoria"
                                            name="descricaoSubcategoria"
                                            placeholder="Digite a descrição da subcategoria..."
                                            value={this.state.descricaoSubcategoria}
                                            onChange={this.handleChange}
                                            rows="4"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="createCategoria" className="form-label">Categoria *</label>
                                        <Select
                                            className={`basic-single ${this.state.isCategoriaInvalid ? 'is-invalid' : ''}`}
                                            classNamePrefix="select"
                                            isClearable={false}
                                            isSearchable={true}
                                            name="selectCategoria"
                                            options={this.state.optionsCategorias}
                                            noOptionsMessage={() => "Não há categorias cadastradas"}
                                            placeholder="Selecione uma categoria..."
                                            value={this.state.selectedCategoria}
                                            onChange={this.handleCategoriaChange}
                                            required
                                        />
                                        {this.state.isCategoriaInvalid && (
                                            <div className="invalid-feedback d-block">Por favor, selecione uma categoria.</div>
                                        )}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.closeModal('Create')}>
                                        Cancelar
                                    </Button>
                                    <button type='submit' className="btn btn-primary">Criar</button>
                                </Modal.Footer>
                            </form>
                        </Modal>
                    )}
                </AnimatePresence>
            </div>
        </div>
        )
  }
}

export default withNavigate(Subcategoria);

