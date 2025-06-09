import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap'; // Importação do Dropdown do React-Bootstrap

export default class Navbar extends Component {

  logout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  }

  state = {
    currentPageLink: 'home',
  }

  componentDidMount() {
    this.setState({ currentPageLink: window.location.pathname.split('/')[1] });
  }

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top">
        <div className="container-fluid">
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Barra de menu">
            <span className="fs-1" style={{ color: 'black' }}><i className="bi bi-list"></i></span>
          </button>

          <div className="offcanvas offcanvas-start bg-custom-blue rounded-end-5 p-5 ps-4" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header border-bottom">
              <h5 className="offcanvas-title text-white display-5" id="offcanvasDarkNavbarLabel">Menu</h5>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 fs-5">

                {/* 🔹 Categoria: Professor da Disciplina */}
                <li className="nav-item">
                  <Dropdown>
                    <Dropdown.Toggle variant="transparent" className="nav-link dropdown-toggle">
                      Professor da Disciplina
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/users">Usuários</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/orientadores">Orientadores</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/alunos">Alunos</Dropdown.Item>
                     <Dropdown.Item as={Link} to="/gerenciamento-entregas">Gerenciamento de Entregas</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>

                {/* 🔹 Categoria: Professor Orientador */}
                <li className="nav-item">
                  <Dropdown>
                    <Dropdown.Toggle variant="transparent" className="nav-link dropdown-toggle">
                      Professor Orientador
                    </Dropdown.Toggle>
                    <Dropdown.Menu>

                      <Dropdown.Item as={Link} to="/Visualizar-Solicitacoes">Visualizar Solicitacoes</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/Orientandos">Orientandos</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/feedback">Feedback</Dropdown.Item> 

                    </Dropdown.Menu>
                  </Dropdown>
                </li>

                {/* 🔹 Categoria: Aluno */}
                <li className="nav-item">
                  <Dropdown>
                    <Dropdown.Toggle variant="transparent" className="nav-link dropdown-toggle">
                      Aluno
                    </Dropdown.Toggle>
                    <Dropdown.Menu>

                      <Dropdown.Item as={Link} to="/meu-tcc">Meu TCC</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/solicitar-orientador">Solicitar Orientador</Dropdown.Item>  
                      <Dropdown.Item as={Link} to="/entregas">Entregas</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>

              </ul>
            </div>
          </div>

          {/* 🔹 Ícones de usuário e sistema */}
          <div>
            <Link to="/perfil" className='btn btn-light border-0'>
              <button type="button" aria-label="Usuário" className='btn btn-light border-0'>
                <span><i className="bi bi-person-circle fs-2 p-2"></i> Nome Aluno(a)</span>
              </button>
            </Link>
            <button type="button" aria-label="Notificações" className='btn btn-light border-0'>
              <span className='w-100'><i className="bi bi-bell fs-2"></i></span>
            </button>
            <button type="button" aria-label="Sair do Sistema" className='btn border-0 btn-light' onClick={this.logout}>
              <span><i className='bi bi-box-arrow-left fs-2'></i></span>
            </button>
          </div>
        </div>
      </nav>
    );
  }
}
