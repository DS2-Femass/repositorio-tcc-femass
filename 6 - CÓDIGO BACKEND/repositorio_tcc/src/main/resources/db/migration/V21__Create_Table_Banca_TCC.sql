CREATE TABLE IF NOT EXISTS banca_tcc(
    id UUID PRIMARY KEY,
    id_orientador UUID NOT NULL,
    id_tcc UUID NOT NULL,
    CONSTRAINT fk_banca_tcc_orientador FOREIGN KEY (id_orientador) REFERENCES orientador(id),
    CONSTRAINT fk_banca_tcc_tcc FOREIGN KEY (id_tcc) REFERENCES tcc(id)
);