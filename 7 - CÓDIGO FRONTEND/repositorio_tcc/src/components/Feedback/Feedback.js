import React, { Component } from 'react';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Feedback extends Component {
  state = {
    entregas: [],
    feedbacks: {}
  };

  componentDidMount() {
    axios.get('http://localhost:8080/entregas/orientador')
      .then(response => {
        this.setState({ entregas: response.data });
      })
      .catch(error => {
        toast.error('Erro ao carregar entregas.');
        console.error(error);
      });
  }

  handleFeedbackChange = (e, entregaId) => {
    this.setState({
      feedbacks: {
        ...this.state.feedbacks,
        [entregaId]: e.target.value
      }
    });
  };

  enviarFeedback = (entregaId) => {
    const comentario = this.state.feedbacks[entregaId];
    if (!comentario) {
      toast.warning('Digite um feedback antes de enviar.');
      return;
    }

    axios.put(`http://localhost:8080/entregas/${entregaId}/feedback`, { comentario })
      .then(() => {
        toast.success('Feedback enviado com sucesso!');
      })
      .catch(() => toast.error('Erro ao enviar feedback.'));
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <h2 className="text-center text-primary mb-4">Feedback</h2>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Entrega</th>
                <th>Prazo</th>
                <th>Status</th>
                <th>Arquivo</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {this.state.entregas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">Nenhuma entrega encontrada.</td>
                </tr>
              ) : (
                this.state.entregas.map((entrega) => (
                  <tr key={entrega.id}>
                    <td>{entrega.descricao}</td>
                    <td>{entrega.prazo}</td>
                    <td>
                      <span className={
                        entrega.status === 'CONCLUIDA' ? 'badge bg-success' :
                        entrega.status === 'PENDENTE' ? 'badge bg-warning text-dark' :
                        entrega.status === 'CORRIGIR' ? 'badge bg-danger' : 'badge bg-secondary'
                      }>
                        {entrega.status}
                      </span>
                    </td>
                    <td>
                      <a href={entrega.arquivoUrl} target="_blank" rel="noopener noreferrer">Ver Arquivo</a>
                    </td>
                    <td>
                      <textarea
                        className="form-control mb-2"
                        placeholder="Digite o feedback..."
                        value={this.state.feedbacks[entrega.id] || ''}
                        onChange={(e) => this.handleFeedbackChange(e, entrega.id)}
                      />
                      <button className="btn btn-primary btn-sm" onClick={() => this.enviarFeedback(entrega.id)}>
                        Enviar Feedback
                      </button>
                    </td>
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
