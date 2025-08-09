CREATE TABLE solos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(300) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE historico_acessos (
    id SERIAL PRIMARY KEY,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_id INT NOT NULL
);

CREATE TABLE configuracao (
    id SERIAL PRIMARY KEY,
    hora_inicio VARCHAR(19) NOT NULL,
    hora_fim VARCHAR(19) DEFAULT NULL,
    periodicidade TEXT CHECK (periodicidade IN ('MANUAL', 'SEMANAL', '1MES', '2MESES')) DEFAULT NULL,
    data_proxima_atualizacao VARCHAR(10) DEFAULT NULL,
    nome_arquivo VARCHAR(50) DEFAULT NULL,
    servico TEXT CHECK (servico IN ('REFLORA', 'SPECIESLINK')) DEFAULT NULL
);

CREATE TABLE coletores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(200) DEFAULT NULL,
    numero INT DEFAULT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE relevos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(300) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);



CREATE TABLE vegetacoes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(300) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE fase_sucessional (
    numero INT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE paises (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sigla CHAR(4) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE estados (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sigla CHAR(4) DEFAULT NULL,
    codigo_telefone VARCHAR(10) DEFAULT NULL,
    pais_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_estados_paises FOREIGN KEY (pais_id) REFERENCES paises (id)
);

CREATE TABLE cidades (
    id SERIAL PRIMARY KEY,
    estado_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION DEFAULT NULL,
    longitude DOUBLE PRECISION DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_cidades_estados FOREIGN KEY (estado_id) REFERENCES estados (id)
);

CREATE TABLE locais_coleta (
    id SERIAL PRIMARY KEY,
    descricao TEXT,
    cidade_id INT DEFAULT NULL,
    fase_sucessional_id INT DEFAULT NULL,
    complemento TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    fase_numero INT DEFAULT NULL,
    CONSTRAINT fk_locais_coleta_cidades FOREIGN KEY (cidade_id) REFERENCES cidades (id),
    CONSTRAINT fk_locais_coleta_fase_sucessional FOREIGN KEY (fase_sucessional_id) REFERENCES fase_sucessional (numero)
);

CREATE TABLE reinos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    
); 
CREATE TABLE familias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE
    reino_id INT NOT NULL,
);

CREATE TABLE generos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    familia_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_generos_familias FOREIGN KEY (familia_id) REFERENCES familias (id)
);

CREATE TABLE autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    iniciais VARCHAR(200) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE especies (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    autor_id INT DEFAULT NULL,
    genero_id INT,
    familia_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_especies_autor FOREIGN KEY (autor_id) REFERENCES autores (id),
    CONSTRAINT fk_especies_generos FOREIGN KEY (genero_id) REFERENCES generos (id),
    CONSTRAINT fk_especies_familias FOREIGN KEY (familia_id) REFERENCES familias (id)
);

CREATE TABLE variedades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    autor_id INT DEFAULT NULL,
    especie_id INT NOT NULL,
    genero_id INT DEFAULT NULL,
    familia_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_variedades_autor FOREIGN KEY (autor_id) REFERENCES autores (id),
    CONSTRAINT fk_variedades_especies FOREIGN KEY (especie_id) REFERENCES especies (id),
    CONSTRAINT fk_variedades_familia FOREIGN KEY (familia_id) REFERENCES familias (id),
    CONSTRAINT fk_variedades_genero FOREIGN KEY (genero_id) REFERENCES generos (id)
);

CREATE TABLE sub_especies (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    especie_id INT NOT NULL,
    genero_id INT DEFAULT NULL,
    familia_id INT NOT NULL,
    autor_id INT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_sub_especies_autor FOREIGN KEY (autor_id) REFERENCES autores (id),
    CONSTRAINT fk_sub_especies_especie FOREIGN KEY (especie_id) REFERENCES especies (id),
    CONSTRAINT fk_sub_especies_genero FOREIGN KEY (genero_id) REFERENCES generos (id),
    CONSTRAINT fk_sub_especies_familia FOREIGN KEY (familia_id) REFERENCES familias (id)
);

CREATE TABLE sub_familias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(300) NOT NULL,
    familia_id INT NOT NULL,
    autor_id INT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_sub_familias_autor FOREIGN KEY (autor_id) REFERENCES autores (id),
    CONSTRAINT fk_sub_familias_familia FOREIGN KEY (familia_id) REFERENCES familias (id)
);

