import React, { createContext, useState } from 'react';

// Criar o Contexto
const PasswordModalContext = createContext();

// Provedor do contexto
export const PasswordModalProvider = ({ children }) => {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <PasswordModalContext.Provider value={{ showModal, openModal, closeModal }}>
            {children}
        </PasswordModalContext.Provider>
    );
};

export default PasswordModalContext;