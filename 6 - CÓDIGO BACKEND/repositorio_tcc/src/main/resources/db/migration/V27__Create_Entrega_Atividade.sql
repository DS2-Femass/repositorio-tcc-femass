CREATE TABLE IF NOT EXISTS entrega_atividade (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    atividade_id UUID NOT NULL,
    aluno_id UUID NOT NULL,
    data_realizacao DATE,
    nota NUMERIC(4, 1),
    arquivo_nome VARCHAR(255),
    arquivo_caminho VARCHAR(500),
    PRIMARY KEY (id),
    CONSTRAINT fk_entrega_atividade FOREIGN KEY (atividade_id) REFERENCES atividade(id) ON DELETE CASCADE,
    CONSTRAINT fk_entrega_aluno FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE,
    CONSTRAINT uq_entrega_atividade_aluno UNIQUE (atividade_id, aluno_id)
);
