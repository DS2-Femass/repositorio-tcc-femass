-- Add foreign key constraints to palavra_TCC table
ALTER TABLE palavra_TCC 
ADD CONSTRAINT fk_palavra_tcc_tcc 
FOREIGN KEY (tcc_id) REFERENCES tcc(id) ON DELETE CASCADE;

ALTER TABLE palavra_TCC 
ADD CONSTRAINT fk_palavra_tcc_palavra_chave 
FOREIGN KEY (palavra_chave_id) REFERENCES palavra_chave(id) ON DELETE CASCADE;

