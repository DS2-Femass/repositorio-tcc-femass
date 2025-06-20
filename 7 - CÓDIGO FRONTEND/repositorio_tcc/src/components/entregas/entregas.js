import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Table, Alert } from 'react-bootstrap';

const Entregas = () => {
  const [entregas, setEntregas] = useState([]);
  const [file, setFile] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [erroArquivo, setErroArquivo] = useState('');

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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedFormats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    // 🔹 Validação do tipo de arquivo
    if (selectedFile && !allowedFormats.includes(selectedFile.type)) {
      setErroArquivo('Formato inválido! Apenas arquivos PDF, Word (.docx) e Excel (.xlsx) são permitidos.');
      setFile(null);
      return;
    }

    setErroArquivo('');
    setFile(selectedFile);
  };

  const handleUpload = async (entregaId) => {
    if (!file) {
      setErroArquivo('Por favor, selecione um arquivo válido antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('arquivo', file);

    try {
      await axios.post(`/api/entregas/enviar/${entregaId}`, formData);
      setMensagem('Arquivo enviado com sucesso!');
      setFile(null);  // 🔹 Limpa o campo de upload após envio
      fetchEntregas(); // 🔹 Atualiza a lista de entregas após o envio
    } catch (error) {
      setMensagem('Erro ao enviar o arquivo.');
      console.error(error);
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">Entregas</h2>
      
      {/* 🔹 Mensagem de sucesso ou erro */}
      {mensagem && <Alert variant="info">{mensagem}</Alert>}
      {erroArquivo && <Alert variant="danger">{erroArquivo}</Alert>}

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
                {/* 🔹 Campo para upload de arquivo */}
                <Form.Group controlId={`upload-${entrega.id}`} className="mb-2">
                  <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>

                {/* 🔹 Botão para enviar o arquivo */}
                <Button variant="primary" onClick={() => handleUpload(entrega.id)}>
                  Enviar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Entregas;

