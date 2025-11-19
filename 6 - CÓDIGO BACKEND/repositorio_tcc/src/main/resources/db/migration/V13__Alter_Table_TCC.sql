ALTER TABLE TCC
ADD COLUMN id_Subcategoria UUID,
ADD CONSTRAINT fk_tcc_subcategoria FOREIGN KEY (id_Subcategoria) REFERENCES subcategoria(id);
