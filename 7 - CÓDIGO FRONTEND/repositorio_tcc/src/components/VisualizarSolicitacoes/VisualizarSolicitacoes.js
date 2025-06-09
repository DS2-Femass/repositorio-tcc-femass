import React, { Component } from 'react';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default class VisualizarSolicitacoes extends Component {
  state = {
    solicitacoes: []
  };

  componentDidMount() {
    axios.get('http://localhost:8080/tcc/solicitacoes')
      .then(response => {
        this.setState({ solicitacoes: response.data });
      })
      .catch(error => {
        toast.error('Erro ao carregar as solicitações.');
        console.error(error);
      });
  }

  aceitarSolicitacao = (id) => {
    toast.success(`Solicitação ${id} aceita`);
    // Aqui você faria um PUT ou PATCH futuramente para atualizar o status
  };

  recusarSolicitacao = (id) => {
    toast.warning(`Solicitação ${id} recusada`);
    // Aqui você faria um PUT ou PATCH futuramente para atualizar o status
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <h2 className="text-center text-primary mb-4">Solicitações de Orientação</h2>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Aluno</th>
                <th>Tema</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {this.state.solicitacoes.map((s, index) => (
                <tr key={index}>
                  <td>{s.id}</td>
                  <td>{s.nomeAluno}</td>
                  <td>{s.tema}</td>
                  <td className="text-warning fw-bold">{s.status}</td>
                  <td>
                    <button className="btn btn-success btn-sm me-2" onClick={() => this.aceitarSolicitacao(s.id)}>✔ Aceitar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => this.recusarSolicitacao(s.id)}>✘ Recusar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ToastContainer />
        </div>
      </>
    );
  }
}
