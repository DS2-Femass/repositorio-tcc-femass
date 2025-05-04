import React from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import Navbar from '../navbar/Navbar';

const Entregas = () => {
    // Lista de entregas simuladas
    const entregas = [
        { id: 1, titulo: "Entrega 1", prazo: "2025-04-20", feedback: "Falta revisão de estrutura." },
        { id: 2, titulo: "Entrega 2", prazo: "2025-03-01", feedback: "Bom desenvolvimento, melhorar conclusão." },
        { id: 3, titulo: "Entrega 3", prazo: "2025-05-25", feedback: "Corrigir erros gramaticais." }
    ];

    // Função para verificar se o prazo já expirou
    const prazoExpirado = (prazo) => new Date(prazo) < new Date();

    return (
        <div className="tcc-page bg-light min-vh-100">
            <Navbar />

            <Container className="mt-5">
                <div className="bg-white shadow-sm rounded p-5">
                    <h2 className="text-primary text-center">Minhas Entregas</h2>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Entrega</th>
                                <th>Prazo</th>
                                <th>Upload</th>
                                <th>Feedback</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entregas.map((entrega, index) => (
                                <tr key={`entrega-${entrega.id}-${index}`}>
                                    <td>{entrega.titulo}</td>
                                    <td className={prazoExpirado(entrega.prazo) ? "text-danger fw-bold" : ""}>
                                        {entrega.prazo}
                                    </td>
                                    <td>
                                        {/* Botão para upload de arquivos */}
                                        <Form.Group controlId={`upload-${entrega.id}`} className="mb-2">
                                            <Form.Control type="file" accept=".pdf, .doc, .docx, .txt" />
                                        </Form.Group>
                                        <Button variant="success" size="sm">Enviar Arquivo</Button>
                                    </td>
                                    <td>
                                        {/* Mostra feedback do professor caso ele tenha feito um comentário */}
                                        {entrega.feedback ? (
                                            <p className="text-muted">{entrega.feedback}</p>
                                        ) : (
                                            <p className="text-muted">Nenhum feedback disponível.</p>
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

export default Entregas;
