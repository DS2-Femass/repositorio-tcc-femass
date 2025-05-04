import React, { useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import Navbar from '../navbar/Navbar';

const VisualizarSolicitacoes = () => {
    // Estado com lista de solicitações pendentes (simuladas)
    const [solicitacoes, setSolicitacoes] = useState([
        { id: 1, aluno: "Ana Souza", tema: "Inteligência Artificial na Educação", status: "Pendente" },
        { id: 2, aluno: "Pedro Lima", tema: "Segurança da Informação em Aplicações Web", status: "Pendente" }
    ]);

    // Função para aceitar a solicitação
    const aceitarSolicitacao = (id) => {
        setSolicitacoes(prevSolicitacoes =>
            prevSolicitacoes.map(solicitacao =>
                solicitacao.id === id ? { ...solicitacao, status: "Aceito" } : solicitacao
            )
        );
    };

    // Função para recusar a solicitação
    const recusarSolicitacao = (id) => {
        setSolicitacoes(prevSolicitacoes =>
            prevSolicitacoes.map(solicitacao =>
                solicitacao.id === id ? { ...solicitacao, status: "Recusado" } : solicitacao
            )
        );
    };

    return (
        <div className="tcc-page bg-light min-vh-100">
            <Navbar />
            <Container className="mt-5">
                <div className="bg-white shadow-sm rounded p-5">
                    <h2 className="text-primary text-center">Solicitações de Orientação</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Aluno</th>
                                <th>Tema</th>
                                <th>Status</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitacoes.map(solicitacao => (
                                <tr key={solicitacao.id}>
                                    <td>{solicitacao.id}</td>
                                    <td>{solicitacao.aluno}</td>
                                    <td>{solicitacao.tema}</td>
                                    <td className={`fw-bold ${solicitacao.status === "Pendente" ? "text-warning" : solicitacao.status === "Aceito" ? "text-success" : "text-danger"}`}>
                                        {solicitacao.status}
                                    </td>
                                    <td>
                                        {solicitacao.status === "Pendente" && (
                                            <>
                                                <Button variant="success" size="sm" className="me-2" onClick={() => aceitarSolicitacao(solicitacao.id)}>
                                                    ✔ Aceitar
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => recusarSolicitacao(solicitacao.id)}>
                                                    ✖ Recusar
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </div>
    );
};

export default VisualizarSolicitacoes;
