ALTER TABLE TCC
ALTER COLUMN id_curso TYPE UUID USING gen_random_uuid();

ALTER TABLE TCC
    ALTER COLUMN id_curso SET DEFAULT gen_random_uuid();

ALTER TABLE TCC
    ADD CONSTRAINT fk_tcc_curso FOREIGN KEY (id_curso) REFERENCES curso(id);