import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { TurmaService } from '../../service/TurmaService';

function withNavigate(Component) {
    return (props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class Turma extends Component {

    state = {
        turmas: [],
        filteredItems: [],
        filterNome: '',
        toDeleteItem: null,
        showModalDeletion: false,
        showModalEdit: false,
        showModalCreate: false,
        toEditItem: null,
        nome: '',
    }

    turmaService = new TurmaService();

    applyFilters = () => {
        let filtered = [...this.state.turmas];
        if (this.state.filterNome) {
            filtered = filtered.filter(item =>
                item.nome.toLowerCase().includes(this.state.filterNome.toLowerCase())
            );
        }
        this.setState({ filteredItems: filtered });
    }

    handleFilterChange = (event) => {
        this.setState({ [event.target.name]: event.target.value }, this.applyFilters);
    };

    clearFilters = () => {
        this.setState({ filterNome: '' }, this.applyFilters);
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    fillLists = () => {
        this.turmaService.listAll()
            .then((response) => {
                this.setState({ turmas: response.data, filteredItems: response.data });
            })
            .catch(() => {
                toast.error('Erro ao carregar turmas', { position: "top-right", autoClose: 2000 });
            });
    }

    beginInsertion = () => {
        this.setState({ showModalCreate: true, nome: '' });
    }

    validateForm = () => {
        if (!this.state.nome || this.state.nome.trim() === '') {
            toast.error('O nome da turma é obrigatório');
            return false;
        }
        return true;
    }

    clearState = () => {
        this.setState({ nome: '' });
    }

    beginDeletion = (turma) => {
        this.setState({ toDeleteItem: turma, showModalDeletion: true });
    }

    delete = () => {
        this.turmaService.delete(this.state.toDeleteItem.id)
            .then(() => {
                toast.success('Turma excluída com sucesso!', { position: "top-right", autoClose: 2000 });
                this.fillLists();
                this.closeModal('Deletion');
            })
            .catch(() => {
                toast.error('Erro ao excluir turma', { position: "top-right", autoClose: 2000 });
            });
    }

    closeModal = (operationName) => {
        this.clearState();
        this.setState({ ['showModal' + operationName]: false, ['to' + operationName + 'Item']: null });
    }

    beginEdit = (turma) => {
        this.setState({ showModalEdit: true, toEditItem: turma, nome: turma.nome });
    }

    submitForm = (event) => {
        event.preventDefault();
        if (!this.validateForm()) return;

        const data = { nome: this.state.nome };

        if (this.state.showModalCreate) {
            this.turmaService.insert(data)
                .then(() => {
                    toast.success('Turma criada com sucesso!', { position: "top-right", autoClose: 2000 });
                    this.fillLists();
                    this.closeModal('Create');
                })
                .catch((error) => {
                    const message = error.response?.data?.message || 'Erro ao criar turma';
                    toast.error(message, { position: "top-right", autoClose: 3000 });
                });
        } else if (this.state.showModalEdit) {
            this.turmaService.update(this.state.toEditItem.id, data)
                .then(() => {
                    toast.success('Turma atualizada com sucesso!', { position: "top-right", autoClose: 2000 });
                    this.fillLists();
                    this.closeModal('Edit');
                })
                .catch((error) => {
                    const message = error.response?.data?.message || 'Erro ao atualizar turma';
                    toast.error(message, { position: "top-right", autoClose: 3000 });
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
                <ToastContainer />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='page-content container-fluid px-4'
                >
                    <div className="row mb-4 mt-4">
                        <div className="col-12">
                            <h1 className='display-5 fw-bold mb-4 tittle tittleAfter'>Turmas</h1>
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
                                <span>Nova Turma</span>
                            </motion.button>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h5 className="card-title mb-3">Filtros</h5>
                                    <div className="row">
                                        <div className="col-md-8 mb-3">
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
                                        <div className="col-md-2 mb-3 d-flex align-items-end">
                                            <button className="btn btn-secondary w-100" onClick={this.clearFilters}>
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
                                                    <th scope="col" className="text-end">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.filteredItems.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="2" className="text-center text-muted py-5">
                                                            Nenhuma turma encontrada
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    this.state.filteredItems.map((turma) => (
                                                        <tr key={turma.id}>
                                                            <td>{turma.nome}</td>
                                                            <td className="text-end">
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary me-2"
                                                                    onClick={() => this.beginEdit(turma)}
                                                                >
                                                                    <i className="bi bi-pencil me-1"></i>Editar
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => this.beginDeletion(turma)}
                                                                >
                                                                    <i className="bi bi-trash me-1"></i>Excluir
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
                                    Tem certeza que deseja excluir a turma "{this.state.toDeleteItem?.nome}"?
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.closeModal('Deletion')}>Cancelar</Button>
                                    <Button variant="danger" onClick={this.delete}>Confirmar Exclusão</Button>
                                </Modal.Footer>
                            </Modal>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {(this.state.showModalCreate || this.state.showModalEdit) && (
                            <Modal
                                show={this.state.showModalCreate || this.state.showModalEdit}
                                onHide={() => this.closeModal(this.state.showModalCreate ? 'Create' : 'Edit')}
                                centered
                            >
                                <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                    <Modal.Title>{this.state.showModalCreate ? 'Nova Turma' : 'Editar Turma'}</Modal.Title>
                                </Modal.Header>
                                <form onSubmit={this.submitForm}>
                                    <Modal.Body>
                                        <div className="mb-3">
                                            <label htmlFor="turmaNoome" className="form-label">Nome *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="turmaNome"
                                                name="nome"
                                                placeholder="Ex: ADS 2024/1"
                                                value={this.state.nome}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => this.closeModal(this.state.showModalCreate ? 'Create' : 'Edit')}>
                                            Cancelar
                                        </Button>
                                        <button type='submit' className="btn btn-primary">
                                            {this.state.showModalCreate ? 'Criar' : 'Salvar'}
                                        </button>
                                    </Modal.Footer>
                                </form>
                            </Modal>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }
}

export default withNavigate(Turma);
