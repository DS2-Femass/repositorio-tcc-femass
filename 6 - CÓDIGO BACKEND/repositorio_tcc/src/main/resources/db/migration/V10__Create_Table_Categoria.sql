CREATE TABLE IF NOT EXISTS categoria(
    id UUID PRIMARY KEY,
    nome_categoria VARCHAR(50) NOT NULL UNIQUE,
    descricao_categoria TEXT NOT NULL
);