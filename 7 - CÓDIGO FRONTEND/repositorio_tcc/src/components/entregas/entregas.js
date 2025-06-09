import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Table, Alert } from 'react-bootstrap';

const Entregas = () => {
  const [entregas, setEntregas] = useState([]);
  const [file, setFile] = useState(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    fetchEntregas();
  }, []);

  const fetchEntregas = async () => {
    try {
      const response = await axios.get('/api/entregas/aluno');
      setEntregas(response.data);
    } catch (error) {
      console.error('Erro ao buscar entregas:', error);
    }
  };

  const handleUpload = async (entregaId) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('arquivo', file);

    try {
      await axios.post(`/api/entregas/enviar/${entregaId}`, formData);
      setMensagem('Arquivo enviado com sucesso!');
      fetchEntregas();
    } catch (error) {
      setMensagem('Erro ao enviar o arquivo.');
      console.error(error);
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">Entregas</h2>
      {mensagem && <Alert variant="info">{mensagem}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Prazo</th>
            <th>Status</th>
            <th>Feedback</th>
            <th>Entrega</th>
          </tr>
        </thead>
        <tbody>
          {entregas.map((entrega) => (
            <tr key={entrega.id}>
              <td>{entrega.descricao}</td>
              <td>{new Date(entrega.prazo).toLocaleDateString()}</td>
              <td>{entrega.status}</td>
              <td>{entrega.feedback || 'Nenhum'}</td>
              <td>
                <Form.Group controlId={`upload-${entrega.id}`} className="mb-2">
                  <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
                </Form.Group>
                <Button variant="primary" onClick={() => handleUpload(entrega.id)}>Enviar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Entregas;

