CREATE TABLE IF NOT EXISTS atividade (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    descricao TEXT NOT NULL,
    data_entrega DATE NOT NULL,
    turma_id UUID NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_atividade_turma FOREIGN KEY (turma_id) REFERENCES turma(id) ON DELETE CASCADE
);
