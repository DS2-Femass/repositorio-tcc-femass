import React, { Component } from 'react'
import Navbar from '../navbar/Navbar';
import '../../assets/css/tcc.css';
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { TCCService } from '../../service/TCCService';
import { CategoriaService } from '../../service/CategoriaService';
import { SubcategoriaService } from '../../service/SubcategoriaService';


//const defaultSelectOption = { value: '', label: 'Selecione...', isDisabled: true };

class MeuTCC extends Component {
  
    state = {
        tccExistente: false,
        tccOriginal: {},
        resumo: '',
        tituloTcc: '',
        curso: '',
        aluno: '',
        orientador: '',
        selectedCategoria: '',
        selectedSubcategoria: '',
        selectedKeywords: '',
        changesMade: false,
        optionsCategorias: [],
        optionsSubcategorias: [],
        optionsKeywords: []
    }

    tccService = new TCCService();
    categoriaService = new CategoriaService();
    subcategoriaService = new SubcategoriaService();

    handleChange = (event) => {
        this.setState({ changesMade: true });
        this.setState({ [event.target.name]: event.target.value });
    };

    handleChangeSelect = (option, elementName) => {
        this.setState({ changesMade: true });
        if(elementName.startsWith('selectedCategoria')) this.fillOptionsSubcategorias(option.value);
        this.setState({ [elementName]: option });
    }

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

    fillOptionsCategorias = () => {
        this.categoriaService.listAll()
            .then((response) => {
                const optionsCategorias = response.data.map(categoria => ({
                    value: categoria.id,
                    label: categoria.nomeCategoria
                }));
                this.setState({ optionsCategorias });
            });
    }

