import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import '../../assets/css/meutcc.css';
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { motion, AnimatePresence } from 'framer-motion';
import { TCCService } from '../../service/TCCService';
import { AlunoService } from '../../service/AlunoService';
import { OrientadorService } from '../../service/OrientadorService';
import { CursoService } from '../../service/CursoService';
import { PalavraChaveService } from '../../service/PalavraChaveService';
import { SubcategoriaService } from '../../service/SubcategoriaService';
import { CategoriaService } from '../../service/CategoriaService';
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
        optionsPalavrasChave: [],
        optionsCategorias: [],
        optionsSubcategorias: [],
        isCursoInvalid: false,
        selectedCurso: null,
        isAlunoInvalid: false,
        selectedAluno: null,
        isOrientadorInvalid: false,
        selectedOrientador: null,
        selectedPalavrasChave: [],
        selectedCategoria: null,
        selectedSubcategoria: null,
        resumo: '',
        tituloTcc: '',
        toDeleteItem: null,
        showModalDeletion: false,
        showModalEdit: false,
        showModalView: false,
        toViewItem: null,
        toEditItem: null,
        filterTitulo: '',
        filterAluno: '',
        filterOrientador: '',
        filterPalavraChave: '',
        filterCurso: null
    }

    tccService = new TCCService();
    alunoService = new AlunoService();
    orientadorService = new OrientadorService();
    cursoService = new CursoService();
    palavraChaveService = new PalavraChaveService();
    subcategoriaService = new SubcategoriaService();
    categoriaService = new CategoriaService();

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
                <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Visualizar Instituto" onClick={() => this.beginView(tcc)}><i className="bi bi-eye"></i></button>
                <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Editar Instituto" onClick={() => this.beginEdit(tcc)}><i className="bi bi-pencil"></i></button>
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
                const matchesTitulo = prevState.filterTitulo === '' || tcc.titulo.toLowerCase().includes(prevState.filterTitulo.toLowerCase());
                const matchesAluno = prevState.filterAluno === '' || tcc.nomeCompletoAluno.toLowerCase().includes(prevState.filterAluno.toLowerCase());
                const matchesOrientador = prevState.filterOrientador === '' || tcc.nomeCompletoOrientador.toLowerCase().includes(prevState.filterOrientador.toLowerCase());
                const matchesPalavraChave = prevState.filterPalavraChave === '' || 
                    (tcc.palavrasChave && tcc.palavrasChave.some(p => p.nome.toLowerCase().includes(prevState.filterPalavraChave.toLowerCase())));
                
                return matchesTitulo && matchesAluno && matchesOrientador && matchesPalavraChave;
            })
        }));
    }

    handleFilterChange = (event) => {
        this.setState({ [event.target.name]: event.target.value }, this.applyFilters);
    };

    clearFilters = () => {
        
        this.setState({filterTitulo: '', filterAluno: '', filterOrientador: '', filterPalavraChave: '', filterCurso: null}, this.applyFilters);
    }

    handleFilterCursoChange = (selectedOption) => {
        this.setState({ filterCurso: selectedOption }, this.applyFilters);
    }

    handleChange = (event) => {
        if(event.target.name.startsWith('filter')) this.applyFilters();
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
            })
            .catch((error) => {
                console.error('Erro ao carregar alunos:', error);
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
            .catch((error) => {
                console.error('Erro ao carregar orientadores:', error);
            })
    }

    fillOptionsCursos = () => {
        this.cursoService.listAll()
            .then((response) => {
                if (response && response.data) {
                    const optionsCursos = response.data.map(curso => ({
                        value: curso.id,
                        label: curso.nome
                    }));
                    this.setState({ optionsCursos });
                    console.log('Cursos carregados:', optionsCursos);
                } else {
                    console.error('Resposta vazia ao carregar cursos');
                    this.setState({ optionsCursos: [] });
                }
            })
            .catch((error) => {
                console.error('Erro ao carregar cursos:', error);
                console.error('Detalhes do erro:', error.response);
                toast.error('Erro ao carregar cursos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                this.setState({ optionsCursos: [] });
            })
    }

    fillOptionsPalavrasChave = () => {
        this.palavraChaveService.findAllActive()
            .then((response) => {
                const optionsPalavrasChave = response.data.map(palavra => ({
                    value: palavra.id,
                    label: palavra.nome
                }));
                this.setState({ optionsPalavrasChave });
            })
            .catch((error) => {
                console.error('Erro ao carregar cursos:', error);
                toast.error('Erro ao carregar cursos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
    }

    fillOptionsPalavrasChave = () => {
        this.palavraChaveService.findAllActive()
            .then((response) => {
                const optionsPalavrasChave = response.data.map(palavra => ({
                    value: palavra.id,
                    label: palavra.nome
                }));
                this.setState({ optionsPalavrasChave });
            })
            .catch((error) => {
                console.error('Erro ao carregar palavras-chave:', error);
                this.setState({ optionsPalavrasChave: [] });
            });
    }

    fillOptionsSubcategorias = (cursoId) => {
        if (cursoId) {
            this.subcategoriaService.listAll()
                .then((response) => {
                    const optionsSubcategorias = response.data
                        .filter(sub => sub.idCategoria !== null)
                        .map(sub => ({
                            value: sub.id,
                            label: sub.nomeSubcategoria
                        }));
                    this.setState({ optionsSubcategorias });
                });
        }
    }

    beginInsertion = () => {
        this.fillOptionsAlunos();
        this.fillOptionsOrientadores();
        this.fillOptionsCursos();
        this.fillOptionsPalavrasChave();
        this.fillOptionsSubcategorias();
    }

    validateForm = () => {
        const { tituloTcc, selectedAluno, selectedCurso, selectedOrientador } = this.state;
        if (!tituloTcc || !selectedAluno || !selectedCurso || !selectedOrientador) {
            if (!selectedAluno) this.setState({ isAlunoInvalid: true });
            if (!selectedCurso) this.setState({ isCursoInvalid: true });
            if (!selectedOrientador) this.setState({ isOrientadorInvalid: true });
            return false;
        }

        return true;
    }

    clearState = () => {
        this.setState({
            tituloTcc: '',
            selectedAluno: null,
            selectedCurso: null,
            selectedOrientador: null,
            selectedPalavrasChave: [],
            selectedSubcategoria: null,
            resumo: '',
        });
    }

    submitTCCForm = (event) => {
        event.preventDefault();
        
        if(!this.validateForm()) return;

        let data = {
            "titulo": this.state.tituloTcc,
            "idAluno": this.state.selectedAluno.value,
            "idOrientador": this.state.selectedOrientador.value,
            "idCurso": this.state.selectedCurso.value
        }

        if(this.state.resumo) {
            data.resumo = this.state.resumo;
        }

        if(this.state.selectedSubcategoria) {
            data.idSubcategoria = this.state.selectedSubcategoria.value;
        }

        var request = null;
        if(!this.state.toEditItem){
            // Para criação, envia palavras-chave como objetos com id ou nome
            if(this.state.selectedPalavrasChave && this.state.selectedPalavrasChave.length > 0) {
                data.palavrasChave = this.state.selectedPalavrasChave.map(p => {
                    // Se for uma palavra-chave nova (sem ID), envia o nome
                    if(p.isNew) {
                        return { nome: p.label };
                    }
                    // Se for uma palavra-chave existente, envia o ID
                    return { id: p.value };
                });
            }
            request = this.tccService.insert(data);
        } else {
            // Para edição, envia IDs das palavras-chave existentes E novas palavras-chave
            data.id = this.state.toEditItem.id;
            if(this.state.selectedPalavrasChave && this.state.selectedPalavrasChave.length > 0) {
                // IDs das palavras existentes
                data.idPalavrasChave = this.state.selectedPalavrasChave
                    .filter(p => !p.isNew)
                    .map(p => p.value);
                
                // Novas palavras-chave
                const novasPalavras = this.state.selectedPalavrasChave
                    .filter(p => p.isNew)
                    .map(p => ({ nome: p.label }));
                
                if(novasPalavras.length > 0) {
                    data.palavrasChave = novasPalavras;
                }
            } else {
                data.idPalavrasChave = [];
            }
            request = this.tccService.update(this.state.toEditItem.id, data);
        }

        // .then(response => {
        //     if (response.ok) {
        //         return response.json();
        //     } else {
        //         throw new Error('Erro na requisição: ' + response.status);
        //     }
        // })
        // .then(data => {
        request
        .then(response => {
            if(this.state.toEditItem){
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
                document.getElementById('btnCloseModal').click();
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
            // Lógica para lidar com a resposta da API
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
            // Lógica para lidar com o erro
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

    closeModal = (operationName) => {
        this.clearState();
        this.setState({ ['showModal' + operationName]: false, ['to' + operationName + 'Item']: null });
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
                this.setState({ toViewItem: data, showModalView: true });
            })
            .catch((error) => {
            });
    }

    beginEdit = (tcc) => { 
        this.fillOptionsOrientadores();
        this.fillOptionsPalavrasChave();
        this.fillOptionsSubcategorias();

        this.tccService.findById(tcc.id)
            .then((response) => {
                if(response.status === 200) {
                    return response.data;
                } else{
                    throw new Error('Erro na requisição: ' + response.status);
                }
            }).then((data) => { 
                if (data.resumo === null) data.resumo = '';
                
                // Prepara palavras-chave selecionadas
                const palavrasChave = data.palavrasChave ? data.palavrasChave.map(p => ({
                    value: p.id,
                    label: p.nome
                })) : [];

                const subcategoria = data.idSubcategoria ? { value: data.idSubcategoria, label: 'Subcategoria' } : null;

                this.setState({ 
                    toEditItem: data,
                    showModalEdit: true,
                    tituloTcc: data.titulo,
                    resumo: data.resumo,
                    selectedCurso: { value: data.idCurso, label: data.nomeCurso },
                    selectedAluno: { value: data.idAluno, label: data.nomeCompletoAluno },
                    selectedOrientador: { value: data.idOrientador, label: data.nomeCompletoOrientador },
                    selectedPalavrasChave: palavrasChave,
                    selectedSubcategoria: subcategoria
                });
            })
            .catch((error) => {
            });
    }

    filterTextTitulo_change = (event) => {
        const searchText = event.target.value;

        this.setState({ filterTextTitulo: searchText });

        if (searchText === '') {
            this.setState({ filteredItems: this.state.tccs });
          } else {
            // Caso contrário, filtra os dados com base no texto inserido
            const filtered = this.state.tccs.filter(item =>
              item.titulo.toLowerCase().includes(searchText.toLowerCase())
            );
            this.setState({ filteredItems: filtered });
          }
    }

    componentDidMount() {
        this.fillList();
        this.fillOptionsCursos();
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
                        <h1 className='display-5 fw-bold mb-4 tittle tittleAfter'>Trabalhos de Conclusão de Curso</h1>
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
                                    <div className="col-md-3">
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
                                    <div className="col-md-3">
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
                                    <div className="col-md-3">
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
                                    <div className="col-md-3">
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isClearable={true}
                                            isSearchable={true}
                                            name="filterCurso"
                                            options={this.state.optionsCursos}
                                            noOptionsMessage={() => "Não há cursos cadastrados"}
                                            placeholder="Selecione um curso..."
                                            value={this.state.filterCurso}
                                            onChange={this.handleFilterCursoChange}
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    minHeight: '58px',
                                                    height: '58px',
                                                    borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
                                                    boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : 'none'
                                                }),
                                                valueContainer: (base) => ({
                                                    ...base,
                                                    height: '58px',
                                                    padding: '0.375rem 0.75rem'
                                                }),
                                                input: (base) => ({
                                                    ...base,
                                                    margin: '0px',
                                                    paddingTop: '0px',
                                                    paddingBottom: '0px'
                                                }),
                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: '#6c757d'
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="row g-3 mt-1">
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input
                                                id="filterPalavraChave"
                                                type="text"
                                                className="form-control"
                                                name="filterPalavraChave"
                                                placeholder="Buscar palavra-chave..."
                                                value={this.state.filterPalavraChave}
                                                onChange={this.handleFilterChange}
                                            />
                                            <label htmlFor="filterPalavraChave">Palavra-Chave</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-3 mt-1">
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input
                                                id="filterPalavraChave"
                                                type="text"
                                                className="form-control"
                                                name="filterPalavraChave"
                                                placeholder="Buscar palavra-chave..."
                                                value={this.state.filterPalavraChave}
                                                onChange={this.handleFilterChange}
                                            />
                                            <label htmlFor="filterPalavraChave">Palavra-Chave</label>
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
                                                        <label htmlFor="inputName" className="col-4 col-form-label fw-bold required">Título</label>
                                                        <input type="text" className="form-control" name="tituloTcc" id="tituloTcc" onChange={this.handleChange} value={this.state.tituloTcc} required/>
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Resumo</label>
                                                        <textarea rows="3" className='form-control' style={{resize: "none"}} name="resumo" onChange={this.handleChange} value={this.state.resumo}></textarea>
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="inputName" className="col-12 col-form-label fw-bold required">Curso</label>
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
                                                        {this.state.isCursoInvalid && <div className="invalid-feedback">Por favor, selecione um curso.</div>}
                                                    </div>
                                                    <div className="col-11">
                                                        <label htmlFor="inputName" className="col-12 col-form-label fw-bold required">Aluno</label>
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
                                                        {this.state.isAlunoInvalid && <div className="invalid-feedback">Por favor, selecione um aluno.</div>}
                                                    </div>
                                                    <div className='col-1 d-flex align-items-end mb-1'>
                                                        <Link 
                                                            to="/alunos" 
                                                            onClick={() => document.getElementById('btnCloseModal').click()}
                                                            className="btn btn-outline-primary btn-sm"
                                                            title="Cadastrar novo aluno"
                                                        >
                                                            <i className="bi bi-plus-circle d-flex align-items-center p-1"></i>
                                                        </Link>
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="inputName" className="col-12 col-form-label fw-bold required">Orientador</label>
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
                                                        {this.state.isOrientadorInvalid && <div className="invalid-feedback">Por favor, selecione um orientador.</div>}
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Subcategoria</label>
                                                        <Select
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            isClearable={true}
                                                            isSearchable={true}
                                                            name="selectSubcategoria"
                                                            options={this.state.optionsSubcategorias}
                                                            noOptionsMessage={() => "Não há subcategorias cadastradas"}
                                                            placeholder="Selecione.."
                                                            value={this.state.selectedSubcategoria}
                                                            onChange={(selectedOption) => this.setState({ selectedSubcategoria: selectedOption })}
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Palavras-Chave</label>
                                                        <CreatableSelect
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            isMulti={true}
                                                            isClearable={true}
                                                            isSearchable={true}
                                                            name="selectPalavrasChave"
                                                            options={this.state.optionsPalavrasChave}
                                                            noOptionsMessage={() => "Digite para criar uma nova palavra-chave..."}
                                                            placeholder="Cadastre ou digite para buscar..."
                                                            value={this.state.selectedPalavrasChave}
                                                            onChange={(selectedOptions) => this.setState({ selectedPalavrasChave: selectedOptions || [] })}
                                                            onCreateOption={(inputValue) => {
                                                                const newOption = {
                                                                    value: inputValue.toLowerCase().replace(/\s+/g, '-'),
                                                                    label: inputValue,
                                                                    isNew: true
                                                                };
                                                                this.setState(prevState => ({
                                                                    selectedPalavrasChave: [...(prevState.selectedPalavrasChave || []), newOption]
                                                                }));
                                                            }}
                                                        />
                                                        <small className="form-text text-muted">Digite e pressione Enter para criar uma nova palavra-chave</small>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" id="btnCloseModal" className="btn btn-secondary" data-bs-dismiss="modal" onClick={this.clearState}>Fechar</button>
                                        <button type="submit" className="btn btn-primary">Criar</button>
                                    </div>
                                </form>
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
                            <Modal.Body>Tem certeza que deseja excluir o trabalho {this.state.toDeleteItem && <span className='fw-bold'>{this.state.toDeleteItem.titulo}</span>}?</Modal.Body>
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
                            <Modal.Title>Resumo {this.state.toViewItem && <>{this.state.toViewItem.titulo}</>}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            {this.state.toViewItem && <>
                                    <div>
                                        <h5>Título:</h5>
                                        <p>{this.state.toViewItem.titulo}</p>
                                    </div>
                                    <div>
                                        <h5>Resumo:</h5>
                                        <p>{this.state.toViewItem.resumo}</p>
                                    </div>
                                    <div>
                                        <h5>Autor:</h5>
                                        <p>{this.state.toViewItem.nomeCompletoAluno}</p>
                                    </div>
                                    <div>
                                        <h5>Orientador:</h5>
                                        <p>{this.state.toViewItem.nomeCompletoOrientador}</p>
                                    </div>
                                    <div>
                                        <h5>Curso:</h5>
                                        <p>{this.state.toViewItem.nomeCurso}</p>
                                    </div>
                                    {this.state.toViewItem.idSubcategoria && (
                                        <div>
                                            <h5>Subcategoria:</h5>
                                            <p>{this.state.toViewItem.idSubcategoria}</p>
                                        </div>
                                    )}
                                    {this.state.toViewItem.palavrasChave && this.state.toViewItem.palavrasChave.length > 0 && (
                                        <div>
                                            <h5>Palavras-Chave:</h5>
                                            <p>{this.state.toViewItem.palavrasChave.map(p => p.nome).join(', ')}</p>
                                        </div>
                                    )}
                                    </>
                                }
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
                            <Modal.Title>Editar {this.state.toEditItem && <>{this.state.toEditItem.titulo}</>}</Modal.Title>
                            </Modal.Header>
                            <form onSubmit={this.submitTCCForm}>
                            <Modal.Body>
                                {this.state.toEditItem && <>
                                    <div className="modal-body">
                                        <div className="container">
                                                <div className="mb-3 row">
                                                    <div className="col-12">
                                                        <label htmlFor="inputName" className="col-4 col-form-label fw-bold required">Título</label>
                                                        <input type="text" className="form-control" name="tituloTcc" id="tituloTcc" onChange={this.handleChange} value={this.state.tituloTcc} required/>
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Resumo</label>
                                                        <textarea rows="3" className='form-control' style={{resize: "none"}} name="resumo" onChange={this.handleChange} value={this.state.resumo}></textarea>
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Curso</label>
                                                        <Select
                                                            isDisabled
                                                            className={`basic-single ${this.state.isCursoInvalid ? 'is-invalid' : ''}`}
                                                            classNamePrefix="select"
                                                            name="selectCurso"
                                                            defaultValue={defaultSelectOption}
                                                            options={this.state.optionsCursos}
                                                            value={this.state.selectedCurso}
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Aluno</label>
                                                        <Select
                                                            isDisabled
                                                            className={`basic-single ${this.state.isAlunoInvalid ? 'is-invalid' : ''}`}
                                                            classNamePrefix="select"
                                                            name="selectAluno"
                                                            defaultValue={defaultSelectOption}
                                                            options={this.state.optionsAlunos}
                                                            value={this.state.selectedAluno}
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="inputName" className="col-12 col-form-label fw-bold required">Orientador</label>
                                                        <Select
                                                            className={`basic-single ${this.state.isOrientadorInvalid ? 'is-invalid' : ''}`}
                                                            classNamePrefix="select"
                                                            defaultValue={defaultSelectOption}
                                                            isClearable={true}
                                                            isSearchable={true}
                                                            name="selectOrientador"
                                                            options={this.state.optionsOrientadores}
                                                            noOptionsMessage={() => "Não há orientadores cadastrados"}
                                                            value={this.state.selectedOrientador}
                                                            onChange={(selectedOption) => this.setState({ selectedOrientador: selectedOption, isOrientadorInvalid: !selectedOption })}
                                                        />
                                                        {this.state.isOrientadorInvalid && <div className="invalid-feedback">Por favor, selecione um orientador.</div>}
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Subcategoria</label>
                                                        <Select
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            isClearable={true}
                                                            isSearchable={true}
                                                            name="selectSubcategoria"
                                                            options={this.state.optionsSubcategorias}
                                                            noOptionsMessage={() => "Não há subcategorias cadastradas"}
                                                            placeholder="Selecione.."
                                                            value={this.state.selectedSubcategoria}
                                                            onChange={(selectedOption) => this.setState({ selectedSubcategoria: selectedOption })}
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Palavras-Chave</label>
                                                        <CreatableSelect
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            isMulti={true}
                                                            isClearable={true}
                                                            isSearchable={true}
                                                            name="selectPalavrasChave"
                                                            options={this.state.optionsPalavrasChave}
                                                            noOptionsMessage={() => "Digite para criar uma nova palavra-chave..."}
                                                            placeholder="Cadastre ou digite para buscar..."
                                                            value={this.state.selectedPalavrasChave}
                                                            onChange={(selectedOptions) => this.setState({ selectedPalavrasChave: selectedOptions || [] })}
                                                            onCreateOption={(inputValue) => {
                                                                const newOption = {
                                                                    value: inputValue.toLowerCase().replace(/\s+/g, '-'),
                                                                    label: inputValue,
                                                                    isNew: true
                                                                };
                                                                this.setState(prevState => ({
                                                                    selectedPalavrasChave: [...(prevState.selectedPalavrasChave || []), newOption]
                                                                }));
                                                            }}
                                                        />
                                                        <small className="form-text text-muted">Digite e pressione Enter para criar uma nova palavra-chave</small>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                </>
                                }
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

export default withNavigate(TCC);
