import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import '../../assets/css/meutcc.css';
import Select from 'react-select'
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { motion, AnimatePresence } from 'framer-motion';
import { TCCService } from '../../service/TCCService';
import { AlunoService } from '../../service/AlunoService';
import { OrientadorService } from '../../service/OrientadorService';
import { CursoService } from '../../service/CursoService';
import { Link } from 'react-router-dom'

function withNavigate(Component) {
    return (props) => {
      const navigate = useNavigate();
      return <Component {...props} navigate={navigate} />;
    };
  }

const defaultSelectOption = { value: '', label: 'Selecione...', isDisabled: true };

class TCC extends Component {
  
    state = {
        tccs: [],
        filteredItems: [],
        optionsAlunos: [],
        optionsOrientadores: [],
        optionsCursos: [],
        isCursoInvalid: false,
        selectedCurso: null,
        isAlunoInvalid: false,
        selectedAluno: null,
        isOrientadorInvalid: false,
        selectedOrientador: null,
        resumo: '',
        tituloTcc: '',
        anotacoes: '',
        toDeleteItem: null,
        showModalDeletion: false,
        showModalEdit: false,
        showModalView: false,
        toViewItem: null,
        toEditItem: null,
        filterTitulo: '',
        filterAluno: '',
        filterOrientador: ''
    }

    tccService = new TCCService();
    alunoService = new AlunoService();
    orientadorService = new OrientadorService();
    cursoService = new CursoService();

    columns = [
        {
          name: 'Título',
          selector: tcc => tcc.titulo,
          sortable: true,
          width: '38%'
        },
        {
          name: 'Nome',
          selector: tcc => tcc.nomeCompletoAluno,
          sortable: true,
          width: '25%'
        },
        {
          name: 'Orientador',
          selector: tcc => tcc.nomeCompletoOrientador,
          sortable: true,
          width: '25%'
        },
        {
            name: 'Ações',
            cell: tcc => <>
                <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Visualizar TCC" onClick={() => this.beginView(tcc)}><i className="bi bi-eye"></i></button>
                <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Editar TCC" onClick={() => this.beginEdit(tcc)}><i className="bi bi-pencil"></i></button>
                <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Excluir selecionado" onClick={() => this.beginDeletion(tcc)}><i className="bi bi-trash"></i></button>
            </>,
            width: '12%'
        }
    ];