CREATE TABLE colecoes_anexas (
    id SERIAL PRIMARY KEY,
    tipo TEXT CHECK (tipo IN ('CARPOTECA', 'XILOTECA', 'VIA LIQUIDA')) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE enderecos (
    id SERIAL PRIMARY KEY,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(10) DEFAULT NULL,
    complemento TEXT,
    cidade_id INT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_enderecos_cidades FOREIGN KEY (cidade_id) REFERENCES cidades (id)
);

CREATE TABLE herbarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    caminho_logotipo TEXT,
    sigla VARCHAR(80) NOT NULL,
    email VARCHAR(200) DEFAULT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    endereco_id INT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_herbarios_enderecos FOREIGN KEY (endereco_id) REFERENCES enderecos (id)
);

CREATE TABLE telefones (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(200) NOT NULL,
    herbario_id INT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_telefones_herbarios FOREIGN KEY (herbario_id) REFERENCES herbarios (id)
);

CREATE TABLE remessas (
    id SERIAL,
    observacao TEXT,
    data_envio TIMESTAMP DEFAULT NULL,
    entidade_destino_id INT NOT NULL,
    herbario_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, herbario_id),
    CONSTRAINT fk_remessa_herbarios FOREIGN KEY (herbario_id) REFERENCES herbarios (id)
);

CREATE TABLE tipos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(250) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE identificadores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tombos (
    hcf SERIAL PRIMARY KEY,
    data_tombo TIMESTAMP DEFAULT NOW(),
    data_coleta_dia INT DEFAULT NULL,
    observacao TEXT,
    nomes_populares TEXT,
    numero_coleta INT DEFAULT NULL,
    latitude DOUBLE PRECISION DEFAULT NULL,
    longitude DOUBLE PRECISION DEFAULT NULL,
    altitude DOUBLE PRECISION DEFAULT NULL,
    entidade_id INT DEFAULT NULL,
    local_coleta_id INT DEFAULT NULL,
    variedade_id INT DEFAULT NULL,
    tipo_id INT DEFAULT NULL,
    data_identificacao_dia INT DEFAULT NULL,
    data_identificacao_mes INT DEFAULT NULL,
    data_identificacao_ano INT DEFAULT NULL,
    situacao TEXT CHECK (situacao IN ('REGULAR', 'PERMUTA', 'EMPRESTIMO', 'DOACAO')) DEFAULT 'REGULAR',
    especie_id INT DEFAULT NULL,
    genero_id INT DEFAULT NULL,
    familia_id INT DEFAULT NULL,
    sub_familia_id INT DEFAULT NULL,
    sub_especie_id INT DEFAULT NULL,
    nome_cientifico TEXT,
    colecao_anexa_id INT DEFAULT NULL,
    cor TEXT CHECK (cor IN ('VERMELHO', 'VERDE', 'AZUL')) DEFAULT NULL,
    data_coleta_mes SMALLINT DEFAULT NULL,
    data_coleta_ano SMALLINT DEFAULT NULL,
    solo_id INT DEFAULT NULL,
    relevo_id INT DEFAULT NULL,
    vegetacao_id INT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE,
    taxon VARCHAR(45) DEFAULT NULL,
    rascunho BOOLEAN DEFAULT FALSE,
    coletor_id INT DEFAULT NULL,

    -- Foreign Keys
    CONSTRAINT fk_tombos_entidade FOREIGN KEY (entidade_id) REFERENCES herbarios (id),
    CONSTRAINT fk_tombos_colecoes FOREIGN KEY (colecao_anexa_id) REFERENCES colecoes_anexas (id),
    CONSTRAINT fk_tombos_especies FOREIGN KEY (especie_id) REFERENCES especies (id),
    CONSTRAINT fk_tombos_familias FOREIGN KEY (familia_id) REFERENCES familias (id),
    CONSTRAINT fk_tombos_generos FOREIGN KEY (genero_id) REFERENCES generos (id),
    CONSTRAINT fk_tombos_locais FOREIGN KEY (local_coleta_id) REFERENCES locais_coleta (id),
    CONSTRAINT fk_tombos_sub_especies FOREIGN KEY (sub_especie_id) REFERENCES sub_especies (id),
    CONSTRAINT fk_tombos_sub_familias FOREIGN KEY (sub_familia_id) REFERENCES sub_familias (id),
    CONSTRAINT fk_tombos_tipos FOREIGN KEY (tipo_id) REFERENCES tipos (id),
    CONSTRAINT fk_tombos_solos FOREIGN KEY (solo_id) REFERENCES solos (id),
    CONSTRAINT fk_tombos_relevos FOREIGN KEY (relevo_id) REFERENCES relevos (id),
    CONSTRAINT fk_tombos_vegetacoes FOREIGN KEY (vegetacao_id) REFERENCES vegetacoes (id),
    CONSTRAINT fk_tombos_coletores FOREIGN KEY (coletor_id) REFERENCES coletores (id)
);


