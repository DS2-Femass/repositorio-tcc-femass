CREATE TABLE IF NOT EXISTS turma (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);