    tableStyle = {
        headCells: {
            style: {
                backgroundColor: '#1a1a1a',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.95em',
                padding: '15px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            },
        },
        rows: {
            style: {
                fontSize: '0.9em',
                padding: '12px',
                '&:hover': {
                    backgroundColor: '#f8f9fa',
                    cursor: 'pointer'
                }
            },
        },
        cells: {
            style: {
                padding: '12px'
            }
        }
    };

    applyFilters = () => {
        this.setState((prevState) => ({
            filteredItems: prevState.tccs.filter((tcc) => {
                return (
                    (prevState.filterTitulo === '' || tcc.titulo.toLowerCase().includes(prevState.filterTitulo.toLowerCase())) &&
                    (prevState.filterAluno === '' || (tcc.nomeCompletoAluno && tcc.nomeCompletoAluno.toLowerCase().includes(prevState.filterAluno.toLowerCase()))) &&
                    (prevState.filterOrientador === '' || (tcc.nomeCompletoOrientador && tcc.nomeCompletoOrientador.toLowerCase().includes(prevState.filterOrientador.toLowerCase())))
                );
            })
        }));
    }

    handleFilterChange = (event) => {
        this.setState({ [event.target.name]: event.target.value }, this.applyFilters);
    };

    clearFilters = () => {
        this.setState({filterTitulo: '', filterAluno: '', filterOrientador: ''}, this.applyFilters);
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    fillList = () => {
        this.tccService.listAll()
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

    backToHome = () => {
        this.props.navigate('/home');
    } 

    fillOptionsAlunos = () => {
        this.alunoService.listAll()
            .then((response) => {
                const optionsAlunos = response.data.map(aluno => ({
                    value: aluno.id,
                    label: aluno.nomeCompleto
                }));
                this.setState({ optionsAlunos });
            });
    }

    fillOptionsOrientadores = () => {
        this.orientadorService.listAll()
            .then((response) => {
                        const optionsOrientadores = response.data.map(orientador => ({
                            value: orientador.id,
                            label: orientador.nomeCompleto
                        }));
                        this.setState({ optionsOrientadores });
            })
    }

    fillOptionsCursos = () => {
        this.cursoService.listAll()
            .then((response) => {
                        const optionsCursos = response.data.map(curso => ({
                            value: curso.id,
                            label: curso.nome
                        }));
                        this.setState({ optionsCursos });
            })
    }

    beginInsertion = () => {
        this.clearState();
        this.fillOptionsAlunos();
        this.fillOptionsOrientadores();
        this.fillOptionsCursos();
    }

    validateForm = () => {
        const { tituloTcc, selectedAluno, selectedCurso, selectedOrientador } = this.state;
        let isValid = true;

        if (!tituloTcc) isValid = false;

        if (!selectedAluno) {
            this.setState({ isAlunoInvalid: true });
            isValid = false;
        } else {
            this.setState({ isAlunoInvalid: false });
        }

        if (!selectedCurso) {
            this.setState({ isCursoInvalid: true });
            isValid = false;
        } else {
             this.setState({ isCursoInvalid: false });
        }

        if (!selectedOrientador) {
            this.setState({ isOrientadorInvalid: true });
            isValid = false;
        } else {
            this.setState({ isOrientadorInvalid: false });
        }

        return isValid;
    }

    clearState = () => {
        this.setState({
            tituloTcc: '',
            selectedAluno: null,
            selectedCurso: null,
            selectedOrientador: null,
            resumo: '',
            anotacoes: '',
            isAlunoInvalid: false,
            isCursoInvalid: false,
            isOrientadorInvalid: false
        });
    }

    closeModal = (operationName) => {
        this.clearState();
        this.setState({ ['showModal' + operationName]: false, ['to' + operationName + 'Item']: null });
    }
    
    // Novo método para fechar o Modal de Inserção (que usa o DOM do Bootstrap) e limpar o estado
    closeInsertionModal = () => {
        // Encontrar o botão de fechar do Bootstrap Modal de Inserção e simular o clique
        const closeButton = document.getElementById('btnCloseModal');
        if (closeButton) {
            closeButton.click();
        }
        this.clearState();
    }

    submitTCCForm = (event) => {
        event.preventDefault();
        
        if(!this.validateForm()) return;

        let data = {
            "titulo": this.state.tituloTcc,
            "idAluno": this.state.selectedAluno.value,
            "idOrientador": this.state.selectedOrientador.value,
            "idCurso": this.state.selectedCurso.value,
            "anotacoes": this.state.anotacoes
        }

        if(this.state.resumo) {
            data.resumo = this.state.resumo;
        }

        var request = null;
        const isEditing = !!this.state.toEditItem;

        if(!isEditing){
            request = this.tccService.insert(data);
        } else {
            data.id = this.state.toEditItem.id;
            request = this.tccService.update(this.state.toEditItem.id, data);
        }

        request
        .then(response => {
            if(isEditing){
                this.setState({showModalEdit: false})
                toast.success('TCC atualizado!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
            } else{
                // Fecha o modal de inserção (usando a função ajustada)
                this.closeInsertionModal(); 
                toast.success('TCC criado!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            this.clearState();
            this.fillList();
        })
        .catch(error => {
            toast.error('Ocorreu um erro', {
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

    beginDeletion = (tccs) => {
        this.setState({ toDeleteItem: tccs, showModalDeletion: true });
    }

    delete = () => {
        this.tccService.delete(this.state.toDeleteItem.id)
            .then(response => {
                        this.fillList();
                        this.setState({ showModalDeletion: false });
                        toast.success('TCC excluído!', {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          });
            }).catch((error) => {
                toast.error('Não foi possível excluir', {
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

    beginView = (tcc) => { 
        this.tccService.findById(tcc.id)
            .then((response) => {
                if(response.status === 200) {
                    return response.data;
                } else{
                    throw new Error('Erro na requisição: ' + response.status);
                }
            }).then((data) => {
                // Adicionado tratamento para campos nulos
                if (data.resumo === null) data.resumo = '';
                if (data.anotacoes === null) data.anotacoes = ''; 
                this.setState({ toViewItem: data, showModalView: true });
            })
            .catch((error) => {
                toast.error('Não foi possível carregar os detalhes.', {
                    position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
                });
            });
    }

    beginEdit = (tcc) => { 
        this.clearState(); // Limpa o estado para evitar lixo de outras operações
        this.fillOptionsAlunos();
        this.fillOptionsOrientadores();
        this.fillOptionsCursos();

        this.tccService.findById(tcc.id)
            .then((response) => {
                if(response.status === 200) {
                    return response.data;
                } else{
                    throw new Error('Erro na requisição: ' + response.status);
                }
            }).then((data) => { 
                // Verifica se resumo é nulo e define como string vazia
                if (data.resumo === null) data.resumo = '';

                // CORREÇÃO: Verifica se anotacoes é nulo e define como string vazia
                if (data.anotacoes === null) data.anotacoes = ''; 

                this.setState({ 
                    toEditItem: data,
                    showModalEdit: true,
                    tituloTcc: data.titulo,
                    resumo: data.resumo,
                    anotacoes: data.anotacoes,
                    selectedCurso: { value: data.idCurso, label: data.nomeCurso },
                    selectedAluno: { value: data.idAluno, label: data.nomeCompletoAluno },
                    selectedOrientador: { value: data.idOrientador, label: data.nomeCompletoOrientador } 
                });
            })
            .catch((error) => {
                toast.error('Não foi possível carregar os dados para edição.', {
                    position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
                });
            });
    }

    componentDidMount() {
        this.fillList();
    }

    render() {
        // Extrai a função de fechar do Modal para uso nos modais do React-Bootstrap
        const closeModalDeletion = () => this.closeModal('Deletion');
        const closeModalEdit = () => this.closeModal('Edit');
        const closeModalView = () => this.closeModal('View');

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
                        <h1 className='display-5 fw-bold mb-4 tittle tittleAfter'>Trabalhos de Conclusão de Curso</h1>
                    </div>
                </div>
                {/*  */}

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
                            <span>Novo TCC</span>
                        </motion.button>
                    </div>
                    <div className="col-auto">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-secondary btn-lg d-flex align-items-center categories-button styled-button"
                            onClick={() => this.props.navigate('/categorias')}
                        >
                            <i className="bi bi-filter-square fs-4 me-2"></i>
                            <span>Categorias</span>
                        </motion.button>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-12">
                        <motion.div 
                            whileHover={{ scale: 1.01 }}
                            className="card border-0 shadow-sm"
                        >
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="card-title mb-0">Filtros de Pesquisa</h5>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        className="btn btn-outline-secondary clear-filters-btn"
                                        onClick={this.clearFilters}
                                        title="Limpar filtros"
                                    >
                                        <i className="bi bi-eraser me-2"></i>
                                        Limpar Filtros
                                    </motion.button>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input
                                                id="filterTitulo"
                                                name='filterTitulo'
                                                type="text"
                                                className="form-control"
                                                placeholder="Buscar título..."
                                                value={this.state.filterTitulo}
                                                onChange={this.handleFilterChange}
                                            />
                                            <label htmlFor="filterTitulo">Título</label>
                                            
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input
                                                id="filterAluno"
                                                name="filterAluno"
                                                type="text"
                                                className="form-control"
                                                placeholder="Buscar aluno..."
                                                value={this.state.filterAluno}
                                                onChange={this.handleFilterChange}
                                            />
                                            <label htmlFor="filterAluno">Aluno</label>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input
                                                id="filterOrientador"
                                                type="text"
                                                className="form-control"
                                                name="filterOrientador"
                                                placeholder="Buscar orientador..."
                                                value={this.state.filterOrientador}
                                                onChange={this.handleFilterChange}
                                            />
                                            <label htmlFor="filterOrientador">Orientador</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <DataTable
                                    columns={this.columns}
                                    data={this.state.filteredItems}
                                    pagination
                                    paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
                                    paginationComponentOptions={{
                                        rowsPerPageText: 'Registros por página',
                                        rangeSeparatorText: 'de',
                                    }}
                                    customStyles={this.tableStyle}
                                    noDataComponent={
                                        <div className="p-4 text-center text-muted">
                                            <i className="bi bi-search fs-2"></i>
                                            <p className="mt-2">Nenhum trabalho encontrado</p>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div id='modals'>
                {/* Modal de Inserção (Usando o padrão do Bootstrap) */}
                <AnimatePresence>
                    <div className="modal fade large-modal" id="insertionModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
                        <div
                            className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl"
                            role="document"
                        >
                            <div className="modal-content">
                                <div className="modal-header bg-dark">
                                    <h5 className="modal-title text-white" id="modalTitleId">
                                        Novo TCC
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close modal-close-button"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={this.clearState}
                                    ></button>
                                </div>
                                <form onSubmit={this.submitTCCForm}>
                                    <div className="modal-body">
                                        <div className="container">
                                                    <div className="mb-3 row">
                                                        <div className="col-12">
                                                            <label htmlFor="tituloTcc" className="col-4 col-form-label fw-bold required">Título</label>
                                                            <input type="text" className="form-control" name="tituloTcc" id="tituloTcc" onChange={this.handleChange} value={this.state.tituloTcc} required/>
                                                        </div>
                                                        <div className="col-12 mt-3">
                                                            <label htmlFor="inputAnotacoes" className="col-12 col-form-label fw-bold">Anotações</label>
                                        <textarea 
                                            rows="3" 
                                            className='form-control' 
                                            style={{resize: "none"}} 
                                            name="anotacoes" 
                                            id="inputAnotacoes"    
                                            value={this.state.anotacoes}
                                            onChange={this.handleChange}    
                                            placeholder="Digite suas anotações aqui..."
                                            ></textarea>
                                                        </div>

                                                        <div className="col-12 mt-3">
                                                            <label htmlFor="resumo" className="col-12 col-form-label fw-bold">Resumo</label>
                                                            <textarea rows="3" className='form-control' style={{resize: "none"}} name="resumo" onChange={this.handleChange} value={this.state.resumo} placeholder="Digite o resumo do TCC aqui..."></textarea>
                                                        </div>
                                                        <div className="col-12 mt-3">
                                                            <label htmlFor="selectCurso" className="col-12 col-form-label fw-bold required">Curso</label>
                                                            <Select
                                                                className={`basic-single ${this.state.isCursoInvalid ? 'is-invalid' : ''}`}
                                                                classNamePrefix="select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                name="selectCurso"
                                                                options={this.state.optionsCursos}
                                                                noOptionsMessage={() => "Não há cursos cadastrados"}
                                                                placeholder="Selecione.."
                                                                onChange={(selectedOption) => this.setState({ selectedCurso: selectedOption, isCursoInvalid: !selectedOption })}
                                                                value={this.state.selectedCurso}
                                                            />
                                                            {this.state.isCursoInvalid && <div className="invalid-feedback d-block">Por favor, selecione um curso.</div>}
                                                        </div>
                                                        <div className="col-11 mt-3">
                                                            <label htmlFor="selectAluno" className="col-12 col-form-label fw-bold required">Aluno</label>
                                                            <Select
                                                                className={`basic-single ${this.state.isAlunoInvalid ? 'is-invalid' : ''}`}
                                                                classNamePrefix="select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                name="selectAluno"
                                                                options={this.state.optionsAlunos}
                                                                noOptionsMessage={() => "Não há alunos cadastrados"}
                                                                placeholder="Selecione.."
                                                                onChange={(selectedOption) => this.setState({ selectedAluno: selectedOption, isAlunoInvalid: !selectedOption })}
                                                                value={this.state.selectedAluno}
                                                            />
                                                            {this.state.isAlunoInvalid && <div className="invalid-feedback d-block">Por favor, selecione um aluno.</div>}
                                                        </div>
                                                        <div className='col-1 d-flex align-items-end mb-3'>
                                                            <Link 
                                                                to="/alunos" 
                                                                onClick={this.closeInsertionModal}
                                                                className="btn btn-outline-primary btn-sm"
                                                                title="Cadastrar novo aluno"
                                                            >
                                                                <i className="bi bi-plus-circle d-flex align-items-center p-1"></i>
                                                            </Link>
                                                        </div>
                                                        <div className="col-12 mt-3">
                                                            <label htmlFor="selectOrientador" className="col-12 col-form-label fw-bold required">Orientador</label>
                                                            <Select
                                                                className={`basic-single ${this.state.isOrientadorInvalid ? 'is-invalid' : ''}`}
                                                                classNamePrefix="select"
                                                                defaultValue={defaultSelectOption}
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                name="selectOrientador"
                                                                options={this.state.optionsOrientadores}
                                                                noOptionsMessage={() => "Não há orientadores cadastrados"}
                                                                placeholder="Selecione.."
                                                                value={this.state.selectedOrientador}
                                                                onChange={(selectedOption) => this.setState({ selectedOrientador: selectedOption, isOrientadorInvalid: !selectedOption })}
                                                            />
                                                            {this.state.isOrientadorInvalid && <div className="invalid-feedback d-block">Por favor, selecione um orientador.</div>}
                                                        </div>
                                                    </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" id="btnCloseModal" className="btn btn-secondary" data-bs-dismiss="modal" onClick={this.clearState}>Fechar</button>
                                        <button type="submit" className="btn btn-primary">Salvar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </AnimatePresence>

                {/* Modal de Exclusão (Usando React-Bootstrap Modal) */}
                <AnimatePresence>
                    {this.state.showModalDeletion && (
                        <Modal show={this.state.showModalDeletion} onHide={closeModalDeletion} centered>
                            <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                <Modal.Title>Confirmar Exclusão</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Tem certeza que deseja excluir o trabalho **{this.state.toDeleteItem?.titulo}**?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={closeModalDeletion}>
                                    Cancelar
                                </Button>
                                <Button variant="danger" onClick={this.delete}>
                                    Excluir
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </AnimatePresence>

                {/* Modal de Edição (Usando React-Bootstrap Modal) */}
                <AnimatePresence>
                    {this.state.showModalEdit && (
                         <Modal show={this.state.showModalEdit} onHide={closeModalEdit} centered size="xl" scrollable>
                            <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                <Modal.Title>Editar TCC: {this.state.toEditItem?.titulo}</Modal.Title>
                            </Modal.Header>
                            <form onSubmit={this.submitTCCForm}>
                                <Modal.Body>
                                    <div className="container">
                                        <div className="mb-3 row">
                                            <div className="col-12">
                                                <label htmlFor="tituloTcc" className="col-4 col-form-label fw-bold required">Título</label>
                                                <input type="text" className="form-control" name="tituloTcc" id="tituloTcc" onChange={this.handleChange} value={this.state.tituloTcc} required/>
                                            </div>
                                            <div className="col-12 mt-3">
                                                <label htmlFor="inputAnotacoes" className="col-12 col-form-label fw-bold">Anotações</label>
                                                <textarea 
                                                    rows="3" 
                                                    className='form-control' 
                                                    style={{resize: "none"}} 
                                                    name="anotacoes" 
                                                    id="inputAnotacoes"    
                                                    value={this.state.anotacoes}
                                                    onChange={this.handleChange}    
                                                    placeholder="Digite suas anotações aqui..."
                                                ></textarea>
                                            </div>

                                            <div className="col-12 mt-3">
                                                <label htmlFor="resumo" className="col-12 col-form-label fw-bold">Resumo</label>
                                                <textarea rows="3" className='form-control' style={{resize: "none"}} name="resumo" onChange={this.handleChange} value={this.state.resumo} placeholder="Digite o resumo do TCC aqui..."></textarea>
                                            </div>
                                            
                                            {/* O curso não é editável, então é exibido como texto simples/desabilitado. */}
                                            <div className="col-12 mt-3">
                                                <label htmlFor="selectCurso" className="col-12 col-form-label fw-bold required">Curso</label>
                                                <Select
                                                    className={`basic-single ${this.state.isCursoInvalid ? 'is-invalid' : ''}`}
                                                    classNamePrefix="select"
                                                    isClearable={false} // Curso geralmente não é editável
                                                    isSearchable={false} // Curso geralmente não é editável
                                                    name="selectCurso"
                                                    options={this.state.optionsCursos}
                                                    placeholder="Selecione.."
                                                    value={this.state.selectedCurso}
                                                    isDisabled={true} // Desabilitar edição do curso após a criação
                                                />
                                                {this.state.isCursoInvalid && <div className="invalid-feedback d-block">Por favor, selecione um curso.</div>}
                                            </div>

                                            {/* O aluno não é editável, então é exibido como texto simples/desabilitado. */}
                                            <div className="col-12 mt-3">
                                                <label htmlFor="selectAluno" className="col-12 col-form-label fw-bold required">Aluno</label>
                                                <Select
                                                    className={`basic-single ${this.state.isAlunoInvalid ? 'is-invalid' : ''}`}
                                                    classNamePrefix="select"
                                                    isClearable={false} // Aluno geralmente não é editável
                                                    isSearchable={false} // Aluno geralmente não é editável
                                                    name="selectAluno"
                                                    options={this.state.optionsAlunos}
                                                    placeholder="Selecione.."
                                                    value={this.state.selectedAluno}
                                                    isDisabled={true} // Desabilitar edição do aluno após a criação
                                                />
                                                {this.state.isAlunoInvalid && <div className="invalid-feedback d-block">Por favor, selecione um aluno.</div>}
                                            </div>
                                            
                                            <div className="col-12 mt-3">
                                                <label htmlFor="selectOrientador" className="col-12 col-form-label fw-bold required">Orientador</label>
                                                <Select
                                                    className={`basic-single ${this.state.isOrientadorInvalid ? 'is-invalid' : ''}`}
                                                    classNamePrefix="select"
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    name="selectOrientador"
                                                    options={this.state.optionsOrientadores}
                                                    noOptionsMessage={() => "Não há orientadores cadastrados"}
                                                    placeholder="Selecione.."
                                                    value={this.state.selectedOrientador}
                                                    onChange={(selectedOption) => this.setState({ selectedOrientador: selectedOption, isOrientadorInvalid: !selectedOption })}
                                                />
                                                {this.state.isOrientadorInvalid && <div className="invalid-feedback d-block">Por favor, selecione um orientador.</div>}
                                            </div>
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={closeModalEdit}>
                                        Fechar
                                    </Button>
                                    <Button type="submit" variant="primary">
                                        Salvar Alterações
                                    </Button>
                                </Modal.Footer>
                            </form>
                        </Modal>
                    )}
                </AnimatePresence>

                {/* Modal de Visualização (Usando React-Bootstrap Modal) */}
                <AnimatePresence>
                    {this.state.showModalView && (
                         <Modal show={this.state.showModalView} onHide={closeModalView} centered size="lg" scrollable>
                            <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                <Modal.Title>Visualizar TCC</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {this.state.toViewItem && (
                                    <div className="container p-3">
                                        <h3 className='mb-3 text-primary'>{this.state.toViewItem.titulo}</h3>
                                        <hr/>
                                        <p><strong>Curso:</strong> {this.state.toViewItem.nomeCurso}</p>
                                        <p><strong>Aluno:</strong> {this.state.toViewItem.nomeCompletoAluno}</p>
                                        <p><strong>Orientador:</strong> {this.state.toViewItem.nomeCompletoOrientador}</p>
                                        
                                        <h5 className='mt-4'>Resumo</h5>
                                        <div className="border p-3 rounded bg-light">
                                            <p className='mb-0'>{this.state.toViewItem.resumo || 'N/A'}</p>
                                        </div>

                                        <h5 className='mt-4'>Anotações</h5>
                                        <div className="border p-3 rounded bg-light">
                                            <p className='mb-0'>{this.state.toViewItem.anotacoes || 'Nenhuma anotação.'}</p>
                                        </div>
                                    </div>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={closeModalView}>
                                    Fechar
                                </Button>
                                <Button variant="primary" onClick={() => { closeModalView(); this.beginEdit(this.state.toViewItem) }}>
                                    <i className="bi bi-pencil me-2"></i>Editar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </AnimatePresence>
            </div>
        </div>
        );
    }
}

export default withNavigate(TCC);