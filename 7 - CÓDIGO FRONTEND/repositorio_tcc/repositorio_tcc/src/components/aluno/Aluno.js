import React, { Component } from 'react'
import Navbar from '../navbar/Navbar';
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { AlunoService } from '../../service/AlunoService';
import { TranslationService } from '../../service/TranslationService';

class Aluno extends Component {
  
    state = {
        users: [],
        filteredData: [],
        checkboxChangePassword: true,
        checkboxNotifyEmail: true,
        completeName: '',
        login: '',
        email: '',
        password: '',
        passwordConfirm: '',
        filterText: '',
        toDeleteItem: null,
        toViewItem: null,
        toEditItem: null,
        showModalDeletion: false,
        showModalEdit: false,
        showModalRegistration: false,
        showModalView: false,
        showModalUpload: false,
        nomeCompleto: null,
        telefone: null,
        matricula: null,
        uploadAlunos: null
    }

    columns = [
        {
          name: 'Nome',
          selector: user => user.nomeCompleto,
          sortable: true,
          width: '40%'
        },
        {
            name: 'Matricula',
            selector: user => user.matricula,
            sortable: true,
             width: '40%'
          },
        {
            name: 'Ações',
            cell: user => <>
                <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Visualizar Instituto" onClick={() => this.beginView(user)}><i className="bi bi-eye"></i></button>
                <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Editar Instituto" onClick={() => this.beginEdit(user)}><i className="bi bi-pencil"></i></button>
                <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Excluir selecionado" onClick={() => this.beginDeletion(user)}><i className="bi bi-trash"></i></button>
            </>,
             width: '20%'
        }
    ];

    tableStyle = {
        headCells: {
            style: {
            backgroundColor: 'black',  // Cor de fundo preta
            color: 'white',            // Cor do texto branca para contraste
            fontWeight: 'bold',        // Deixar o texto em negrito
            fontSize: '1.5em',         // Tamanho da fonte
            },
        },
    };

    alunoService = new AlunoService();

    handleCheckboxChange = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    applyFilters = () => {
        this.setState((prevState) => ({
            filteredData: prevState.users.filter((user) => {
                return (
                    prevState.filterText === '' || user.nomeCompleto.toLowerCase().includes(prevState.filterText.toLowerCase()) ||
                    user.matricula.toLowerCase().includes(prevState.filterText.toLowerCase()) ||
                    user.email.toLowerCase().includes(prevState.filterText.toLowerCase()) ||
                    user.telefone.toLowerCase().includes(prevState.filterText.toLowerCase())
                );
            })
        }));
    }

    validateFile = (file) => {
        if(!file) return false;
        const validTypes = [
            'text/csv', 
            'application/vnd.ms-excel',
            'application/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/excel'
        ];
        if(!validTypes.includes(file.type)) {
            return false;
        }
        return true;
    }

    handleChange = (event) => {
        if(event.target.name.startsWith('upload')) {

            this.setState({ [event.target.name]: null });
            if(!this.validateFile(event.target.files[0])){
                event.target.focus();
                event.target.classList.add('is-invalid');
                event.target.addEventListener('input', function(){
                    event.target.classList.remove('is-invalid');
                });
                return;
            }
            this.setState({ [event.target.name]: event.target.files[0] });
            return;
        }
        if(event.target.name.startsWith('filter')) this.applyFilters();
        this.setState({ [event.target.name]: event.target.value });
    };

