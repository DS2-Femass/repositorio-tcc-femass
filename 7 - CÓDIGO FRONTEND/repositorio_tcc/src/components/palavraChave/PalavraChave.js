import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { PalavraChaveService } from '../../service/PalavraChaveService';

function withNavigate(Component) {
    return (props) => {
      const navigate = useNavigate();
      return <Component {...props} navigate={navigate} />;
    };
}

class PalavraChave extends Component {
  
    state = {
        palavrasChave: [],
        filteredItems: [],
        filterNome: '',
        filterAtivo: 'all',
        toDeleteItem: null,
        showModalDeletion: false,
        showModalEdit: false,
        showModalCreate: false,
        toEditItem: null,
        nome: '',
        ativo: true,
    }

    palavraChaveService = new PalavraChaveService();

    applyFilters = () => {
        let filtered = [...this.state.palavrasChave];
        
        if (this.state.filterNome) {
            filtered = filtered.filter(item => 
                item.nome.toLowerCase().includes(this.state.filterNome.toLowerCase())
            );
        }

        if (this.state.filterAtivo !== 'all') {
            const ativoFilter = this.state.filterAtivo === 'true';
            filtered = filtered.filter(item => item.ativo === ativoFilter);
        }

        this.setState({ filteredItems: filtered });
    }

    handleFilterChange = (event) => {
        this.setState({ [event.target.name]: event.target.value }, this.applyFilters);
    };

    clearFilters = () => {
        this.setState({filterNome: '', filterAtivo: 'all'}, this.applyFilters);
    }

    handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        this.setState({ 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    fillLists = () => {
        this.palavraChaveService.listAll()
            .then((response) => {
                this.setState({
                    palavrasChave: response.data, 
                    filteredItems: response.data
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

    beginInsertion = () => {
        this.setState({
            showModalCreate: true,
            nome: '',
            ativo: true
        });
    }

    validateForm = () => {
        if (!this.state.nome || this.state.nome.trim() === '') {
            toast.error('O nome é obrigatório');
            return false;
        }
        if (this.state.nome.length > 30) {
            toast.error('O nome deve ter no máximo 30 caracteres');
            return false;
        }
        return true;
    }

    clearState = () => {
        this.setState({
            nome: '',
            ativo: true
        });
    }

    beginDeletion = (palavra) => {
        this.setState({ toDeleteItem: palavra, showModalDeletion: true });
    }

    delete = () => {
        this.palavraChaveService.delete(this.state.toDeleteItem.id)
            .then(() => {
                toast.success('Palavra-chave excluída com sucesso!', {
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
                toast.error('Erro ao excluir palavra-chave', {
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
        this.setState({ ['showModal' + operationName]: false, ['to' + operationName + 'Item']: null });
    }

    beginEdit = (palavra) => {
        this.setState({ 
            showModalEdit: true,
            toEditItem: palavra,
            nome: palavra.nome,
            ativo: palavra.ativo
        });
    }

    submitForm = (event) => {
        event.preventDefault();
        if (!this.validateForm()) return;

        const data = {
            nome: this.state.nome,
            ativo: this.state.ativo
        };

        if (this.state.showModalCreate) {
            this.palavraChaveService.insert(data)
                .then(() => {
                    toast.success('Palavra-chave criada com sucesso!', {
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
                    const message = error.response?.data?.message || 'Erro ao criar palavra-chave';
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
            this.palavraChaveService.update(this.state.toEditItem.id, data)
                .then(() => {
                    toast.success('Palavra-chave atualizada com sucesso!', {
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
                    const message = error.response?.data?.message || 'Erro ao atualizar palavra-chave';
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
                        <h1 className='display-5 fw-bold mb-4 tittle tittleAfter'>Palavras-Chave</h1>
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
                            <span>Nova Palavra-Chave</span>
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
                                    <div className="col-md-6 mb-3">
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
                                        <label htmlFor="filterAtivo" className="form-label">Status</label>
                                        <select 
                                            className="form-select" 
                                            id="filterAtivo"
                                            name="filterAtivo"
                                            value={this.state.filterAtivo}
                                            onChange={this.handleFilterChange}
                                        >
                                            <option value="all">Todos</option>
                                            <option value="true">Ativo</option>
                                            <option value="false">Inativo</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2 mb-3 d-flex align-items-end">
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
                                                <th scope="col">Status</th>
                                                <th scope="col" className="text-end">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.filteredItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="3" className="text-center text-muted py-5">
                                                        Nenhuma palavra-chave encontrada
                                                    </td>
                                                </tr>
                                            ) : (
                                                this.state.filteredItems.map((palavra) => (
                                                    <tr key={palavra.id}>
                                                        <td>{palavra.nome}</td>
                                                        <td>
                                                            <span className={`badge ${palavra.ativo ? 'bg-success' : 'bg-secondary'}`}>
                                                                {palavra.ativo ? 'Ativo' : 'Inativo'}
                                                            </span>
                                                        </td>
                                                        <td className="text-end">
                                                            <button 
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => this.beginEdit(palavra)}
                                                            >
                                                                <i className="bi bi-pencil me-1"></i>
                                                                Editar
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => this.beginDeletion(palavra)}
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
                                Tem certeza que deseja excluir a palavra-chave "{this.state.toDeleteItem?.nome}"?
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
                    {this.state.showModalEdit && (
                        <Modal show={this.state.showModalEdit} onHide={() => this.closeModal('Edit')} centered size='lg'>
                            <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                            <Modal.Title>Editar Palavra-Chave</Modal.Title>
                            </Modal.Header>
                            <form onSubmit={this.submitForm}>
                            <Modal.Body>
                                <div className="mb-3">
                                    <label htmlFor="editNome" className="form-label">Nome</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="editNome"
                                        name="nome"
                                        placeholder="Digite o nome da palavra-chave..."
                                        value={this.state.nome}
                                        onChange={this.handleChange}
                                        maxLength="30"
                                        required
                                    />
                                    <small className="form-text text-muted">Máximo 30 caracteres</small>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check form-switch">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="editAtivo"
                                            name="ativo"
                                            checked={this.state.ativo}
                                            onChange={this.handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="editAtivo">
                                            Status Ativo
                                        </label>
                                    </div>
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
                            <Modal.Title>Nova Palavra-Chave</Modal.Title>
                            </Modal.Header>
                            <form onSubmit={this.submitForm}>
                            <Modal.Body>
                                <div className="mb-3">
                                    <label htmlFor="createNome" className="form-label">Nome *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="createNome"
                                        name="nome"
                                        placeholder="Digite o nome da palavra-chave..."
                                        value={this.state.nome}
                                        onChange={this.handleChange}
                                        maxLength="30"
                                        required
                                    />
                                    <small className="form-text text-muted">Máximo 30 caracteres</small>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check form-switch">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="createAtivo"
                                            name="ativo"
                                            checked={this.state.ativo}
                                            onChange={this.handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="createAtivo">
                                            Status Ativo (padrão: ativado)
                                        </label>
                                    </div>
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

export default withNavigate(PalavraChave);

