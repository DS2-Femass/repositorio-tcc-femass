import React, { Component } from 'react'
import Navbar from '../../navbar/Navbar';

class PrimeiraEntrega extends Component {

    state = {
        users: [],
        filteredData: [],
        checkboxNotifyEmail: true,
        toDeleteItem: null,
        toViewItem: null,
        toEditItem: null,
        showModalDeletion: false,
        showModalEdit: false,
        showModalRegistration: false,
        showModalView: false,
        nomeCompleto: '',
        login: '',
        email: '',
        filterText: '',
        checkboxChangePassword: false
    }

    render() {
        return(
            <>
            <Navbar />
            Olá mundo, esse commit é apenas um teste
            </>
        )
    }
}

export default PrimeiraEntrega;