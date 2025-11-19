create table TCC(
    id uuid,
    id_curso int not null,
    titulo varchar(255) not null,
    resumo text,
    id_orientador uuid not null,
    id_aluno uuid not null,
    constraint fk_tcc_orientador foreign key (id_orientador) references orientador(id),
    constraint fk_tcc_aluno foreign key (id_aluno) references aluno(id)
);