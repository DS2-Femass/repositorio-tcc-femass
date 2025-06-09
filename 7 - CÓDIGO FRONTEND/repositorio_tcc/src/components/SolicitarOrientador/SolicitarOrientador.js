import React, { Component } from 'react';
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import { ToastContainer, toast } from 'react-toastify';

export default class SolicitarOrientador extends Component {
  state = {
    orientadores: [],
    selectedOrientadorId: '',
    tema: ''
  };

  componentDidMount() {
    axios.get('http://localhost:8080/orientadores')
      .then(response => {
        this.setState({ orientadores: response.data });
      })
      .catch(error => {
        toast.error('Erro ao carregar os orientadores.');
        console.error(error);
      });
  }

  handleSubmit = () => {
    const { selectedOrientadorId, tema } = this.state;
    console.log('Dados enviados:', { selectedOrientadorId, tema });

    // Aqui futuramente será feito um POST real para enviar o convite
    toast.success('Convite enviado com sucesso!');
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <h2 className="text-center text-primary mb-4">Enviar Convite para Orientador</h2>
          <div className="mb-3">
            <label className="form-label fw-bold">Professor:</label>
            <select
              className="form-select"
              value={this.state.selectedOrientadorId}
              onChange={(e) => this.setState({ selectedOrientadorId: e.target.value })}
            >
              <option value="">Selecione um orientador...</option>
              {this.state.orientadores.map((o) => (
                <option key={o.id} value={o.id}>{o.nomeCompleto}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Tema do TCC:</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Descreva o tema do seu TCC"
              value={this.state.tema}
              onChange={(e) => this.setState({ tema: e.target.value })}
            />
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={this.handleSubmit}>Enviar Convite</button>
          </div>
          <ToastContainer />
        </div>
      </>
    );
  }
}