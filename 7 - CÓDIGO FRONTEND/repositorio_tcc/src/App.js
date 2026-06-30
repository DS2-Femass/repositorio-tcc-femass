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
import Subcategoria from './components/subcategoria/Subcategoria.js';
import MeuTCC from './components/tcc/MeuTCC.js';
import Perfil from './components/perfil/Perfil.js';
import FirstAccess from './components/firstAccess/FirstAccess.js';
import PalavraChave from './components/palavraChave/PalavraChave.js';
import Atividade from './components/atividade/Atividade.js';
import Turma from './components/turma/Turma.js';

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
    const ProtectedSubcategoria = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={Subcategoria} {...props} />} />
    );
    const ProtectedPalavraChave = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={PalavraChave} {...props} />} />
    );
    const ProtectedMeuTCC = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={MeuTCC} {...props} />} />
    );
    const ParametrizedResetPasword = (props) => (
      <ResetPassword location={useLocation()} />
    );
    const ProtectedPerfil = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={Perfil} {...props} />} />
    );
    const ProtectedAtividade = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={Atividade} {...props} />} />
    );
    const ProtectedTurma = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={Turma} {...props} />} />
    );

    return (
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="container-fluid">
        <PasswordModalProvider>
          <Routes>
            <Route exact path="/" element={<FirstScreen />}></Route>
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/home" element={<ProtectedHome />}></Route>
            <Route exact path="/alunos" element={<ProtectedAluno />}></Route>
            <Route exact path="/orientadores" element={<ProtectedOrientador />}></Route>
            <Route exact path="/tcc" element={<ProtectedTCC />}></Route>
            <Route exact path="/meu-tcc" element={<ProtectedMeuTCC />}></Route>
            <Route exact path="/categorias" element={<ProtectedCategoria />}></Route>
            <Route exact path="/subcategorias" element={<ProtectedSubcategoria />}></Route>
            <Route exact path="/palavras-chave" element={<ProtectedPalavraChave />}></Route>
            <Route exact path="/users" element={<ProtectedUsers />}></Route>
            <Route exact path="/reset-password" element={<ParametrizedResetPasword />}></Route>
            <Route exact path="/perfil" element={<ProtectedPerfil />}></Route>
            <Route exact path="/first-access" element={<FirstAccess />}></Route>
            <Route exact path="/atividades" element={<ProtectedAtividade />}></Route>
            <Route exact path="/turmas" element={<ProtectedTurma />}></Route>
          </Routes>
          <PasswordChangeModal />
        </PasswordModalProvider>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
