import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';

// Componente de ordem superior para passar o navigate como prop
function withNavigate(Component) {
  return (props) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class FirstScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirecting: false,
        };
    }

    componentDidMount() {
        // Verificar se o usuário já acessou anteriormente
        const isAuthenticated = sessionStorage.getItem('token');
        
        this.setState({ redirecting: true });

        setTimeout(() => {
            if (isAuthenticated) {
                this.props.navigate('/home');
            } else {
                this.props.navigate('/login');
            }
        }, 0);  // Adiciona um pequeno delay
    }

    render() {

    // Verifica se está redirecionando para não renderizar nada enquanto navega
    if (this.state.redirecting) {
        return null;
    }

    return (
        <div
        className="container-fluid d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
        >
        <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        </div>
    );
    }
}

// Exporta o componente envolvido pelo HOC
export default withNavigate(FirstScreen);
