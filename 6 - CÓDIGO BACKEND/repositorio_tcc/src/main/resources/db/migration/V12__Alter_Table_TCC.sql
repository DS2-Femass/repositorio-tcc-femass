ALTER TABLE TCC
ADD COLUMN id_Categoria UUID,
ADD CONSTRAINT fk_tcc_categoria FOREIGN KEY (id_Categoria) REFERENCES categoria(id);
