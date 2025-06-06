import React, { Component } from 'react'
import logoFemass from './../../assets/images/logo-femass.png';
import logo from './../../assets/images/Logo TCCFLOW.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function withNavigate(Component) {
    return (props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class FirstAccess extends Component {
    state = {
        identifier: ''
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    clearState = () => {
        this.setState({
            identifier: ''
        });
    }

    firstAccess = (event) => {
        event.preventDefault();

        if (!this.state.identifier) {
            toast.warning('Por favor, informe sua matrícula ou CPF.', {
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

        const url = window.server + "/auth/first-access-request";

        const data = {
            identifier: this.state.identifier
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    toast.success('Solicitação enviada com sucesso! Verifique seu e-mail.', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setTimeout(() => {
                        this.props.navigate('/');
                    }, 2500);
                } else {
                    toast.error('Erro ao enviar solicitação.', {
                        position: "top-right",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
            .catch(error => {
                toast.error('Algo deu errado.', {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    }

    render() {
        return (
            <>
                <ToastContainer />
                <div className='container-fluid d-flex flex-column justify-content-between' style={{ minHeight: '100vh' }}>
                    <div className='row justify-content-center' style={{ marginTop: '10vh' }}>
                        <div className='col-10 col-md-6 col-lg-4 text-center'>
                            <img src={logoFemass} className="img-fluid" style={{ maxWidth: '300px' }} alt="Logo da faculdade" />
                        </div>
                    </div>

                    <div className='row mt-5 justify-content-center'>
                        <div className='col-10 col-md-6 col-lg-3'>
                            <div className='bg-white border rounded p-4'>
                                <div className="mb-2 row">
                                    <h1 className='fs-4 text-decoration-underline'>Primeiro Acesso</h1>
                                </div>
                                <div className="mb-3 row">
                                    <p className='text-muted'>
                                        Caso você seja <strong>aluno</strong>, entre com sua <strong>matrícula</strong>.<br />
                                        Caso seja <strong>professor</strong>, entre com seu <strong>CPF</strong>.
                                    </p>
                                </div>
                                <div className="mb-4 row justify-content-center">
                                    <div className="mb-3">
                                        <label htmlFor="identifier" className="form-label">Matrícula ou CPF:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="identifier"
                                            id="identifier"
                                            placeholder='Informe sua matrícula ou CPF'
                                            value={this.state.identifier}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='mb-1 row justify-content-center'>
                                    <div className='col-12 d-grid'>
                                        <button className='btn btn-custom' onClick={this.firstAccess}>Enviar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row justify-content-end mt-auto'>
                        <div className='col-6 col-md-4 text-end'>
                            <img src={logo} className="img-fluid mb-3 me-2" style={{ maxWidth: '180px' }} alt="Logo do sistema" />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withNavigate(FirstAccess);
