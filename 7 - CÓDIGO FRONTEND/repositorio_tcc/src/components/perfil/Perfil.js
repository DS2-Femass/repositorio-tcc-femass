import React, { Component } from 'react'
import Navbar from '../navbar/Navbar';

class Perfil extends Component {
    render() {
      return (
        <div>
          <Navbar />
          <div className="container mt-5">
            <h2 className="mb-4">Perfil</h2>
            <div className="card p-4 shadow-sm">
              <div className="mb-3">
                <label className="form-label">Nome do Usuário</label>
                <input type="text" className="form-control" placeholder="Nome do Usuário" disabled />
              </div>
              <div className="mb-3">
                <label className="form-label">Matrícula</label>
                <input type="text" className="form-control" placeholder="Matrícula" disabled />
              </div>
              <div className="mb-3">
                <label className="form-label">Disciplina</label>
                <input type="text" className="form-control" placeholder="Disciplina" disabled />
              </div>
              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input type="email" className="form-control" placeholder="E-mail" disabled />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  export default Perfil;
  