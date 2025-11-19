import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Modal } from 'react-bootstrap';
import Navbar from '../navbar/Navbar';

function withNavigate(Component) {
    return (props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class Orientador extends Component {

    state = {
        listOrientador: [],
        showModalDeletion: false,
        nomeCompleto: '',
        cpf: '',
        telefone: '',
        email:'',
        showModalUpload: false
    }

    resgister = (event) => {
        event.preventDefault();

        var url = window.server + "/orientadores";

        const data = {
            "nomeCompleto": this.state.nomeCompleto,
            "cpf": this.state.cpf.replace(/[^\d]/g, ''),
            "telefone": this.state.telefone.replace(/[^\d]/g, ''),
            "email": this.state.email
        };
        const token = sessionStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch(url, requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    toast.success('Orientador criado!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        
                    });
                    this.clearState()
                    setTimeout(() => {
                        this.fillList();
                    }, 500);
                    return;
                } else {
                    toast.error('Erro ao criar', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    throw new Error('Falha na requisição: ' + response.status);
                }
            })
            .catch(e => { console.error(e) })
    }

    // carregar os dados na lista

    fillList = () => {
        const url = window.server + "/orientadores";

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => this.setState({ listOrientador: data, filteredItems: data }));
        
    }

    beginView = () => {
        const url = window.server + "/orientadores/" + this.setState.listOrientador.id;

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erro na requisição: ' + response.status);
                }
            }).then((data) => {
                this.setState({ toViewItem: data, showModalView: true });
            })
            .catch((error) => {
            });
    }

    componentDidMount() {
        this.fillList();
    }

    // Deletar orientador

    beginDeletion = (listOrientador) => {
        this.setState({ toDeleteItem: listOrientador, showModalDeletion: true });
    }

    delete = () => {
        const url = window.server + "/orientadores/" + this.state.toDeleteItem.id;

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url, requestOptions)
            .then((response) => {
                if (response.ok) {
                    this.fillList();
                    this.setState({ showModalDeletion: false });
                    toast.success('Orientador excluído!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                else {
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

    // Edição
    beginEdit = (listOrientador) => {

        const url = window.server + "/orientadores/" + listOrientador.id;

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erro na requisição: ' + response.status);
                }
            }).then((data) => {
                if (data.nomeCompleto === null) data.nomeCompleto = '';
                this.setState({
                    toEditItem: data,
                    showModalEdit: true,
                    nomeCompleto: data.nomeCompleto,
                    cpf:data.cpf,
                    telefone:data.telefone,
                    email:data.email
                });
            })
            .catch((error) => {
            });
    }

    submitOrientadorForm = (event) => {
        event.preventDefault();

        let url = window.server + "/orientadores";

        const token = sessionStorage.getItem('token');

        let data = {
            "nomeCompleto": this.state.nomeCompleto,
            "cpf": this.state.cpf.replace(/[^\d]/g, ''),
            "telefone": this.state.telefone.replace(/[^\d]/g, ''),
            "email": this.state.email
        }

        if (this.state.resumo) {
            data.resumo = this.state.resumo;
        }

        let requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        if (this.state.toEditItem) {
            requestOptions.method = 'PUT';
            url += "/" + this.state.toEditItem.id;
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
                if (this.state.toEditItem) {
                    this.setState({ showModalEdit: false })
                    toast.success('Orientador atualizado!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
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

    closeModal = (operationName) => {
        this.clearState();
        this.setState({ ['showModal' + operationName]: false, ['to' + operationName + 'Item']: null });
    }

    handleChange = (event) => {
        if (event.target.name.startsWith('filter')) this.applyFilters();
        this.setState({ [event.target.name]: event.target.value });
    };

    clearState = () => {
        this.setState({
            nomeCompleto: "",
            cpf: "",
            telefone: "",
            email: ""
        });
    }


    render() {
        return (
            <div>
                <Navbar />
                    <ToastContainer />
                <div className='page-content'>
                    <div className="col-12 mb-4 mt-4">
                        <h1 className='display-5 fw-bold mb-4 tittle tittleAfter'>Orientadores</h1>
                    </div>
                    <div className='mt-5 mb-3 container-fluid d-flex flex-column justify-content-between'>
                        <div className='row justify-content-center'>
                            <div className='col-10 col-md-6 col-lg-5 col-xl-4'>
                                <div className='bg-white border rounded p-4'>
                                    <form onSubmit={this.resgister}>
                                        <div><h3 >Cadastro de Orientador</h3></div>
                                        <div className="mb-3 justify-content-center">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Nome Completo</label>
                                            <input type="text" className="form-control" name='nomeCompleto' id="nomeCompleto" onChange={this.handleChange} value={this.state.nomeCompleto} required />
                                        </div>
                                        <div className="mb-3 justify-content-center">
                                            <label htmlFor="InputCPF" className="form-label">CPF</label>
                                            <InputMask mask="999.999.999-99"
                                                type="text" className="form-control" name='cpf' id="cpf" onChange={this.handleChange} value={this.state.cpf} required >
                                                {(inputProps) => <input {...inputProps} type="text" />}
                                            </InputMask>
                                        </div>
                                        <div className="mb-3 justify-content-center">
                                            <label htmlFor="InputTelefone" className="form-label">telefone</label>
                                            <InputMask mask="(99)9999-99999"
                                                type="text" className="form-control" name='telefone' id="telefone" onChange={this.handleChange} value={this.state.telefone} required >
                                                {(inputProps) => <input {...inputProps} type="text" />}
                                            </InputMask>
                                        </div>
                                        <div className="mb-3 justify-content-center">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                                            <input type="email" className="form-control" name='email' id="email" required placeholder="email@email.com" onChange={this.handleChange} value={this.state.email} />
                                        </div>
                                        <div className="mb-3 justify-content-center">
                                            <button className="btn btn-dark" type='submit'>Criar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Tabela de orientadores cadastrado */}
                    <h4 className="text-center">Lista de Orientadores</h4>
                    <div className="container">
                        <table className="table table-striped table-hover">
                            <tbody>
                                <tr>
                                    <td className="text-center">Nome</td>
                                    <td className="text-center">Email</td>
                                </tr>
                                {this.state.listOrientador && this.state.listOrientador.length > 0 ? this.state.listOrientador.map(data => (
                                    <tr key={this.state.listOrientador.id}>
                                        <td className="text-center">{data.nomeCompleto}</td>
                                        <td className="text-center">{data.email}</td>
                                        <button className="btn btn-danger" onClick={() => this.beginDeletion(data)} >Deletar</button>
                                        <button className="btn btn-warning" onClick={() => this.beginEdit(data)}>editar</button>
                                    </tr>
                                )) : <tr><td colSpan={4} className='text-center fw-bold'>Nenhum orientador encontrado</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    {/* Modal de exclusão */}

                    <Modal show={this.state.showModalDeletion} onHide={() => this.setState({ toDeleteItem: null, showModalDeletion: false })} centered>
                        <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                            <Modal.Title>Confirmar Exclusão</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Tem certeza que deseja excluir o Orientador {this.state.toDeleteItem && <span className='fw-bold'>{this.state.toDeleteItem.nomeCompleto}</span>}?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.setState({ toDeleteItem: null, showModalDeletion: false })}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={this.delete}>
                                Confirmar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal de Edição */}

                    <Modal show={this.state.showModalEdit} onHide={() => this.closeModal('Edit')} centered size='xl'>
                        <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                            <Modal.Title>Editar {this.state.toEditItem && this.state.toEditItem.titulo}</Modal.Title>
                        </Modal.Header>
                        <form onSubmit={this.submitOrientadorForm}>
                            <Modal.Body>
                                {this.state.toEditItem && <>
                                    <div className="modal-body">
                                        <div className="container">
                                            <div className="mb-3 row">
                                                <div className="col-12">
                                                    <label htmlFor="inputName" className="col-4 col-form-label fw-bold required">Nome Completo</label>
                                                    <input type="text" className="form-control" name="nomeCompleto" id="nomeCompleto" onChange={this.handleChange} value={this.state.nomeCompleto} required />
                                                </div>
                                                <div className="col-12">
                                                    <label htmlFor="inputName" className="col-12 col-form-label fw-bold">CPF</label>
                                                    <InputMask mask="999.999.999-99"
                                                        type="text" className="form-control" name="cpf" id="cpf" onChange={this.handleChange} value={this.state.cpf} />
                                                </div>
                                                <div className="col-12">
                                                    <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Telefone</label>
                                                    <InputMask mask="(99)9999-99999"
                                                        type="text" className="form-control" name="telefone" id="telefone" onChange={this.handleChange} value={this.state.telefone} />
                                                </div>
                                                <div className="col-12">
                                                    <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Email</label>
                                                    <input type="text" className="form-control" name="email" id="email" onChange={this.handleChange} value={this.state.email}/>
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

                </div>
            </div>
        )
    }
}

export default withNavigate(Orientador);