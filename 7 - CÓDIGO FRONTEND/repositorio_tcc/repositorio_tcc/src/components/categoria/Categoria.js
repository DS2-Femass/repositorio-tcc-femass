import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Select from 'react-select'
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoriaService } from '../../service/CategoriaService';

function withNavigate(Component) {
    return (props) => {
      const navigate = useNavigate();
      return <Component {...props} navigate={navigate} />;
    };
  }

const defaultSelectOption = { value: '', label: 'Selecione...', isDisabled: true };

class Categoria extends Component {
  
    state = {
        categorias: [],
        subcategorias: [],
        filteredItems: [],
        optionsCategorias: [],
        toDeleteItem: null,
        showModalDeletion: false,
        showModalEdit: false,
        showModalView: false,
        toViewItem: null,
        toEditItem: null,
    }

    categoriaService = new CategoriaService();

    applyFilters = () => {
    }

    handleFilterChange = (event) => {
        this.setState({ [event.target.name]: event.target.value }, this.applyFilters);
    };

    clearFilters = () => {
        this.setState({filterTitulo: '', filterAluno: '', filterOrientador: ''}, this.applyFilters);
    }

    handleChange = (event) => {
        if(event.target.name.startsWith('filter')) this.applyFilters();
        this.setState({ [event.target.name]: event.target.value });
    };

    fillLists = () => {
        this.categoriaService.listAll()
            .then((response) => this.setState({tccs: response.data, filteredItems: response.data}))
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
    }

    validateForm = () => {

        return true;
    }

    clearState = () => {
        this.setState({
        });
    }

    beginDeletion = (tccs) => {
        this.setState({ toDeleteItem: tccs, showModalDeletion: true });
	}

    delete = () => {
    }

    closeModal = (operationName) => {
        this.clearState();
        this.setState({ ['showModal' + operationName]: false, ['to' + operationName + 'Item']: null });
    }

    beginView = (tcc) => { 
    }

    beginEdit = (tcc) => { 
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
                        <h1 className='display-5 fw-bold mb-4 tittle tittleAfter'>Categorias</h1>
                    </div>
                </div>

                <div className="row align-items-center mb-4">
                    <div className="col-auto">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary btn-lg d-flex align-items-center new-tcc-button styled-button"
                            data-bs-toggle="modal" 
                            data-bs-target="#insertionModal" 
                            onClick={this.beginInsertion}
                        >
                            <i className="bi bi-file-earmark-plus fs-4 me-2"></i>
                            <span>Nova Categoria</span>
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

                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div id='modals'>
                <AnimatePresence>
                    <div className="modal fade large-modal" id="insertionModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
                        <div
                            className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl"
                            role="document"
                        >
                            <div className="modal-content">
                                <div className="modal-header bg-dark">
                                </div>
                                <div className="modal-body">
                                </div>
                                <div className="modal-footer">
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatePresence>

                <AnimatePresence>
                    {this.state.showModalDeletion && (
                        <Modal show={this.state.showModalDeletion} onHide={() => this.closeModal('Deletion')} centered>
                            <Modal.Header className='bg-dark text-white' closeButton closeVariant='white' closeB>
                                <Modal.Title>Confirmar Exclusão</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Tem certeza que deseja excluir ?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.closeModal('Deletion')}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={this.delete}>
                                    Confirmar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {this.state.showModalView && (
                        <Modal show={this.state.showModalView} onHide={() => this.closeModal('View')} centered>
                            <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                            <Modal.Title>Resumo</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
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
                        <Modal show={this.state.showModalEdit} onHide={() => this.closeModal('Edit')} centered size='xl'>
                            <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                            <Modal.Title>Editar</Modal.Title>
                            </Modal.Header>
                            <form onSubmit={this.submitTCCForm}>
                            <Modal.Body>
                                
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.closeModal('Edit')}>
                                    Fechar
                                </Button>
                                <button type='submit' className="btn btn-primary">Salvar</button>
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

export default withNavigate(Categoria);
