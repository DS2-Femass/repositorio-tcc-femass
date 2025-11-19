ALTER TABLE pessoa 
ADD COLUMN curso_id UUID,
ADD CONSTRAINT fk_curso_pessoa FOREIGN KEY (curso_id) REFERENCES curso(id);