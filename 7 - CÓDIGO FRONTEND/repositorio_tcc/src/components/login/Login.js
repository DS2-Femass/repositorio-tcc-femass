import React, { Component } from 'react'
import logoFemass from './../../assets/images/logo-femass.png';
import logo from './../../assets/images/Logo TCCFLOW.png';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for default styles

function withNavigate(Component) {
  return (props) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class Login extends Component {

  state = {
    login: '',
    password: '',
    confPassword: '',
    nomeCompleto: '',
    resetEmail: '',
    box: 'login'
  }

  txtLogin_change = (event) => {
    this.setState({ login: event.target.value });
  }

  txtPassword_change = (event) => {
    this.setState({ password: event.target.value });
  }

  handleChange = (event) => {
    if (event.target.name.startsWith('filter')) this.applyFilters();
    this.setState({ [event.target.name]: event.target.value });
  };

  login = async (event) => {

    event.preventDefault();

    const formElement = event.target; // Obter o formElement a partir do event

    // Validar o formulário
    if (!formElement.checkValidity()) {
        formElement.reportValidity(); // Exibir mensagens de erro se o formulário não for válido
        return;
    }

    var url = window.server + "/auth/login"

    //verificar se algum dos campos não foi preenchido
    if (!this.state.login || !this.state.password) {
      toast.warning('Preencha todos os campos para prosseguir.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const data = {
      "password": this.state.password
    }

    if (this.state.login.includes('@')) {
      data.email = this.state.login;
    } else if (/^\d{6,}$/.test(this.state.login)) {
      // A string é composta apenas por números e tem pelo menos 6 caracteres
      data.matricula = this.state.login;
    } else {
      toast.warning('Campo de login inválido.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const loginButton = document.getElementById('loginButton');
    loginButton.disabled = true;
    const previousText = loginButton.innerText;
    loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Aguarde...</>';

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch(url, requestOptions)
      .then((response) => response.json().then((data) => ({
        ok: response.ok,
        data
      })))
      .then(response => {
        if (response.ok && response.data.token) {
          // Armazene o token em localStorage ou sessionStorage
          sessionStorage.setItem('token', response.data.token);
          toast.success('Login realizado!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            if (response.data.mustChangePassword) { sessionStorage.setItem('mustChangePassword', JSON.stringify(true)); }
            this.props.navigate('/');
          }, 500);
        } else if (!response.ok) {
          toast.error('Login falhou. Verifique suas credenciais.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (!response.data.token) {
          toast.error('Erro inesperado', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch(e => { 
        toast.error('Erro de servidor', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }); 
      });

    setTimeout(() => {
      loginButton.disabled = false;
      loginButton.innerText = previousText;
    }, 1000);
  }

  cleanState = () => {
    this.setState({
      nomeCompleto: '',
      matricula: '',
      login: '',
      password: '',
      confPassword: '',
      resetEmail: ''
    });
  }

  goToResetPassword = () => {
    this.cleanState();
    this.setState({ box: 'resetPasswordS1' });
  }

  goToLogin = () => {
    this.cleanState();
    this.setState({ box: 'login' });
  }

  validatePassword = () => {
    if (this.state.password !== this.state.confPassword) {
      document.getElementById('passwordConfNewUser').setCustomValidity('As senhas não conferem');
    } else {
      document.getElementById('passwordConfNewUser').setCustomValidity('');
    }
  }

  txtNomeCompleto_change = (event) => {
    this.setState({ nomeCompleto: event.target.value });
  }

  txtMatricula_change = (event) => {
    this.setState({ matricula: event.target.value });
  }

  txtNewLogin_change = (event) => {
    this.setState({ login: event.target.value });
  }

  txtNewPassword_change = (event) => {
    this.setState({ password: event.target.value }, () => this.validatePassword());
  }

  txtConfPassword_change = (event) => {
    this.setState({ confPassword: event.target.value }, () => this.validatePassword());
  }

  validateForm = () => {
    if (!this.state.resetEmail) {
      return false;
    }
    return true;
  };

  resetPassword = (event) => {
    event.preventDefault();

    const formElement = event.target; // Obter o formElement a partir do event

    // Validar o formulário
    if (!formElement.checkValidity()) {
        formElement.reportValidity(); // Exibir mensagens de erro se o formulário não for válido
        return;
    }

    if (!this.validateForm()) {
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

    const resetButton = document.getElementById('resetButton');
    resetButton.disabled = true;
    const previousText = resetButton.innerText;
    resetButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Aguarde...</>';

    var url = window.server + "/auth/sendPasswordReset"

    const data = {
      "email": this.state.resetEmail
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          setTimeout(() => {
            this.setState({ box: 'resetPasswordS2' });
          }, 1000);
          return;
        } else {
          toast.error('Ocorreu um erro', {
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

    setTimeout(() => {
      resetButton.disabled = false;
      resetButton.innerText = previousText;
    }, 1000);
  }

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.state.box === 'login') {
        document.getElementById("loginButton").click(); // Simula o clique no botão
      } else if (this.state.box === "resetPasswordS1") {
        document.getElementById("resetButton").click(); // Simula o clique no botão
      }
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }


  render() {

    let box = '';

    if (this.state.box === 'login') {
      box = <>
        <div>
          <ToastContainer />
        </div>
        <form onSubmit={this.login}>
          <div className="mb-3 row justify-content-center">
            <div className='col-12'>
              <label htmlFor="loginUser">Login</label>
              <input type="text" className="form-control" id="loginUser" placeholder="Matrícula ou e-mail" onChange={this.txtLogin_change}></input>
            </div>
          </div>
          <div className="mb-4 row justify-content-center">
            <div className='col-12'>
              <label htmlFor="loginPassword" className="col-form-label">Senha</label>
              <input type="password" className="form-control" id="loginPassword" onChange={this.txtPassword_change}></input>
            </div>
          </div>
          <div className='mb-3 row justify-content-center'>
            <div className='col-12 d-grid'>
              <button className='btn btn-custom' id="loginButton" type='submit'>Entrar no sistema</button>
            </div>
          </div>
          <div className='mb-1 row'>
            <a href='#' className='text-decoration-none' onClick={this.goToResetPassword}>Esqueci a senha</a>
          </div>
        </form>
      </>;
    } else if (this.state.box.startsWith('resetPassword')) {
      if (this.state.box === 'resetPasswordS1') {
        box = <>
          <h2 className='fw-bold fs-4 text-decoration-underline mb-3' style={{ color: '#404040' }}>Esqueceu sua senha?</h2>
          <form onSubmit={this.resetPassword}>
            <div className='row mb-3'>
              <div className='col-12 mt-3'>
                <p>Não se preocupe. Vamos tentar te ajudar.<br /> Primeiro, digite seu e-mail abaixo:</p>
              </div>
              <div className='col-12'>
                <label htmlFor="resetEmail" className='required'>E-mail</label>
                <input type="email" className="form-control" id="resetEmail" name="resetEmail" required placeholder="email@email.com" onChange={this.handleChange}></input>
              </div>
            </div>
            <div className='row'>
              <div className='col-12 d-flex justify-content-between'>
                <button className='btn btn-secondary' onClick={this.goToLogin}>Voltar</button>
                <button className='btn btn-custom' id="resetButton" type='submit'>Enviar</button>
              </div>
            </div>
          </form>
        </>;
      } else if (this.state.box === 'resetPasswordS2') {
        box = <>
          {/* Essa parte ainda precisa ser revisada, para ver como ficará a partir daqui a integração com o backend */}
          <h2 className='fw-bold fs-4 text-decoration-underline mb-3' style={{ color: '#404040' }}>Esqueceu sua senha?</h2>
          <div className='row'>
            <div className='col-12 mt-3'>
              <p>Enviamos um e-mail com as instruções para recuperação da sua senha.<br /> Por favor, verifique sua caixa de entrada.</p>
            </div>
          </div>
          <div className='row'>
            <div className='col-12 d-flex justify-content-end'>
              <button className='btn btn-custom' onClick={this.goToLogin}>Voltar</button>
            </div>
          </div>
        </>;
      }
    }

    return (
      <div className='container-fluid d-flex flex-column justify-content-between' style={{ 'minHeight': '100vh' }}>
        <div className='row justify-content-center' style={{ 'marginTop': '10vh' }}>
          <div className='col-10 col-md-6 col-lg-4 text-center'>
            <img src={logoFemass} className="img-fluid" style={{ 'maxWidth': '300px' }} alt="Logo da faculdade"></img>
          </div>
        </div>
        <div className='row mt-5 justify-content-center'>
          <div className='col-10 col-md-6 col-lg-5 col-xl-3'>
            <div className='bg-white border rounded p-4'>
              {box}
            </div>
          </div>
        </div>
        <div className='row justify-content-end mt-auto'>
          <div className='col-6 col-md-4 text-end'>
            <img src={logo} className="img-fluid mb-3 me-2" style={{ 'maxWidth': '180px' }} alt="Logo da faculdade"></img>
          </div>
        </div>
      </div>
    )
  }
}

export default withNavigate(Login);
