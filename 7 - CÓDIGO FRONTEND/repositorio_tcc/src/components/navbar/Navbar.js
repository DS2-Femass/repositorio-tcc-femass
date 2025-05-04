import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap'; //importação Dropdown do react-bootstrap


export default class Navbar extends Component {


  logout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  }

  state = {
    currentPageLink: 'home',
    solicitacoesPendentes: 1 // Número de solicitações pendentes (pode vir do backend futuramente)
  }

  componentDidMount() {
    this.setState({currentPageLink: window.location.pathname.split('/')[1]});
  }

  render() {
    return (
        <nav className="navbar navbar-dark fixed-top">
          <div className="container-fluid">
            <button className="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Barra de menu">
              <span className="fs-1" style={{color: 'black'}}><i className="bi bi-list"></i></span>
            </button>
            {/* <Link to="/" className='navbar-brand' onClick={() => this.markCurrentPageLink('linkToHome')}><i className="bi bi-house-fill"></i> Home</Link> */}
            <div className="offcanvas offcanvas-start bg-custom-blue rounded-end-5 p-5 ps-4" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
              <div className="offcanvas-header border-bottom">
                <h5 className="offcanvas-title text-white display-5" id="offcanvasDarkNavbarLabel">Menu</h5>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 fs-5">
                  <li className="nav-item">
                    <Link to="/home" className={`nav-link ${this.state.currentPageLink === 'home' ? 'active' : ''}`} id="linkToHome">Início</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/alunos" className={`nav-link ${this.state.currentPageLink === 'alunos' ? 'active' : ''}`}>Alunos</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/orientadores" className={`nav-link ${this.state.currentPageLink === 'orientadores' ? 'active' : ''}`}>Orientadores</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/tcc" className={`nav-link ${this.state.currentPageLink === 'tcc' ? 'active' : ''}`}>Trabalhos de Conclusão</Link>
                  </li>
                    {/* Novo ítem - Solicitações */}
                    <li className="nav-item">
                  <Dropdown>
                    <Dropdown.Toggle variant="transparent" className={`nav-link d-flex align-items-center ${this.state.currentPageLink === 'solicitacoes' ? 'active' : ''}`}>
                      <span>Solicitações</span>
                      {this.state.solicitacoesPendentes > 0 && (
                        <span className="badge bg-danger ms-2">{this.state.solicitacoesPendentes}</span>
                      )}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/solicitacoes"> Visualizar Solicitações
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
                  <li className="nav-item">
                    <Link to="/meu-tcc" className={`nav-link ${this.state.currentPageLink === 'meu-tcc' ? 'active' : ''}`}>Meu TCC</Link>
                  </li>
                {/* Submenu dentro da opção Meu TCC */}
                <li className="nav-item">
                  <Dropdown>
                    <Dropdown.Toggle className={`nav-link ${this.state.currentPageLink === 'meu-tcc' ? 'active' : ''}`} variant="transparent">
                      Meu TCC
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/meu-tcc">Visualizar Meu TCC</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/solicitar-orientador">Solicitar Orientador</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
                  {/* Novo ítem - Alunos Orientados */}
                  <li className="nav-item">
                    <Dropdown>
                      <Dropdown.Toggle variant="transparent" className={`nav-link d-flex align-items-center ${this.state.currentPageLink === 'alunos-orientados' ? 'active' : ''}`}>
                    <i className="bi bi-person-check me-2"></i> {/* Ícone de alunos orientados */}
                    <span>Alunos Orientados</span>
                    </Dropdown.Toggle>
                   <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/alunos-orientados">Visualizar Orientandos</Dropdown.Item>
                 </Dropdown.Menu>
                </Dropdown>
                </li>
                  {/* Novo ítem - visualização gerenciamento de entregas professor */}
                   <li className="nav-item">
                  <Dropdown>
                    <Dropdown.Toggle variant="transparent" className={`nav-link d-flex align-items-center ${this.state.currentPageLink === 'gerenciamento-entregas' ? 'active' : ''}`}>
                      <i className="bi bi-folder-check me-2"></i> {/* Ícone de gerenciamento */}
                      <span>Entregas</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/gerenciamento-entregas">Visualizar Entregas</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
                      {/* Novo ítem - Entregas*/}
                     <li className="nav-item">
                    <Dropdown>
                      <Dropdown.Toggle variant="transparent" className={`nav-link d-flex align-items-center ${this.state.currentPageLink === 'entregas' ? 'active' : ''}`}>
                        <i className="bi bi-upload me-2"></i> {/* Ícone de upload */}
                        <span>Entregas</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/entregas">Minhas Entregas</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>

                  <li className="nav-item">
                    <Link to="/users" className={`nav-link ${this.state.currentPageLink === 'users' ? 'active' : ''}`}>Usuários</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div>
                <button type="button" aria-label="Usuário" className='btn btn-light border-0'><span><i className="bi bi-person-circle fs-2 p-2"></i>Nome Aluno(a)</span></button>
                <button type="button" aria-label="Notificações" className='btn btn-light border-0'><span className='w-100'><i className="bi bi-bell fs-2"></i></span></button>
                <button type="button" aroa-label="Sair do Sistema" className='btn border-0 btn-light' onClick={this.logout}><span><i className='bi bi-box-arrow-left fs-2'></i></span></button>
            </div>
          </div>
        </nav>
      )
  }
}
