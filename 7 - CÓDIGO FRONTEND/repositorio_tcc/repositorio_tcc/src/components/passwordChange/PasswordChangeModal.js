import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PasswordModalContext from './PasswordModalContext'; // O contexto que criamos
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for default styles

const PasswordChangeModal = () => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const invalidInput = (input) => {
        input.focus();
        input.classList.add('is-invalid');
        input.addEventListener('input', function(){
            input.classList.remove('is-invalid');
        });
    }

    const showMessage = (type, message) => {
        const container = document.getElementById('containerMessage');
        if(type === 'success') {
            container.classList.add('alert-success');
            container.innerHTML = '<strong>Sucesso: </strong>';
        } else {
            container.classList.add('alert-danger');
            container.innerHTML = '<strong>Erro: </strong>';
        }
        container.classList.remove('d-none');
        container.innerHTML += message;
        setTimeout(() => {
            container.classList.add('d-none');
        }, 4000);
    }

    const translateMessage = (message) => {
        switch(message) {
            case 'Wrong password': return 'Senha atual inválida.';
            case 'New passwords do not match': return 'As senhas não combinam.';
            default: return 'Erro ao alterar a senha.';
        }
    }

    const clearState = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // Adicione a lógica de envio do formulário aqui

        if(event.target.checkValidity() === false) { return; }

        if (newPassword !== confirmPassword) {
            invalidInput(document.getElementById('confirmPassword'));
            return;
        }

        const url = window.server + '/auth/changePassword';

        const payload = {
            currentPassword,
            newPassword,
            confirmPassword
        };

        // Exemplo de envio do payload para o servidor
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                return response.json()
                    .then(data => {
                        sessionStorage.setItem('token', data.token);
                        sessionStorage.removeItem('mustChangePassword');
                        toast.success('Senha alterada com sucesso!', {
                            position: "top-right",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          });
                        setTimeout(() => {
                            clearState();
                            window.location.reload(); // Recarrega a página atual
                        }, 2000);
                    });
            } else{
                return response.json()
                    .then(data => {
                        showMessage('error', translateMessage(data.message));
                    });
            }
        })
        .catch(error => {
            toast.error('Erro ao alterar senha.', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
        });
    };

    return (
        <PasswordModalContext.Consumer>
            {({ showModal }) => (
                <Modal show={showModal} centered size='lg' backdrop="static" keyboard={false}>
                    <ToastContainer />
                    <Modal.Header>
                        <Modal.Title>Alteração de Senha Necessária</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={handleSubmit}> 
                        <Modal.Body>
                            <p>Seu acesso foi negado. É necessário alterar sua senha para continuar.</p>
                            
                                <div className="mb-3">
                                    <label htmlFor="" className="form-label">Senha atual:</label>
                                    <input type="password" className="form-control" name="currentPassword" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="" className="form-label">Nova senha:</label>
                                    <input type="password" className="form-control" name="newPassword" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="" className="form-label">Confirmar senha:</label>
                                    <input type="password" className="form-control" name="confirmPassword" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                    />
                                    <div className="invalid-feedback">As senhas não combinam</div>
                                </div>
                                <div className="alert d-none" role="alert" id="containerMessage">
                                    <strong>Negado.</strong> Senha atual inválida.
                                </div>
                                
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" type='submit'>
                                Alterar Senha
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            )}
        </PasswordModalContext.Consumer>
    );
};

export default PasswordChangeModal;