import React, { useState } from 'react'; // Importa o React e o hook useState para gerenciar estados
import { Container, Form, Button } from 'react-bootstrap'; // Importa componentes do Bootstrap para estilização
import { ToastContainer, toast } from 'react-toastify'; // Toastify para exibir mensagens de erro ou sucesso
import Navbar from '../navbar/Navbar'; // Importa a Navbar para manter a identidade visual do sistema

const SolicitarOrientador = () => {
    // Define os estados para armazenar as informações do formulário
    const [nomeOrientador, setNomeOrientador] = useState('');
    const [temaTCC, setTemaTCC] = useState('');

    // Função que lida com a submissão do formulário
    const handleSubmit = (event) => {
        event.preventDefault(); // Evita a recarga da página ao enviar o formulário

        // Validação: Verifica se os campos obrigatórios estão preenchidos
        if (!nomeOrientador || !temaTCC) {
            toast.error('Preencha todos os campos antes de enviar.'); // Exibe uma mensagem de erro
            return;
        }

        toast.success('Solicitação enviada com sucesso!'); // Exibe uma mensagem de sucesso
        setNomeOrientador(''); // Limpa o campo de nome do orientador após o envio
        setTemaTCC(''); // Limpa o campo de tema do TCC após o envio
    };

    return (
        <div className="tcc-page bg-light min-vh-100"> 
            {/* Define o background claro e ocupa toda a altura da tela */}
            <Navbar /> {/* Exibe a barra de navegação padrão */}

            <ToastContainer /> {/* Adiciona o contêiner para exibir notificações do Toastify */}

            <Container className="mt-5"> 
                {/* Define um contêiner centralizado com margem superior */}
                <div className="bg-white shadow-sm rounded p-5"> 
                    {/* Cria um bloco visual arredondado, com sombra e padding para parecer um documento */}
                    <h2 className="text-primary text-center">Enviar Convite para Orientador</h2> 
                    {/* Título estilizado */}
                    
                    <Form onSubmit={handleSubmit}> 
                        {/* Formulário para envio da solicitação */}

                        <div className="row mb-4">
                            <div className="col-12">
                                <Form.Group className="mb-3"> 
                                    {/* Agrupamento do campo "Nome do Orientador" */}
                                    <Form.Label className="fw-bold">Professor:</Form.Label> 
                                    {/* Define o rótulo com negrito */}
                                    <Form.Select 
                                        value={nomeOrientador} 
                                        onChange={(e) => setNomeOrientador(e.target.value)}
                                    >
                                        {/* Dropdown para selecionar um orientador */}
                                        <option value="">Selecione um orientador...</option>
                                        <option value="Prof. João Silva">Prof. Irineu de Azevedo</option>
                                        <option value="Prof. Maria Oliveira">Prof. Afonso Carlos</option>
                                        <option value="Prof. Carlos Mendes">Prof. Isac Mendes </option>
                                        <option value="Prof. Carlos Mendes">Prof. Lahir Buckorni </option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-12">
                                <Form.Group className="mb-3">
                                    {/* Agrupamento do campo "Tema do TCC" */}
                                    <Form.Label className="fw-bold">Tema do TCC:</Form.Label>
                                    {/* Define o rótulo com negrito */}
                                    <Form.Control 
                                        as="textarea" 
                                        rows={4} 
                                        placeholder="Descreva o tema do seu TCC" 
                                        value={temaTCC} 
                                        onChange={(e) => setTemaTCC(e.target.value)}
                                    />
                                    {/* Campo de texto para que o aluno descreva seu TCC */}
                                </Form.Group>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            {/* Centraliza o botão de envio */}
                            <Button variant="primary" className="px-4" type="submit">
                                {/* Botão azul estilizado para envio */}
                                Enviar Convite
                            </Button>
                        </div>
                    </Form>
                </div>
            </Container>
        </div>
    );
};

export default SolicitarOrientador;
