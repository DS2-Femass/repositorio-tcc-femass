CREATE TABLE IF NOT EXISTS professor_tcc(
    id UUID PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    CONSTRAINT fk_id_professor_tcc FOREIGN KEY (id) REFERENCES pessoa(id)
);