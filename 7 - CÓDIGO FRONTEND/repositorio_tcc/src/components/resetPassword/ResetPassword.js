import React, { Component } from 'react'
import logoFemass from './../../assets/images/logo-femass.png';
import logo from './../../assets/images/Logo TCCFLOW.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for default styles
import { useNavigate } from 'react-router-dom';

function withNavigate(Component) {
    return (props) => {
      const navigate = useNavigate();
      return <Component {...props} navigate={navigate} />;
    };
  }

class ResetPassword extends Component {
    state = {
        password: '',
        passwordConfirm: '',
    }


    validatePassword = () => {
        if(this.state.password !== this.state.passwordConfirm) {
          document.getElementById('passwordConfirm').setCustomValidity('As senhas não conferem');
          return false;
        } else {
          document.getElementById('passwordConfirm').setCustomValidity('');
          return true;
        }
      }

    handleChange = (event) => {
        //definição de funções callbacks, caso necessárias
        let callback = null;
        if(event.target.name.startsWith('password')) callback = this.validatePassword;

        this.setState({ [event.target.name]: event.target.value }, callback);
    };

    clearState = () => {
        this.setState({
            password: '',
            passwordConfirm: '',
            token: '',
            email: ''
        });
    }

    resetPassword = (event) => {
        event.preventDefault();
        // Adicione a lógica de envio do formulário aqui

        if(!this.validatePassword()) {
            toast.warning('Verifique as senhas', {
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
        
        if(!this.state.token) {
            toast.warning('Solicitação Inválida', {
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

        let url = window.server + "/auth/reset-password/" + this.state.token;

        const data = {
            "newPassword": this.state.password,
            "confirmPassword": this.state.passwordConfirm,
        };
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                return response.json()
                    .then(data => {
                        sessionStorage.setItem('token', data.token);
                        toast.success('Senha alterada com sucesso!', {
                            position: "top-right",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          });
                        setTimeout(() => {
                            this.props.navigate('/');
                        }, 2000);
                    });
            } else{
                toast.error('Erro ao alterar senha.', {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                  return;
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
    };

    componentDidMount() {
        const queryParams = new URLSearchParams(this.props.location.search);
        this.setState({token: queryParams.get('token'), email: queryParams.get('email')});
    }
  
    render() {
    return (
        <>
        <ToastContainer />
        <div className='container-fluid d-flex flex-column justify-content-between' style={{'minHeight': '100vh'}}>
            <div className='row justify-content-center' style={{'marginTop': '10vh'}}> 
                <div className='col-10 col-md-6 col-lg-4 text-center'>
                    <img src={logoFemass} className="img-fluid" style={{'maxWidth': '300px'}} alt="Logo da faculdade"></img>
                </div>
            </div>  
            <div className='row mt-5 justify-content-center'>
                <div className='col-10 col-md-6 col-lg-3'>
                    <div className='bg-white border rounded p-4'>
                        <div className="mb-2 row">
                        <h1 className='fs-4 text-decoration-underline'>Redefinir Senha</h1>
                        </div>
                        <div className="mb-4 row justify-content-center">
                            <div className="mb-3">
                                <label htmlFor="" className="form-label">Nova senha:</label>
                                <input type="password" className="form-control" name="password" id="password" placeholder='Digite sua nova senha' value={this.state.password} onChange={this.handleChange} required
                                />
                            </div>
                            <div>
                                <label htmlFor="" className="form-label">Confirmar senha:</label>
                                <input type="password" className="form-control" name="passwordConfirm" id="passwordConfirm" placeholder='Digite novamente' value={this.state.passwordConfirm} onChange={this.handleChange} required
                                />
                                <div className="invalid-feedback">As senhas não combinam</div>
                            </div>
                        </div>
                        <div className='mb-1 row justify-content-center'>
                            <div className='col-12 d-grid'>
                                <button className='btn btn-custom' onClick={this.resetPassword}>Confirmar Mudança</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            <div className='row justify-content-end mt-auto'>
            <div className='col-6 col-md-4 text-end'>
                <img src={logo} className="img-fluid mb-3 me-2" style={{'maxWidth': '180px'}} alt="Logo da faculdade"></img>
            </div> 
            </div>
        </div>
      </>
    )
  }
}

export default withNavigate(ResetPassword);