    fillList = () => {
        const url = window.server + "/alunos";

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url,requestOptions)
            .then((response) => response.json())
                .then((data) => this.setState({users: data, filteredData: data}));

    }

    beginRegistration = () => {
        this.setState({ showModalRegistration: true });
    }
    
    beginUpload = () => {
        this.setState({ showModalUpload: true });
    }

    beginEdit = (aluno) => { 

        const url = window.server + "/alunos/" + aluno.id;

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url,requestOptions)
            .then((response) => {
                if(response.ok) {
                    return response.json();
                } else{
                    throw new Error('Erro na requisição: ' + response.status);
                }
            }).then((data) => { 
                if (data.resumo === null) data.resumo = '';
                this.setState({ 
                    toEditItem: data,
                    showModalEdit: true,
                    nomeCompleto: data.nomeCompleto,
                    email: data.email,
                    telefone: data.telefone,
                
                });
            })
            .catch((error) => {
            });
    }

    validatePassword = () => {
        if(!this.state.password || !this.state.passwordConfirm) return false;
        const passwordConfirmElement = document.getElementById('passwordConfirm');
        if(this.state.password !== this.state.passwordConfirm) {
          passwordConfirmElement.setCustomValidity('As senhas não conferem');
          passwordConfirmElement.classList.add('is-invalid');
        } else {
            passwordConfirmElement.setCustomValidity('');
            passwordConfirmElement.classList.remove('is-invalid');
        }

        return passwordConfirmElement.checkValidity();
    }

    validateForm = () => {
        return true
    }

    clearState = () => {
        this.setState({
            nomeCompleto: "",
            email: "",
            telefone: "",
            matricula: "",
            toDeleteItem: null,
            toViewItem: null,
            toEditItem: null,
        });
    }

    closeModal = (operationName) => {
        this.clearState();
        this.setState({ ['showModal' + operationName]: false, ['to' + operationName + 'Item']: null });
    }

    registerForm = (event) => {

        event.preventDefault();
        
        if(!this.validateForm()) {
            toast.warning('Campos preenchidos inválidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        let url = window.server + "/alunos";

        let data = {
            "nomeCompleto": this.state.nomeCompleto,
            "matricula": this.state.matricula,
            "email": this.state.email,
            "telefone": this.state.telefone,
        };

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        };

        if(this.state.toEditItem){
            requestOptions.method = 'PUT';
            url+= "/" + this.state.toEditItem.id;
        }

        fetch(url, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro na requisição: ' + response.status);
            }
        })
        .then(data => {
            if(this.state.toEditItem){
                this.setState({showModalEdit: false})
                toast.success('Usuário atualizado!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
            } else{
                this.closeModal('Registration')
                toast.success('Usuário criado!', {
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
            this.clearState();
        });
    }
    
    delete = () => {

        const url = window.server + "/alunos/" + this.state.toDeleteItem.id;

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url,requestOptions)
            .then((response) => {
                if(response.ok) {
                    this.fillList();
                    this.setState({ showModalDeletion: false });
                    toast.success('Aluno excluído!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                }
                else{
                    toast.error('Não foi possível excluir', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                    throw new Error('Erro na requisição: ' + response.status);
                }
            });
    }

    beginDeletion = (alunos) => {
        this.setState({ toDeleteItem: alunos, showModalDeletion: true });
	}

    beginView = (aluno) => { 

        const url = window.server + "/alunos/" + aluno.id;

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url,requestOptions)
            .then((response) => {
                if(response.ok) {
                    return response.json();
                } else{
                    throw new Error('Erro na requisição: ' + response.status);
                }
            }).then((data) => {
                this.setState({ toViewItem: data, showModalView: true });
            })
            .catch((error) => {
            });
    }

    uploadFile = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', this.state.uploadAlunos);

        this.alunoService.importFromFile(formData)
            .then((response) => {
                if(response.status === 200) {
                    this.setState({ showModalUpload: false });
                    toast.success('Arquivo carregado com sucesso! ' + response.data + " novo(s) registro(s) inserido(s).", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                    this.fillList();
                } 
            }).catch((error) => {
                let errorMessage = 'Servidor indisponível';
                if(error.response) {errorMessage = TranslationService.translate(error.response.data.message);}
                toast.error('Erro ao carregar arquivo: ' + errorMessage, {
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
        this.fillList();
    }

    render() {
        return (
        <div>
            <Navbar />
            <ToastContainer />

            <div className='page-content'>
                <div className="col-12 mb-4 mt-4">
                    <h1 className='display-5 fw-bold mb-4 tittle tittleAfter'>Alunos</h1>
                </div>
                

                <div className='col-sm-10 col-md-6 col-lg-5 col-xl-4 ms-5'>
                    <div className="card mx-3" style={{ maxWidth: '500px' }}>
                        <div className="card-body">
                            <button 
                                type="button" 
                                className="btn btn-success fw-bold w-50 me-2" 
                                style={{ width: '45%' }} 
                                onClick={this.beginRegistration}
                            >
                                <i className="bi bi-plus-circle-dotted fs-6 me-2"></i>Incluir
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-primary fw-bold"
                                style={{ width: '45%' }} 
                                onClick={this.beginUpload}
                            >
                                <i className="bi bi-cloud-upload"></i> Carregar arquivo
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="card mx-5 p-3">
                    <div className="card-body">
                        <div className="table-responsive border-rounded">
                            
                            <DataTable
                                columns={this.columns}
                                data={this.state.filteredData}
                                pagination
                                customStyles={this.tableStyle}
                                responsive
                                fixedHeader
                                noDataComponent="Nenhum usuário encontrado"
                                subHeader
                                subHeaderComponent={
                                    <div className='form-group'>
                                        <input id='filterTextTitulo' type="text" className='form-control' placeholder="Buscar..." 
                                        name='filterText'
                                        value={this.state.filterText}
                                        onChange={this.handleChange}
                                        />
                                    </div>
                                }
                                
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='modals'>
                <Modal show={this.state.showModalRegistration} onHide={() => this.closeModal('Registration')} centered>
                    <Modal.Header closeButton className='bg-dark text-white' closeVariant='white'>
                        <Modal.Title>Novo Aluno</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.registerForm}>
                    <Modal.Body>
                            <div className="mb-3 row justify-content-center">  
                                <div className='col-12'>
                                <label htmlFor="nomeCompleto" className='required'>Nome Completo</label>
                                <input type="text" className="form-control" id="nomeCompleto" name="nomeCompleto" required onChange={this.handleChange}></input>
                                </div>
                            </div>
                            <div className="mb-3 row justify-content-center">
                                <div className='col-12'>
                                    <label htmlFor="matricula" className='required'>Matrícula</label>
                                    <input type="text" className="form-control" id="matricula" name="matricula" required maxLength={11} onChange={this.handleChange}></input>
                                </div>
                            </div>
                            <div className="mb-3 row justify-content-center">  
                                <div className='col-12'>
                                <label htmlFor="email" className='required'>E-mail</label>
                                <input type="email" className="form-control" id="email" name="email" required placeholder="email@email.com" onChange={this.handleChange}></input>
                                </div>
                            </div>
                            <div className="mb-4 row justify-content-center">
                                <div className='col-12'>
                                <label htmlFor="password" className="col-form-label required">Telefone</label>
                                <input type="text" className="form-control" id="telefone" name="telefone" required onChange={this.handleChange}></input>
                                </div>
                            </div>     
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.closeModal('Registration')}>
                            Cancelar
                        </Button>
                        <Button variant="success" type='submit'>
                            Criar
                        </Button>
                    </Modal.Footer>
                    </form>
                </Modal>

                <Modal show={this.state.showModalDeletion} onHide={() => this.closeModal('Deletion')} centered>
                    <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Tem certeza que deseja excluir o aluno {this.state.toDeleteItem && <span className='fw-bold'>{this.state.toDeleteItem.nome}</span>}?</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.closeModal('Deletion')}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={this.delete}>
                        Confirmar
                    </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showModalView} onHide={() => this.closeModal('View')} centered>
                    <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                    <Modal.Title>Aluno {this.state.toViewItem && <>{this.state.toViewItem.titulo}</>}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {this.state.toViewItem && <>
                            <div>
                                <h5>Nome:</h5>
                                <p>{this.state.toViewItem.nomeCompleto}</p>
                            </div>
                            <div>
                                <h5>Matrícula:</h5>
                                <p>{this.state.toViewItem.matricula}</p>
                            </div>
                            <div>
                                <h5>Email:</h5>
                                <p>{this.state.toViewItem.email}</p>
                            </div>
                            <div>
                                <h5>Telefone:</h5>
                                <p>{this.state.toViewItem.telefone}</p>
                            </div>
                            </>
                    }
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.closeModal('View')}>
                        Fechar
                    </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showModalEdit} onHide={() => this.closeModal('Edit')} centered size='xl'>
                    <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                    <Modal.Title>Editar {this.state.toEditItem && <>{this.state.toEditItem.titulo}</>}</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.registerForm}>
                    <Modal.Body>
                        {this.state.toEditItem && <>
                            <div className="modal-body">
                                <div className="container">
                                        <div className="mb-3 row">
                                            <div className="col-12">
                                                <label htmlFor="inputName" className="col-4 col-form-label fw-bold required">Nome</label>
                                                <input type="text" className="form-control" name="nomeCompleto" id="nomeCompleto" onChange={this.handleChange} value={this.state.nomeCompleto} required/>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Email</label>
                                                <input type="text" className="form-control" name="email" onChange={this.handleChange} value={this.state.email}/>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Telefone</label>
                                                <input type="text" className="form-control" name="telefone" onChange={this.handleChange} value={this.state.telefone}/>
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

                <Modal show={this.state.showModalUpload} onHide={() => this.closeModal('Upload')} centered size='md'> 
                    <Modal.Header closeButton className='bg-dark text-white' closeVariant='white'>
                        <Modal.Title>Importação de Alunos</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.uploadFile}>
                    <Modal.Body>
                            <div className="mb-3 row justify-content-center">  
                                <div className='col-12'>
                                    <label htmlFor="upload-alunos" className='form-label'>Carregue o arquivo</label>
                                    <input type="file" id="upload-alunos" className='form-control' name="uploadAlunos" accept=".csv,.xls,.xlsx" required onChange={this.handleChange}></input>
                                    <small className="form-text text-muted">Formatos aceitos: CSV, XLS, XLSX</small>
                                </div>
                            </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.closeModal('Upload')}>
                            Cancelar
                        </Button>
                        <Button variant="success" type='submit' disabled={!this.state.uploadAlunos}>
                            Carregar
                        </Button>
                    </Modal.Footer>
                    </form>
                </Modal>
                
            </div>
        </div>
        )
  }
}

export default Aluno;
