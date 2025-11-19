CREATE TABLE IF NOT EXISTS pessoa(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    telefone VARCHAR(11) NULL,
    user_id UUID,
    ativo BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_person_user FOREIGN KEY (user_id) REFERENCES users(id)
);