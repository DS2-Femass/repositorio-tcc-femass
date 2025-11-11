import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

class ProtectedRoute extends Component {
    render() {
        const { component: Component, ...rest } = this.props;
        const isAuthenticated = sessionStorage.getItem('token'); // Verifica se o token existe

        if (!isAuthenticated) {
            // Se não estiver autenticado, redireciona para a página de login
            return <Navigate to="/login" replace />;
        }

        // Se estiver autenticado, renderiza o componente desejado
        return <Component {...rest} />;
    }
}

export default ProtectedRoute;