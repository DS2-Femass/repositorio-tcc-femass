import React, { Component } from 'react';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class CadastroEntregas extends Component {
  state = {
    entregas: [],
    novasEntregas: {
      descricao: '',
      prazo: ''
    },
    prazos: {}
  };

  componentDidMount() {
    this.carregarEntregas();
  }

  carregarEntregas = () => {
    axios.get('http://localhost:8080/entregas/disciplina')
      .then(response => {
        this.setState({ entregas: response.data });
      })
      .catch(error => {
        toast.error('Erro ao carregar entregas.');
        console.error(error);
      });
  };

  handleDescricaoChange = (e) => {
    this.setState({
      novasEntregas: {
        ...this.state.novasEntregas,
        descricao: e.target.value
      }
    });
  };

  handlePrazoNovaEntregaChange = (e) => {
    this.setState({
      novasEntregas: {
        ...this.state.novasEntregas,
        prazo: e.target.value
      }
    });
  };

  handlePrazoChange = (e, entregaId) => {
    this.setState({
      prazos: {
        ...this.state.prazos,
        [entregaId]: e.target.value
      }
    });
  };

  cadastrarEntrega = () => {
    const { descricao, prazo } = this.state.novasEntregas;
    if (!descricao || !prazo) {
      toast.warning('Descrição e prazo são obrigatórios.');
      return;
    }

    axios.post('http://localhost:8080/entregas', { descricao, prazo })
      .then(() => {
        toast.success('Entrega cadastrada com sucesso!');
        this.setState({ novasEntregas: { descricao: '', prazo: '' } });
        this.carregarEntregas();
      })
      .catch(() => toast.error('Erro ao cadastrar entrega.'));
  };

  salvarPrazo = (entregaId) => {
    const novoPrazo = this.state.prazos[entregaId];
    if (!novoPrazo) {
      toast.warning('Informe um novo prazo.');
      return;
    }

    axios.put(`http://localhost:8080/entregas/${entregaId}/atualizar`, { prazo: novoPrazo })
      .then(() => {
        toast.success('Prazo atualizado com sucesso!');
        this.carregarEntregas();
      })
      .catch(() => toast.error('Erro ao atualizar prazo.'));
  };

  excluirEntrega = (entregaId) => {
    if (window.confirm('Deseja realmente excluir essa entrega?')) {
      axios.delete(`http://localhost:8080/entregas/${entregaId}`)
        .then(() => {
          toast.success('Entrega excluída com sucesso!');
          this.carregarEntregas();
        })
        .catch(() => toast.error('Erro ao excluir entrega.'));
    }
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <h2 className="text-center text-primary mb-4">Cadastrar Entregas</h2>

          {/* 🔹 Formulário para nova entrega */}
          <div className="mb-4">
            <label className="form-label">Nova Entrega</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Descrição da entrega"
              value={this.state.novasEntregas.descricao}
              onChange={this.handleDescricaoChange}
            />
            <input
              type="date"
              className="form-control mb-2"
              placeholder="Prazo da entrega"
              value={this.state.novasEntregas.prazo}
              onChange={this.handlePrazoNovaEntregaChange}
            />
            <button className="btn btn-success" onClick={this.cadastrarEntrega}>
              Cadastrar Entrega
            </button>
          </div>

          {/* 🔹 Tabela de entregas */}
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Entrega</th>
                <th>Prazo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {this.state.entregas.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    Nenhuma entrega cadastrada.
                  </td>
                </tr>
              ) : (
                this.state.entregas.map((entrega) => (
                  <tr key={entrega.id}>
                    <td>{entrega.descricao}</td>
                    <td>
                      <input
                        type="date"
                        className="form-control"
                        value={this.state.prazos[entrega.id] || entrega.prazo || ''}
                        onChange={(e) => this.handlePrazoChange(e, entrega.id)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => this.salvarPrazo(entrega.id)}
                      >
                        Salvar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => this.excluirEntrega(entrega.id)}
                      >
                        Excluir
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
