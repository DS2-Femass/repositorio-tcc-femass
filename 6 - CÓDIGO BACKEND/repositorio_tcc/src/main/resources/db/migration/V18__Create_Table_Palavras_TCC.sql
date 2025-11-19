CREATE TABLE IF NOT EXISTS palavra_TCC(
    id UUID PRIMARY KEY,
    tcc_id UUID NOT NULL,
    palavra_chave_id UUID NOT NULL
);