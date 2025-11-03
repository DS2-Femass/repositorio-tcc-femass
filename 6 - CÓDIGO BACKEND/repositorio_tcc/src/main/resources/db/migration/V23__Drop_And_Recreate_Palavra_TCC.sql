-- Remove foreign keys se existirem
ALTER TABLE IF EXISTS palavra_TCC 
DROP CONSTRAINT IF EXISTS fk_palavra_tcc_tcc;

ALTER TABLE IF EXISTS palavra_TCC 
DROP CONSTRAINT IF EXISTS fk_palavra_tcc_palavra_chave;

-- Remove a tabela
DROP TABLE IF EXISTS palavra_TCC;

-- Recria sem a coluna id
CREATE TABLE IF NOT EXISTS palavra_TCC(
    tcc_id UUID NOT NULL,
    palavra_chave_id UUID NOT NULL,
    PRIMARY KEY (tcc_id, palavra_chave_id)
);

-- Adiciona foreign keys
ALTER TABLE palavra_TCC
ADD CONSTRAINT fk_palavra_tcc_tcc FOREIGN KEY (tcc_id) REFERENCES tcc(id) ON DELETE CASCADE;

ALTER TABLE palavra_TCC
ADD CONSTRAINT fk_palavra_tcc_palavra_chave FOREIGN KEY (palavra_chave_id) REFERENCES palavra_chave(id) ON DELETE CASCADE;


