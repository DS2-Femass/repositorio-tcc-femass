import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { AtividadeService } from '../../service/AtividadeService';
import { EntregaAtividadeService } from '../../service/EntregaAtividadeService';
import { TurmaService } from '../../service/TurmaService';
import { AlunoService } from '../../service/AlunoService';

function withNavigate(Component) {
    return (props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class Atividade extends Component {

    state = {
        role: sessionStorage.getItem('role') || 'USER',

        // dados exibidos na tabela
        itens: [],

        // opções de turmas (professor)
        turmas: [],
        selectedTurmaId: '',
        alunosDaTurma: [],

        // formulário professor: nova atividade
        showModalCreate: false,
        descricao: '',
        dataEntrega: '',

        // formulário professor: editar atividade
        showModalEdit: false,
        toEditAtividade: null,

        // modal deletar atividade (professor)
        showModalDeletion: false,
        toDeleteAtividade: null,

        // modal lançar nota (professor)
        showModalNota: false,
        toNotaItem: null,
        notaInput: '',

        // modal upload arquivo (aluno)
        showModalEntrega: false,
        toEntregarAtividade: null,
        arquivoSelecionado: null,
    }

    atividadeService = new AtividadeService();
    entregaService = new EntregaAtividadeService();
    turmaService = new TurmaService();
    alunoService = new AlunoService();

    componentDidMount() {
        const role = sessionStorage.getItem('role') || 'USER';
        this.setState({ role });

        if (role === 'MODERATOR' || role === 'ADMIN') {
            this.turmaService.listAll()
                .then(res => this.setState({ turmas: res.data }))
                .catch(() => toast.error('Erro ao carregar turmas', { position: "top-right", autoClose: 2000 }));
        } else {
            this.loadMinhasAtividades();
        }
    }

    loadMinhasAtividades = () => {
        this.atividadeService.findMine()
            .then(res => this.setState({ itens: res.data }))
            .catch(() => toast.error('Erro ao carregar atividades', { position: "top-right", autoClose: 2000 }));
    }

    handleTurmaChange = (event) => {
        const turmaId = event.target.value;
        this.setState({ selectedTurmaId: turmaId, itens: [], alunosDaTurma: [] });
        if (turmaId) {
            this.atividadeService.findByTurma(turmaId)
                .then(res => this.setState({ itens: res.data }))
                .catch(() => toast.error('Erro ao carregar atividades da turma', { position: "top-right", autoClose: 2000 }));
            this.alunoService.findByTurma(turmaId)
                .then(res => this.setState({ alunosDaTurma: res.data }))
                .catch((err) => {
                    console.error('Erro /alunos/turma:', err.response?.data);
                    toast.error('Erro ao carregar alunos da turma', { position: "top-right", autoClose: 2000 });
                });
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // ---- PROFESSOR: Nova Atividade ----
    beginInsertion = () => {
        this.setState({ showModalCreate: true, descricao: '', dataEntrega: '' });
    }

    submitCreate = (event) => {
        event.preventDefault();
        if (!this.state.descricao.trim() || !this.state.dataEntrega || !this.state.selectedTurmaId) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }
        const data = {
            descricao: this.state.descricao,
            dataEntrega: this.state.dataEntrega,
            idTurma: this.state.selectedTurmaId,
        };
        this.atividadeService.insert(data)
            .then(() => {
                toast.success('Atividade criada com sucesso!', { position: "top-right", autoClose: 2000 });
                this.closeModal('Create');
                this.handleTurmaChange({ target: { value: this.state.selectedTurmaId } });
            })
            .catch(() => toast.error('Erro ao criar atividade', { position: "top-right", autoClose: 2000 }));
    }

    // ---- PROFESSOR: Editar Atividade ----
    beginEdit = (item) => {
        this.setState({
            showModalEdit: true,
            toEditAtividade: item,
            descricao: item.descricao,
            dataEntrega: item.dataEntrega,
        });
    }

    submitEdit = (event) => {
        event.preventDefault();
        const data = {
            descricao: this.state.descricao,
            dataEntrega: this.state.dataEntrega,
        };
        this.atividadeService.update(this.state.toEditAtividade.idAtividade, data)
            .then(() => {
                toast.success('Atividade atualizada!', { position: "top-right", autoClose: 2000 });
                this.closeModal('Edit');
                this.handleTurmaChange({ target: { value: this.state.selectedTurmaId } });
            })
            .catch(() => toast.error('Erro ao atualizar atividade', { position: "top-right", autoClose: 2000 }));
    }

    // ---- PROFESSOR: Excluir Atividade ----
    beginDeletion = (item) => {
        this.setState({ toDeleteAtividade: item, showModalDeletion: true });
    }

    delete = () => {
        this.atividadeService.delete(this.state.toDeleteAtividade.idAtividade)
            .then(() => {
                toast.success('Atividade excluída!', { position: "top-right", autoClose: 2000 });
                this.closeModal('Deletion');
                this.handleTurmaChange({ target: { value: this.state.selectedTurmaId } });
            })
            .catch(() => toast.error('Erro ao excluir atividade', { position: "top-right", autoClose: 2000 }));
    }

    // ---- PROFESSOR: Lançar Nota ----
    beginLancarNota = (item) => {
        this.setState({
            showModalNota: true,
            toNotaItem: item,
            notaInput: item.nota !== null && item.nota !== undefined ? String(item.nota) : ''
        });
    }

    submitNota = (event) => {
        event.preventDefault();
        const nota = parseFloat(this.state.notaInput);
        if (isNaN(nota) || nota < 0 || nota > 10) {
            toast.error('A nota deve ser entre 0 e 10');
            return;
        }
        this.entregaService.lancarNota(this.state.toNotaItem.idEntrega, nota)
            .then(() => {
                toast.success('Nota lançada com sucesso!', { position: "top-right", autoClose: 2000 });
                this.closeModal('Nota');
                this.handleTurmaChange({ target: { value: this.state.selectedTurmaId } });
            })
            .catch(() => toast.error('Erro ao lançar nota', { position: "top-right", autoClose: 2000 }));
    }

    // ---- ALUNO: Entregar Atividade ----
    beginEntrega = (item) => {
        this.setState({ showModalEntrega: true, toEntregarAtividade: item, arquivoSelecionado: null });
    }

    handleArquivoChange = (event) => {
        this.setState({ arquivoSelecionado: event.target.files[0] });
    }

    submitEntrega = (event) => {
        event.preventDefault();
        const { toEntregarAtividade, arquivoSelecionado } = this.state;
        const atividadeId = toEntregarAtividade.idAtividade || toEntregarAtividade.id;

        this.entregaService.entregar(atividadeId, arquivoSelecionado)
            .then(() => {
                toast.success('Entrega realizada com sucesso!', { position: "top-right", autoClose: 2000 });
                this.closeModal('Entrega');
                this.loadMinhasAtividades();
            })
            .catch(() => toast.error('Erro ao realizar entrega', { position: "top-right", autoClose: 2000 }));
    }

    // ---- Download de Arquivo ----
    downloadArquivo = (item) => {
        if (!item.idEntrega && !item.id) {
            toast.warning('Sem entrega registrada');
            return;
        }
        const entregaId = item.idEntrega || item.id;
        this.entregaService.downloadArquivo(entregaId)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', item.arquivoNome || 'arquivo');
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(() => toast.error('Erro ao baixar arquivo', { position: "top-right", autoClose: 2000 }));
    }

    closeModal = (operationName) => {
        this.setState({
            ['showModal' + operationName]: false,
            toEditAtividade: null,
            toDeleteAtividade: null,
            toNotaItem: null,
            toEntregarAtividade: null,
            descricao: '',
            dataEntrega: '',
            notaInput: '',
            arquivoSelecionado: null,
        });
    }

    formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    }

    render() {
        const { role, itens, turmas, selectedTurmaId, alunosDaTurma } = this.state;
        const isProfessor = role === 'MODERATOR' || role === 'ADMIN';

        // Para view professor: agrupa por atividade para identificar linhas únicas para ações de editar/excluir
        // A tabela é flat (cada linha = 1 aluno x 1 atividade)
        const uniqueAtividades = isProfessor
            ? [...new Map(itens.map(i => [i.idAtividade, i])).values()]
            : [];

        return (
            <div className="tcc-page bg-light min-vh-100">
                <Navbar />
                <ToastContainer />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='page-content container-fluid px-4'
                >
                    <div className="row mb-4 mt-4">
                        <div className="col-12">
                            <h1 className='display-5 fw-bold mb-4 tittle tittleAfter'>Atividades</h1>
                        </div>
                    </div>

                    {/* ===== VIEW PROFESSOR ===== */}
                    {isProfessor && (
                        <>
                            <div className="row align-items-end mb-4">
                                <div className="col-md-5 mb-2">
                                    <label htmlFor="selectTurma" className="form-label fw-semibold">Selecionar Turma</label>
                                    <select
                                        className="form-select"
                                        id="selectTurma"
                                        value={selectedTurmaId}
                                        onChange={this.handleTurmaChange}
                                    >
                                        <option value="">-- Selecione uma turma --</option>
                                        {turmas.map(t => (
                                            <option key={t.id} value={t.id}>{t.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto mb-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn btn-primary btn-lg d-flex align-items-center new-tcc-button styled-button"
                                        onClick={this.beginInsertion}
                                        disabled={!selectedTurmaId}
                                    >
                                        <i className="bi bi-file-earmark-plus fs-4 me-2"></i>
                                        <span>Nova Atividade</span>
                                    </motion.button>
                                </div>
                            </div>

                            {selectedTurmaId && (
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header bg-secondary text-white d-flex align-items-center justify-content-between">
                                                <span className="fw-semibold">
                                                    <i className="bi bi-people-fill me-2"></i>
                                                    Alunos Matriculados
                                                </span>
                                                <span className="badge bg-light text-dark">{alunosDaTurma.length}</span>
                                            </div>
                                            <div className="card-body p-3">
                                                {alunosDaTurma.length === 0 ? (
                                                    <p className="text-muted mb-0 text-center py-2">Nenhum aluno matriculado nesta turma</p>
                                                ) : (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {alunosDaTurma.map(aluno => (
                                                            <span key={aluno.id} className="badge bg-light text-dark border px-3 py-2" style={{ fontSize: '0.85rem' }}>
                                                                <i className="bi bi-person me-1"></i>
                                                                {aluno.nomeCompleto}
                                                                <span className="ms-1 text-muted" style={{ fontSize: '0.75rem' }}>({aluno.matricula})</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedTurmaId && (
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-body p-4">
                                                <div className="table-responsive">
                                                    <table className="table table-hover table-sm">
                                                        <thead className="table-dark">
                                                            <tr>
                                                                <th>Atividade</th>
                                                                <th>Prazo</th>
                                                                <th>Aluno</th>
                                                                <th>Data de Entrega</th>
                                                                <th>Nota</th>
                                                                <th>Arquivo</th>
                                                                <th className="text-end">Ações</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {itens.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan="7" className="text-center text-muted py-5">
                                                                        Nenhum dado encontrado para esta turma
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                itens.map((item, idx) => (
                                                                    <tr key={`${item.idAtividade}-${item.idAluno}`}>
                                                                        <td>
                                                                            <span className="fw-semibold">{item.descricao}</span>
                                                                        </td>
                                                                        <td>{this.formatDate(item.dataEntrega)}</td>
                                                                        <td>{item.nomeAluno}</td>
                                                                        <td>
                                                                            {/* {item.dataRealizacao
                                                                                ? <span className="badge bg-success">{this.formatDate(item.dataRealizacao)}</span>
                                                                                : <span className="badge bg-secondary">Pendente</span>
                                                                            } */}

                                                                            {!item.dataRealizacao
                                                                                ? <span className="badge bg-secondary">Pendente</span>
                                                                                : new Date(item.dataRealizacao) <= new Date(item.dataEntrega)
                                                                                    ? <span className="badge bg-success">{this.formatDate(item.dataRealizacao)}</span>
                                                                                    : <span className="badge bg-danger">{this.formatDate(item.dataRealizacao)}</span>
    }
                                                                        </td>
                                                                        <td>
                                                                            {item.nota !== null && item.nota !== undefined
                                                                                ? <span className="badge bg-primary">{item.nota}</span>
                                                                                : '-'
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {item.arquivoNome
                                                                                ? (
                                                                                    <button
                                                                                        className="btn btn-sm btn-outline-secondary"
                                                                                        onClick={() => this.downloadArquivo(item)}
                                                                                        title={item.arquivoNome}
                                                                                    >
                                                                                        <i className="bi bi-download me-1"></i>
                                                                                        {item.arquivoNome.length > 15
                                                                                            ? item.arquivoNome.substring(0, 15) + '...'
                                                                                            : item.arquivoNome}
                                                                                    </button>
                                                                                )
                                                                                : '-'
                                                                            }
                                                                        </td>
                                                                        <td className="text-end">
                                                                            {/* Botões de atividade: mostrar apenas na primeira linha do grupo */}
                                                                            {(idx === 0 || itens[idx - 1]?.idAtividade !== item.idAtividade) && (
                                                                                <>
                                                                                    <button
                                                                                        className="btn btn-sm btn-outline-primary me-1"
                                                                                        onClick={() => this.beginEdit(item)}
                                                                                        title="Editar atividade"
                                                                                    >
                                                                                        <i className="bi bi-pencil"></i>
                                                                                    </button>
                                                                                    <button
                                                                                        className="btn btn-sm btn-outline-danger me-1"
                                                                                        onClick={() => this.beginDeletion(item)}
                                                                                        title="Excluir atividade"
                                                                                    >
                                                                                        <i className="bi bi-trash"></i>
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                            {item.idEntrega && (
                                                                                <button
                                                                                    className="btn btn-sm btn-outline-success"
                                                                                    onClick={() => this.beginLancarNota(item)}
                                                                                    title="Lançar nota"
                                                                                >
                                                                                    <i className="bi bi-star"></i>
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ===== VIEW ALUNO ===== */}
                    {!isProfessor && (
                        <div className="row">
                            <div className="col-12">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body p-4">
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th>Atividade</th>
                                                        <th>Prazo</th>
                                                        <th>Data de Entrega</th>
                                                        <th>Nota</th>
                                                        <th>Arquivo</th>
                                                        <th className="text-end">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {itens.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="6" className="text-center text-muted py-5">
                                                                Nenhuma atividade encontrada
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        itens.map((item) => (
                                                            <tr key={item.idAtividade || item.id}>
                                                                <td>{item.descricaoAtividade}</td>
                                                                <td>{this.formatDate(item.dataEntrega)}</td>
                                                                <td>
                                                                    {item.dataRealizacao
                                                                        ? <span className="badge bg-success">{this.formatDate(item.dataRealizacao)}</span>
                                                                        : <span className="badge bg-warning text-dark">Pendente</span>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {item.nota !== null && item.nota !== undefined
                                                                        ? <span className="badge bg-primary">{item.nota}</span>
                                                                        : '-'
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {item.arquivoNome
                                                                        ? (
                                                                            <button
                                                                                className="btn btn-sm btn-outline-secondary"
                                                                                onClick={() => this.downloadArquivo(item)}
                                                                            >
                                                                                <i className="bi bi-download me-1"></i>
                                                                                {item.arquivoNome}
                                                                            </button>
                                                                        )
                                                                        : '-'
                                                                    }
                                                                </td>
                                                                <td className="text-end">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => this.beginEntrega(item)}
                                                                    >
                                                                        <i className="bi bi-upload me-1"></i>
                                                                        {item.dataRealizacao ? 'Reenviar' : 'Entregar'}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* ===== MODAIS ===== */}
                <div id='modals'>
                    {/* Modal Nova Atividade (Professor) */}
                    <AnimatePresence>
                        {this.state.showModalCreate && (
                            <Modal show={this.state.showModalCreate} onHide={() => this.closeModal('Create')} centered>
                                <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                    <Modal.Title>Nova Atividade</Modal.Title>
                                </Modal.Header>
                                <form onSubmit={this.submitCreate}>
                                    <Modal.Body>
                                        <div className="mb-3">
                                            <label className="form-label">Descrição *</label>
                                            <textarea
                                                className="form-control"
                                                name="descricao"
                                                rows={4}
                                                placeholder="Descreva a tarefa..."
                                                value={this.state.descricao}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Data de Entrega *</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="dataEntrega"
                                                value={this.state.dataEntrega}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => this.closeModal('Create')}>Cancelar</Button>
                                        <button type='submit' className="btn btn-primary">Criar</button>
                                    </Modal.Footer>
                                </form>
                            </Modal>
                        )}
                    </AnimatePresence>

                    {/* Modal Editar Atividade (Professor) */}
                    <AnimatePresence>
                        {this.state.showModalEdit && (
                            <Modal show={this.state.showModalEdit} onHide={() => this.closeModal('Edit')} centered>
                                <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                    <Modal.Title>Editar Atividade</Modal.Title>
                                </Modal.Header>
                                <form onSubmit={this.submitEdit}>
                                    <Modal.Body>
                                        <div className="mb-3">
                                            <label className="form-label">Descrição *</label>
                                            <textarea
                                                className="form-control"
                                                name="descricao"
                                                rows={4}
                                                value={this.state.descricao}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Data de Entrega *</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="dataEntrega"
                                                value={this.state.dataEntrega}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => this.closeModal('Edit')}>Cancelar</Button>
                                        <button type='submit' className="btn btn-primary">Salvar</button>
                                    </Modal.Footer>
                                </form>
                            </Modal>
                        )}
                    </AnimatePresence>

                    {/* Modal Confirmar Exclusão (Professor) */}
                    <AnimatePresence>
                        {this.state.showModalDeletion && (
                            <Modal show={this.state.showModalDeletion} onHide={() => this.closeModal('Deletion')} centered>
                                <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Tem certeza que deseja excluir a atividade "{this.state.toDeleteAtividade?.descricao}"?
                                    Todas as entregas relacionadas também serão excluídas.
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.closeModal('Deletion')}>Cancelar</Button>
                                    <Button variant="danger" onClick={this.delete}>Confirmar Exclusão</Button>
                                </Modal.Footer>
                            </Modal>
                        )}
                    </AnimatePresence>

                    {/* Modal Lançar Nota (Professor) */}
                    <AnimatePresence>
                        {this.state.showModalNota && (
                            <Modal show={this.state.showModalNota} onHide={() => this.closeModal('Nota')} centered>
                                <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                    <Modal.Title>Lançar Nota</Modal.Title>
                                </Modal.Header>
                                <form onSubmit={this.submitNota}>
                                    <Modal.Body>
                                        <p className="mb-1"><strong>Aluno:</strong> {this.state.toNotaItem?.nomeAluno}</p>
                                        <p className="mb-3"><strong>Atividade:</strong> {this.state.toNotaItem?.descricao}</p>
                                        <div className="mb-3">
                                            <label className="form-label">Nota (0 a 10) *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="notaInput"
                                                min="0"
                                                max="10"
                                                step="0.1"
                                                value={this.state.notaInput}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => this.closeModal('Nota')}>Cancelar</Button>
                                        <button type='submit' className="btn btn-success">Lançar Nota</button>
                                    </Modal.Footer>
                                </form>
                            </Modal>
                        )}
                    </AnimatePresence>

                    {/* Modal Entregar Atividade (Aluno) */}
                    <AnimatePresence>
                        {this.state.showModalEntrega && (
                            <Modal show={this.state.showModalEntrega} onHide={() => this.closeModal('Entrega')} centered>
                                <Modal.Header className='bg-dark text-white' closeButton closeVariant='white'>
                                    <Modal.Title>Entregar Atividade</Modal.Title>
                                </Modal.Header>
                                <form onSubmit={this.submitEntrega}>
                                    <Modal.Body>
                                        <p className="mb-3">
                                            <strong>Atividade:</strong> {this.state.toEntregarAtividade?.descricaoAtividade}
                                        </p>
                                        <div className="mb-3">
                                            <label className="form-label">Arquivo de Entrega</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={this.handleArquivoChange}
                                                accept=".pdf,.doc,.docx,.zip,.rar,.pptx,.xlsx"
                                            />
                                            <small className="form-text text-muted">
                                                Formatos aceitos: PDF, Word, ZIP, RAR, PowerPoint, Excel
                                            </small>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => this.closeModal('Entrega')}>Cancelar</Button>
                                        <button type='submit' className="btn btn-primary">
                                            <i className="bi bi-upload me-1"></i>Enviar Entrega
                                        </button>
                                    </Modal.Footer>
                                </form>
                            </Modal>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }
}

export default withNavigate(Atividade);