CREATE TABLE coletores_complementares (
    hcf INT PRIMARY KEY,
    complementares VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_coletores_complementares_tombos FOREIGN KEY (hcf) REFERENCES tombos (hcf)
);

CREATE TABLE tombos_identificadores (
    identificador_id INT NOT NULL,
    tombo_hcf INT NOT NULL,
    ordem SMALLINT DEFAULT 1,
    PRIMARY KEY (identificador_id, tombo_hcf),
    CONSTRAINT fk_tombos_identificadores_identificador FOREIGN KEY (identificador_id) REFERENCES identificadores (id),
    CONSTRAINT fk_tombos_identificadores_tombo FOREIGN KEY (tombo_hcf) REFERENCES tombos (hcf)
);

CREATE TABLE tombos_fotos (
    id SERIAL PRIMARY KEY,
    tombo_hcf INT NOT NULL,
    codigo_barra VARCHAR(45) DEFAULT '',
    num_barra VARCHAR(45) DEFAULT '',
    caminho_foto TEXT,
    em_vivo BOOLEAN NOT NULL DEFAULT FALSE,
    sequencia INT DEFAULT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_tombos_fotos_tombos FOREIGN KEY (tombo_hcf) REFERENCES tombos (hcf)
);

CREATE TABLE tombo_alteracoes_antigas (
    sequencia INT NOT NULL,
    data DATE DEFAULT NULL,
    descricao TEXT,
    tombo_hcf INT NOT NULL,
    PRIMARY KEY (sequencia, tombo_hcf),
    CONSTRAINT fk_tombo_alteracoes_tombos FOREIGN KEY (tombo_hcf) REFERENCES tombos (hcf)
);

CREATE TABLE retirada_exsiccata_tombos (
    retirada_exsiccata_id INT NOT NULL,
    tombo_hcf INT NOT NULL,
    herbario_id INT NOT NULL,  -- ✅ Agora referenciamos herbario_id também
    tipo TEXT CHECK (tipo IN ('DOACAO', 'EMPRESTIMO', 'PERMUTA')) NOT NULL,
    data_vencimento TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    devolvido BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (retirada_exsiccata_id, tombo_hcf),
    CONSTRAINT fk_retirada_exsiccata_remessas FOREIGN KEY (retirada_exsiccata_id, herbario_id) REFERENCES remessas (id, herbario_id) ON DELETE CASCADE,
    CONSTRAINT fk_retirada_exsiccata_tombos FOREIGN KEY (tombo_hcf) REFERENCES tombos (hcf) ON DELETE CASCADE
);

CREATE TABLE tipos_usuarios (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    ra VARCHAR(45) DEFAULT NULL,
    email VARCHAR(200) NOT NULL,
    senha VARCHAR(200) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    tipo_usuario_id INT NOT NULL,
    telefone VARCHAR(45) DEFAULT NULL,
    herbario_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_usuarios_tipos_usuarios FOREIGN KEY (tipo_usuario_id) REFERENCES tipos_usuarios (id),
    CONSTRAINT fk_usuarios_herbarios FOREIGN KEY (herbario_id) REFERENCES herbarios (id)
);

CREATE TABLE alteracoes (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    status TEXT CHECK (status IN ('ESPERANDO', 'APROVADO', 'REPROVADO')) NOT NULL,
    observacao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    tombo_hcf INT NOT NULL,
    tombo_json JSON,
    identificacao BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_alteracoes_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    CONSTRAINT fk_alteracoes_tombos FOREIGN KEY (tombo_hcf) REFERENCES tombos (hcf)
);