    fillOptionsSubcategorias = (categoria) => {
        this.subcategoriaService.findAllByCategoria(categoria)
            .then((response) => {
                if(response.status !== 200){ throw new Error('Erro na requisição: ' + response.status); }
                
                const optionsSubcategorias = response.data.map(subcategoria => ({
                    value: subcategoria.id,
                    label: subcategoria.nomeSubcategoria
                }));
                this.setState({ optionsSubcategorias });
                return;
            })
            .catch((error) => { });
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
            tccExistente: false,
            resumo: '',
            tituloTcc: '',
            curso: '',
            aluno: '',
            orientador: '',
            selectedCategoria: '',
            selectedSubcategoria: '',
            selectedKeywords: '',
            changesMade: false,
            optionsCategorias: [],
            optionsSubcategorias: [],
            optionsKeywords: []
        });
    }

    revertFields = () => {
        this.setState({
            tituloTcc: this.state.tccOriginal.titulo,
            resumo: this.state.tccOriginal.resumo || '',
            selectedCategoria: this.state.tccOriginal.categoria,
            selectedSubcategoria: this.state.tccOriginal.subcategoria,
            selectedKeywords: this.state.tccOriginal.keywords,
            changesMade: false
        });
    }

    submitTCCForm = (event) => {
        event.preventDefault();
        
        let data = {
            "titulo": this.state.tituloTcc,
            "resumo": this.state.resumo,
            "id": this.state.tccOriginal.id,
            "idAluno": this.state.tccOriginal.idAluno,
            "idOrientador": this.state.tccOriginal.idOrientador,
            "idCurso": this.state.tccOriginal.idCurso
        }

        if(this.state.selectedCategoria && this.state.selectedCategoria.value) {data.categoria = this.state.selectedCategoria.value;}
        if(this.state.selectedSubcategoria && this.state.selectedSubcategoria.value) {data.subcategoria = this.state.selectedSubcategoria.value;}
        if(this.state.selectedKeywords && this.state.selectedKeywords.length > 0) {data.keywords = this.state.selectedKeywords.map(keyword => keyword.value);}

        this.tccService.update(this.state.tccOriginal.id, data)
        .then(response => {
            if(response.status !== 200){ throw new Error('Erro na requisição: ' + response.status); }
            toast.success('TCC atualizado!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            this.clearState();
            this.getMyTcc();
        })
        .catch(error => {
            toast.error('Erro ao salvar', {
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

    getMyTcc = () => {
        //Método ainda não implementado no backend  

        this.tccService.getMyTcc()
            .then((response) => {
                this.setState({
                    tccExistente: true,
                    tccOriginal: response.data,
                    tituloTcc: response.data.titulo,
                    resumo: response.data.resumo || '',
                    curso: response.data.nomeCurso,
                    aluno: response.data.nomeCompletoAluno,
                    orientador: response.data.nomeCompletoOrientador,
                    selectedCategoria: response.data.categoria,
                    selectedSubcategoria: response.data.subcategoria,
                    keywords: response.data.keywords
                });
            })
            .catch((error) => {
                if(error.response.status === 404) {
                    return;
                }
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

    componentDidMount() {
        this.getMyTcc();
        this.fillOptionsCategorias();
    }

    render() {

        let document = 'null';

        if(this.state.tccExistente) {
            document = <>
                <div className="document-container">
                    <form onSubmit={this.submitTCCForm}>
                        <div className="mb-3 row">
                            <div className='row mb-4'>
                                <div className="col-12">
                                    <label htmlFor="inputTitle" className="form-label fw-bold">Título</label>
                                    <input type="text" id="inputTitle" className="form-control" name="tituloTcc" onChange={this.handleChange} value={this.state.tituloTcc} required/>
                                </div>
                            </div>
                            <div className='row mb-4'>
                                <div className="col-12">
                                    <label htmlFor="inputOverview" className="form-label fw-bold">Resumo</label>
                                    <textarea rows="5" id="inputOverview" className='form-control' style={{resize: "none"}} name="resumo" onChange={this.handleChange} value={this.state.resumo}></textarea>
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className="col-12">
                                    <label htmlFor="inputCourse" className="form-label fw-bold">Curso</label>
                                    <input type="text" id="inputCourse" value={this.state.curso} disabled className='form-control' />
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className="col-sm-12 col-md-6 mb-sm-3 mb-md-0">
                                    <label htmlFor="inputStudent" className="form-label fw-bold">Autor</label>
                                    <input type="text" id="inputStudent" value={this.state.aluno} className="form-control" disabled />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <label htmlFor="inputOrientador" className="form-label fw-bold">Orientador</label>
                                    <input type="text" id="inputOrientador" value={this.state.orientador} className="form-control" disabled />
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className="col-sm-12 col-md-6 mb-sm-3 mb-md-0">
                                    <label htmlFor="selectCategoria" className="form-label fw-bold">Categoria</label>
                                    <Select
                                        className={`basic-single`}
                                        classNamePrefix="select"
                                        name="selectedCategoria"
                                        id="selectCategoria"
                                        options={this.state.optionsCategorias}
                                        value={this.state.selectedCategoria}
                                        onChange={(selectedOption, actionMeta) => this.handleChangeSelect(selectedOption, actionMeta.name)}
                                        noOptionsMessage={() => 'Nenhuma opção encontrada'}
                                        placeholder="Selecione..."
                                    />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <label htmlFor="selectSubcategoria" className="form-label fw-bold">Subcategoria</label>
                                    <Select
                                        className={`basic-single`}
                                        classNamePrefix="select"
                                        name="selectedSubcategoria"
                                        id="selectSubcategoria"
                                        options={this.state.optionsSubcategorias}
                                        value={this.state.selectedSubcategoria}
                                        onChange={(selectedOption, actionMeta) => this.handleChangeSelect(selectedOption, actionMeta.name)}
                                        isDisabled={!this.state.selectedCategoria}
                                        noOptionsMessage={() => 'Nenhuma opção encontrada'}
                                        placeholder={`${!this.state.selectedCategoria ? 'Selecione uma categoria...' : 'Selecione...'}`}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-12">
                                    <label htmlFor="selectKeywords" className="form-label fw-bold">Palavras-Chave</label>
                                    <CreatableSelect
                                        isMulti
                                        className={`basic-single`}
                                        classNamePrefix="select"
                                        name="selectedKeywords"
                                        id="selectKeywords"
                                        options={this.state.optionsKeywords}
                                        value={this.state.selectedKeywords}
                                        onChange={(selectedOption, actionMeta) => this.handleChangeSelect(selectedOption, actionMeta.name)}
                                        noOptionsMessage={() => 'Nenhuma opção encontrada'}
                                        placeholder="Selecione..."
                                    />
                                </div>
                            </div>
                        </div>
                        {this.state.changesMade &&
                            <div className="row mt-4 actions" >
                                <div className="col-12 d-flex justify-content-end gap-3">
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={this.revertFields} 
                                        className='px-4'
                                    >
                                        <i className="bi bi-arrow-counterclockwise me-2"></i>
                                        Reverter
                                    </Button>
                                    <Button 
                                        variant="success" 
                                        type='submit'
                                        className='px-4'
                                    >
                                        Salvar
                                    </Button>
                                </div>
                            </div>
                        }
                    </form>

                </div>
            </>
        } else {
            document = <>
                <div className="text-center p-5 bg-white rounded shadow-sm col-12 col-md-8 col-lg-6 m-auto">
                    <div className="mb-4">
                        <i className="bi bi-journal-text display-1 text-info"></i>
                    </div>
                    <h4 className="mb-3">Nenhum TCC Registrado</h4>
                    <p className="text-muted mb-4">
                        Parece que você ainda não possui um TCC registrado no sistema. 
                        Para começar seu trabalho, entre em contato com o professor da disciplina 
                        para realizar o cadastro do seu TCC.
                    </p>
                    <hr className="my-4"/>
                    <div className="text-muted small">
                        <i className="bi bi-info-circle me-2"></i>
                        Dúvidas? Consulte a coordenação do seu curso para mais informações.
                    </div>
                </div>
            </>
        }

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
                        <h1 className='display-5 fw-bold mb-4 tittle tittleAfter'>Meu TCC</h1>
                    </div>
                </div>
                {/* TODO: Remover o botão */}
                {/* <button title={"Apenas para teste"} onClick={() => this.setState({tccExistente: !this.state.tccExistente})}></button> */}

                <div className='px-4'>
                    {document}
                </div>
            </motion.div>

        </div>
        )
  }
}

export default MeuTCC;
