import React, { Component } from 'react'
import PasswordModalContext from '../components/passwordChange/PasswordModalContext';

export default class ChangePassword extends Component {

    static contextType = PasswordModalContext;

    componentDidMount() {
        const mustChangePassword = JSON.parse(sessionStorage.getItem('mustChangePassword')); // Verifica se o token existe

        if (mustChangePassword === true) {
            // Chama o modal de troca de senha, caso a ação seja necessária
            this.context.openModal();
        } else if(this.context.showModal) {
            // Fecha o modal, caso ele esteja aberto
            this.context.closeModal();
        }
    }

    render() {
    const { component: WrappedComponent, ...rest } = this.props;

    // Renderiza o componente recebido pelo HOC, passando todas as props restantes
    return <WrappedComponent {...rest} />;
    }
}
