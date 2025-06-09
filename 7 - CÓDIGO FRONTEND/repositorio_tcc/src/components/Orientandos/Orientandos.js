import React, { Component } from 'react';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default class Orientandos extends Component {
  state = {
    orientandos: []
  };

  componentDidMount() {
    axios.get('http://localhost:8080/tcc/orientandos')
      .then(response => {
        this.setState({ orientandos: response.data });
      })
      .catch(error => {
        toast.error('Erro ao carregar os orientandos.');
        console.error(error);
      });
  }

  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <h4 className="text-primary fw-bold">Orientandos</h4>
          <table className="table table-bordered mt-3">
            <thead className="table-light">
              <tr>
                <th>Nome do Aluno</th>
                <th>Tema do TCC</th>
              </tr>
            </thead>
            <tbody>
              {this.state.orientandos.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center text-muted">Nenhum orientando encontrado.</td>
                </tr>
              ) : (
                this.state.orientandos.map((o, i) => (
                  <tr key={i}>
                    <td>{o.nomeAluno}</td>
                    <td>{o.tema}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <ToastContainer />
        </div>
      </>
    );
  }
}

