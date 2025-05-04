import React from 'react';
import { useParams } from 'react-router-dom'; // Captura o ID do aluno da URL
import { Container, Table, Button, Form } from 'react-bootstrap';
import Navbar from '../navbar/Navbar';

const GerenciamentoEntregas= () => {
    const { id } = useParams(); // Obtém o ID do aluno passado na URL

    // Lista de entregas simuladas (poderia vir de uma API futuramente)
    const entregas = [
        { alunoId: 1, id: 1, titulo: "Proposta", prazo: "10/03/2024", status: "Concluída" },
        { alunoId: 1, id: 2, titulo: "Capítulo 1", prazo: "24/04/2024", status: "Pendente" },
        { alunoId: 2, id: 3, titulo: "Capítulo 2", prazo: "15/05/2024", status: "Corrigir" }
    ];

    // Filtra as entregas do aluno selecionado
    const entregasDoAluno = entregas.filter(entrega => entrega.alunoId === parseInt(id));

    return (
        <div className="tcc-page bg-light min-vh-100">
            <Navbar />

            <Container className="mt-5">
                <div className="bg-white shadow-sm rounded p-5">
                    <h2 className="text-primary text-center">Gerenciamento de Entregas</h2>

                    {/* Exibe as entregas do aluno selecionado */}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Entrega</th>
                                <th>Prazo</th>
                                <th>Status</th>
                                <th>Feedback</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entregasDoAluno.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted fw-bold">
                                        Nenhuma entrega encontrada para este aluno.
                                    </td>
                                </tr>
                            ) : (
                                entregasDoAluno.map((entrega, index) => (
                                    <tr key={`entrega-${entrega.id}-${index}`}>
                                        <td>{entrega.titulo}</td>
                                        <td>{entrega.prazo}</td>
                                        <td className={`fw-bold ${
                                            entrega.status === "Pendente" ? "text-warning" :
                                            entrega.status === "Concluída" ? "text-success" :
                                            entrega.status === "Corrigir" ? "text-danger" :
                                            "text-secondary"
                                        }`}>
                                            {entrega.status}
                                        </td>
                                        <td>
                                            {/* Caixa de texto + botão "Salvar" para feedback */}
                                            <Form.Group className="mb-2">
                                                <Form.Control type="text" placeholder="Escreva seu feedback..." />
                                            </Form.Group>
                                            <Button variant="primary" size="sm">Salvar Feedback</Button>
                                        </td>
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
export default GerenciamentoEntregas;

