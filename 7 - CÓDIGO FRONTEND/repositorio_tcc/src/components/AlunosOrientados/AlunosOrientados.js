// Importa o React, necessário para usar JSX e criar componentes
import React from 'react';

// Importa componentes do React-Bootstrap: Container para layout e Table para exibir tabelas
import { Container, Table } from 'react-bootstrap'; 

// Importa o Link do React Router para criar links de navegação entre páginas
import { Link } from 'react-router-dom'; 

// Importa o componente da barra de navegação personalizada
import Navbar from '../navbar/Navbar'; 

// Define o componente funcional "AlunosOrientados"
const AlunosOrientados = () => {
    // Lista fixa com alunos orientados e seus respectivos temas de TCC
    const orientandos = [
        { id: 1, nome: "Carlos Mendes", tema: "IA na Educação" },
        { id: 2, nome: "Mariana Costa", tema: "Segurança Cibernética" }
    ];

    // Renderização da interface
    return (
        // Div principal com estilo de fundo claro e altura mínima da tela
        <div className="tcc-page bg-light min-vh-100">

            {/* Componente de navegação (barra superior) */}
            <Navbar /> 

            {/* Container centralizado com margem superior */}
            <Container className="mt-5">
                
                {/* Bloco branco com sombra e cantos arredondados */}
                <div className="bg-white shadow-sm rounded p-5">
                    
                    {/* Título da página */}
                    <h2 className="text-primary text-center">Alunos Orientados</h2>

                    {/* Tabela com dados dos orientandos */}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nome do Aluno</th>
                                <th>Tema do TCC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Verifica se há alunos na lista. Se não houver, mostra mensagem */}
                            {orientandos.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="text-center text-muted fw-bold">
                                        Nenhum aluno encontrado.
                                    </td>
                                </tr>
                            ) : (
                                // Caso haja alunos, percorre a lista e exibe os dados
                                orientandos.map((aluno, index) => (
                                    <tr key={`aluno-${aluno.id}-${index}`}>
                                        <td>
                                            {/* Nome do aluno como link para a página de entregas dele */}
                                            <Link 
                                             to={`/gerenciamento-entregas/${aluno.id}`} 
                                                className="text-decoration-none fw-bold">
                                                    {aluno.nome}
                                                </Link>
                                        </td>
                                        {/* Tema do TCC do aluno */}
                                        <td>{aluno.tema}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </div>
    );
};

// Exporta o componente para que ele possa ser usado em outras partes do sistema
export default AlunosOrientados;
