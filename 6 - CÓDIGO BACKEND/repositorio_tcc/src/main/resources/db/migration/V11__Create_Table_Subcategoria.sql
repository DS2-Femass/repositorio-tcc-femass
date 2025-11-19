CREATE TABLE IF NOT EXISTS subcategoria(
    id UUID PRIMARY KEY,
    nome_subcategoria VARCHAR(50) NOT NULL UNIQUE,
    descricao_subcategoria TEXT NOT NULL,
    id_Categoria UUID NOT NULL,
    CONSTRAINT fk_subcategoria_categoria FOREIGN KEY (id_Categoria) REFERENCES categoria(id)
);