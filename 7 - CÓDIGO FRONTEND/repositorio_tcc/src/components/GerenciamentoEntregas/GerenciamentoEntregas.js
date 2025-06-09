import React, { Component } from 'react';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class GerenciamentoEntregas extends Component {
  state = {
    entregas: [],
    novasEntregas: {},
    prazos: {},
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

  handlePrazoChange = (e, entregaId) => {
    this.setState({
      prazos: {
        ...this.state.prazos,
        [entregaId]: e.target.value
      }
    });
  };

  handleComentarioChange = (e, entregaId) => {
    this.setState({
      comentarios: {
        ...this.state.comentarios,
        [entregaId]: e.target.value
      }
    });
  };

  handleDescricaoChange = (e) => {
    this.setState({
      novasEntregas: {
        ...this.state.novasEntregas,
        descricao: e.target.value
      }
    });
  }

  cadastrarEntrega = () => {
    const { descricao } = this.state.novasEntregas;
    if (!descricao) {
      toast.warning('Descrição é obrigatória.');
      return;
    }

    axios.post('http://localhost:8080/entregas', { descricao })
      .then(() => {
        toast.success('Entrega cadastrada com sucesso!');
        this.componentDidMount();
      })
      .catch(() => toast.error('Erro ao cadastrar entrega.'));
  }

  salvarPrazoComentario = (entregaId) => {
    const prazo = this.state.prazos[entregaId];
    const comentario = this.state.comentarios[entregaId];

    axios.put(`http://localhost:8080/entregas/${entregaId}/atualizar`, { prazo, comentario })
      .then(() => toast.success('Informações atualizadas'))
      .catch(() => toast.error('Erro ao atualizar informações'));
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <h2 className="text-center text-primary mb-4">Gerenciamento de Entregas</h2>

          <div className="mb-4">
            <label className="form-label">Nova Entrega</label>
            <input type="text" className="form-control mb-2" placeholder="Descrição da entrega"
              onChange={this.handleDescricaoChange} />
            <button className="btn btn-success" onClick={this.cadastrarEntrega}>Cadastrar Entrega</button>
          </div>

          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Entrega</th>
                <th>Prazo</th>
                <th>Status</th>
                <th>Arquivo</th>
                <th>Comentário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {this.state.entregas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">Nenhuma entrega cadastrada.</td>
                </tr>
              ) : (
                this.state.entregas.map((entrega) => (
                  <tr key={entrega.id}>
                    <td>{entrega.descricao}</td>
                    <td>
                      <input
                        type="date"
                        className="form-control"
                        value={this.state.prazos[entrega.id] || ''}
                        onChange={(e) => this.handlePrazoChange(e, entrega.id)}
                      />
                    </td>
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
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => this.salvarPrazoComentario(entrega.id)}>
                        Salvar
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

