import React, { Component } from 'react';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class GerenciamentoEntregas extends Component {
  state = {
    entregas: [],
    comentarios: {}
  };

  componentDidMount() {
    axios.get('http://localhost:8080/entregas/disciplina')
      .then(response => {
        this.setState({ entregas: response.data });
      })
      .catch(error => {
        toast.error('Erro ao carregar entregas.');
        console.error(error);
      });
  }

  handleComentarioChange = (e, entregaId) => {
    this.setState({
      comentarios: {
        ...this.state.comentarios,
        [entregaId]: e.target.value
      }
    });
  };

  salvarComentario = (entregaId) => {
    const comentario = this.state.comentarios[entregaId];

    axios.put(`http://localhost:8080/entregas/${entregaId}/atualizar`, { comentario })
      .then(() => toast.success('Comentário atualizado com sucesso!'))
      .catch(() => toast.error('Erro ao atualizar comentário.'));
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <h2 className="text-center text-primary mb-4">Gerenciamento de Entregas</h2>

          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Entrega</th>
                <th>Prazo</th>
                <th>Status</th>
                <th>Arquivo</th>
                <th>Comentário</th>
              </tr>
            </thead>
            <tbody>
              {this.state.entregas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">Nenhuma entrega cadastrada.</td>
                </tr>
              ) : (
                this.state.entregas.map((entrega) => {
                  const status = entrega.arquivoUrl ? 'CONCLUÍDO' : 'PENDENTE';
                  const statusClass = entrega.arquivoUrl ? 'bg-success' : 'bg-warning text-dark';

                  return (
                    <tr key={entrega.id}>
                      <td>{entrega.descricao}</td>
                      <td>{entrega.prazo}</td>
                      <td>
                        <span className={`badge ${statusClass}`}>{status}</span>
                      </td>
                      <td>
                        {entrega.arquivoUrl ? (
                          <a href={entrega.arquivoUrl} target="_blank" rel="noopener noreferrer">Ver Arquivo</a>
                        ) : 'Não enviado'}
                      </td>
                      <td>
                        <textarea
                          className="form-control"
                          placeholder="Comentário..."
                          value={this.state.comentarios[entrega.id] || ''}
                          onChange={(e) => this.handleComentarioChange(e, entrega.id)}
                        />
                        <button className="btn btn-primary btn-sm mt-2" onClick={() => this.salvarComentario(entrega.id)}>
                          Salvar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <ToastContainer />
        </div>
      </>
    );
  }
}