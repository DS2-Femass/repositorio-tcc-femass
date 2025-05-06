import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login.js'
import Home from './components/home/Home.js'
import Aluno from './components/aluno/Aluno.js'
import FirstScreen from './components/firstScreen/FirstScreen.js';
import ProtectedRoute from './HOC/ProtectedRoute';
import TCC from './components/tcc/TCC.js';
import { PasswordModalProvider } from './components/passwordChange/PasswordModalContext'; // O provedor do contexto
import PasswordChangeModal from './components/passwordChange/PasswordChangeModal'; // O modal global
import ChangePassword from './HOC/ChangePassword.js';
import Orientador from './components/orientador/Orientador.js';
import Users from './components/users/Users.js';
import ResetPassword from './components/resetPassword/ResetPassword.js';
import { useLocation } from 'react-router-dom';
import Categoria from './components/categoria/Categoria.js';
import MeuTCC from './components/tcc/MeuTCC.js';
import SolicitarOrientador from './components/SolicitarOrientador/SolicitarOrientador.js'; //importar no arquivo o submenu
import VisualizarSolicitacoes from './components/VisualizarSolicitacoes/VisualizarSolicitacoes.js';//importar novo item do menu
import AlunosOrientados from './components/AlunosOrientados/AlunosOrientados';
import GerenciamentoEntregas from './components/GerenciamentoEntregas/GerenciamentoEntregas'; 
import Entregas from './components/Entregas/Entregas.js';//entrega do aluno 


class App extends React.Component{
  
  render(){

    //Envolvimento do componente em diversos HOCS
    const ProtectedHome = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={Home} {...props} />} />
    );
    const ProtectedAluno = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={Aluno} {...props} />} />
    );
    const ProtectedOrientador = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={Orientador} {...props} />} />
    );
    const ProtectedTCC = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={TCC} {...props} />} />
    );
    const ProtectedUsers = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={Users} {...props} />} />
    );
    const ProtectedCategoria = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={Categoria} {...props} />} />
    );
    const ProtectedMeuTCC = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={MeuTCC} {...props} />} />
    );
    const ParametrizedResetPasword = (props) => (
      <ResetPassword location={useLocation()} />
    );

    return (
      <BrowserRouter>
        <div className="container-fluid">
          <PasswordModalProvider>
            <Routes>
              {/* Rotas principais */}
              <Route path="/" element={<FirstScreen />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<ProtectedHome />} />
              <Route path="/alunos" element={<ProtectedAluno />} />
              <Route path="/orientadores" element={<ProtectedOrientador />} />
              <Route path="/tcc" element={<ProtectedTCC />} />
              <Route path="/meu-tcc" element={<ProtectedMeuTCC />} />
              <Route path="/categorias" element={<ProtectedCategoria />} />
              <Route path="/users" element={<ProtectedUsers />} />
              <Route path="/reset-password" element={<ParametrizedResetPasword/>} />
              {/* Submenu "Meu TCC" */}
              <Route path="/solicitar-orientador" element={<SolicitarOrientador />} />
              {/* Menu de "Solicitações" */}
              <Route path="/solicitacoes" element={<VisualizarSolicitacoes />} />
              {/* Novo item "Alunos Orientados" */}
              <Route path="/alunos-orientados" element={<AlunosOrientados />} />
              {/* Gerenciamento de Entregas  */}
              <Route path="/gerenciamento-entregas" element={<GerenciamentoEntregas />} />
               {/* Gerenciamento de Entregas do aluno */}
              <Route path="/entregas" element={<Entregas />} />
            </Routes>
            <PasswordChangeModal />
          </PasswordModalProvider>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
