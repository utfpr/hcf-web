CREATE TABLE `historico_acessos` (
    `id` int NOT NULL AUTO_INCREMENT,
    `data_criacao` datetime NOT NULL,
    `usuario_id` int NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `configuracao` (
    `id` int NOT NULL AUTO_INCREMENT,
    `hora_inicio` varchar(19) NOT NULL,
    `hora_fim` varchar(19) DEFAULT NULL,
    `periodicidade` enum('MANUAL','SEMANAL','1MES','2MESES') DEFAULT NULL,
    `data_proxima_atualizacao` varchar(10) DEFAULT NULL,
    `nome_arquivo` varchar(50) DEFAULT NULL,
    `servico` enum('REFLORA','SPECIESLINK') DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `coletores` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(255) NOT NULL,
    `email` varchar(200) DEFAULT NULL,
    `numero` int DEFAULT NULL,
    `ativo` tinyint DEFAULT '1',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `relevos` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(300) NOT NULL,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `solos` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(300) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `vegetacoes` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(300) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `fase_sucessional` (
    `numero` int NOT NULL,
    `nome` varchar(200) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`numero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `paises` (
    `id` smallint unsigned NOT NULL AUTO_INCREMENT,
    `nome` varchar(255) NOT NULL,
    `sigla` char(4) DEFAULT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `reinos` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(200) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `estados` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `nome` varchar(255) NOT NULL,
    `sigla` char(4) DEFAULT NULL,
    `codigo_telefone` varchar(10) DEFAULT NULL,
    `pais_id` smallint unsigned NOT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `pais_nome` (`pais_id`,`nome`),
    CONSTRAINT `fk_estados_paises` FOREIGN KEY (`pais_id`) REFERENCES `paises` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

CREATE TABLE `cidades` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `estado_id` int unsigned NOT NULL,
    `nome` varchar(255) NOT NULL,
    `latitude` double DEFAULT NULL,
    `longitude` double DEFAULT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_cidades_estado_idx` (`estado_id`),
    KEY `pais_estado_nome` (`estado_id`,`nome`),
    CONSTRAINT `fk_cidades_estados` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `locais_coleta` (
    `id` int NOT NULL AUTO_INCREMENT,
    `descricao` text,
    `cidade_id` int unsigned DEFAULT NULL,
    `fase_sucessional_id` int DEFAULT NULL,
    `complemento` text,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fase_numero` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_locais_coleta_fase_sucessional1_idx` (`fase_sucessional_id`),
    KEY `fk_locais_coleta_cidades_idx` (`cidade_id`),
    KEY `FK_99i0itontmoklfxmoo8armtnv` (`fase_numero`),
    CONSTRAINT `FK_99i0itontmoklfxmoo8armtnv` FOREIGN KEY (`fase_numero`) REFERENCES `fase_sucessional` (`numero`),
    CONSTRAINT `fk_locais_coleta_cidades` FOREIGN KEY (`cidade_id`) REFERENCES `cidades` (`id`),
    CONSTRAINT `fk_locais_coleta_fase_sucessional1` FOREIGN KEY (`fase_sucessional_id`) REFERENCES `fase_sucessional` (`numero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `familias` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(200) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ativo` tinyint(1) DEFAULT '1',
    `reino_id` int NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `generos` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(200) NOT NULL,
    `familia_id` int NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ativo` tinyint DEFAULT '1',
    PRIMARY KEY (`id`),
    KEY `fk_generos_familias` (`familia_id`),
    CONSTRAINT `fk_generos_familias` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `autores` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(200) NOT NULL,
    `iniciais` varchar(200) DEFAULT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ativo` tinyint(1) DEFAULT '1',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `especies` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(200) NOT NULL,
    `autor_id` int DEFAULT NULL,
    `genero_id` int,
    `familia_id` int NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ativo` tinyint DEFAULT '1',
    PRIMARY KEY (`id`),
    KEY `fk_especies_autor` (`autor_id`),
    KEY `fk_especies_genero` (`genero_id`),
    KEY `fk_especies_familia` (`familia_id`),
    CONSTRAINT `fk_especies_autor` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`),
    CONSTRAINT `fk_especies_genero` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`),
    CONSTRAINT `fk_especies_familia` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `variedades` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(200) NOT NULL,
    `autor_id` int DEFAULT NULL,
    `especie_id` int NOT NULL,
    `genero_id` int,
    `familia_id` int NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ativo` tinyint DEFAULT '1',
    PRIMARY KEY (`id`),
    KEY `fk_variedades_autor` (`autor_id`),
    KEY `fk_variedades_especie` (`especie_id`),
    KEY `fk_variedades_familia` (`familia_id`),
    KEY `fk_variedades_genero` (`genero_id`),
    CONSTRAINT `fk_variedades_autor` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`),
    CONSTRAINT `fk_variedades_especie` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`id`),
    CONSTRAINT `fk_variedades_familia` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`),
    CONSTRAINT `fk_variedades_genero` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `sub_especies` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(255) NOT NULL,
    `especie_id` int NOT NULL,
    `genero_id` int,
    `familia_id` int NOT NULL,
    `autor_id` int DEFAULT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ativo` tinyint DEFAULT '1',
    PRIMARY KEY (`id`),
    KEY `fk_sub_especies_especie` (`especie_id`),
    KEY `fk_sub_especies_autor` (`autor_id`),
    KEY `fk_sub_especies_familia` (`familia_id`),
    KEY `fk_sub_especies_genero` (`genero_id`),
    CONSTRAINT `fk_sub_especies_autor` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`),
    CONSTRAINT `fk_sub_especies_especie` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`id`),
    CONSTRAINT `fk_sub_especies_familia` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`),
    CONSTRAINT `fk_sub_especies_genero` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `sub_familias` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(300) NOT NULL,
    `familia_id` int NOT NULL,
    `autor_id` int DEFAULT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ativo` tinyint DEFAULT '1',
    PRIMARY KEY (`id`),
    KEY `fk_sub_familias_familia` (`familia_id`),
    KEY `fk_sub_familias_autor` (`autor_id`),
    CONSTRAINT `fk_sub_familias_autor` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`),
    CONSTRAINT `fk_sub_familias_familia` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `colecoes_anexas` (
    `tipo` enum('CARPOTECA','XILOTECA','VIA LIQUIDA') NOT NULL,
    `observacoes` text,
    `id` int NOT NULL AUTO_INCREMENT,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `enderecos` (
    `id` int NOT NULL AUTO_INCREMENT,
    `logradouro` varchar(200) NOT NULL,
    `numero` varchar(10) DEFAULT NULL,
    `complemento` text,
    `cidade_id` int unsigned DEFAULT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_enderecos_cidade` (`cidade_id`),
    CONSTRAINT `fk_enderecos_cidade` FOREIGN KEY (`cidade_id`) REFERENCES `cidades` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `herbarios` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(200) NOT NULL,
    `caminho_logotipo` text,
    `sigla` varchar(80) NOT NULL,
    `email` varchar(200) DEFAULT NULL,
    `ativo` tinyint(1) DEFAULT '1',
    `endereco_id` int DEFAULT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_herbarios_endereco` (`endereco_id`),
    CONSTRAINT `fk_herbarios_endereco` FOREIGN KEY (`endereco_id`) REFERENCES `enderecos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `telefones` (
    `id` int NOT NULL AUTO_INCREMENT,
    `numero` varchar(200) NOT NULL,
    `herbario_id` int NOT NULL,
    `ativo` tinyint DEFAULT '1',
    PRIMARY KEY (`id`),
    KEY `fk_telefones_herbario` (`herbario_id`),
    CONSTRAINT `fk_telefones_herbario` FOREIGN KEY (`herbario_id`) REFERENCES `herbarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `remessas` (
    `id` int NOT NULL AUTO_INCREMENT,
    `observacao` text,
    `data_envio` datetime DEFAULT NULL,
    `entidade_destino_id` int NOT NULL,
    `herbario_id` int NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_remessas_herbario` (`herbario_id`),
    CONSTRAINT `fk_remessas_herbario` FOREIGN KEY (`herbario_id`) REFERENCES `herbarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `tipos` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(250) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `identificadores` (
    `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` varchar(255) NOT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tombos` (
    `hcf` int NOT NULL AUTO_INCREMENT,
    `data_tombo` datetime DEFAULT CURRENT_TIMESTAMP,
    `data_coleta_dia` int DEFAULT NULL,
    `observacao` text,
    `nomes_populares` text,
    `numero_coleta` int DEFAULT NULL,
    `latitude` double DEFAULT NULL,
    `longitude` double DEFAULT NULL,
    `altitude` double DEFAULT NULL,
    `entidade_id` int DEFAULT NULL,
    `local_coleta_id` int DEFAULT NULL,
    `variedade_id` int DEFAULT NULL,
    `tipo_id` int DEFAULT NULL,
    `data_identificacao_dia` tinyint UNSIGNED DEFAULT NULL,
    `data_identificacao_mes` tinyint UNSIGNED DEFAULT NULL,
    `data_identificacao_ano` year DEFAULT NULL,
    `situacao` enum('REGULAR','PERMUTA','EMPRESTIMO','DOACAO') DEFAULT 'REGULAR',
    `especie_id` int DEFAULT NULL,
    `genero_id` int DEFAULT NULL,
    `familia_id` int DEFAULT NULL,
    `sub_familia_id` int DEFAULT NULL,
    `sub_especie_id` int DEFAULT NULL,
    `nome_cientifico` text,
    `colecao_anexa_id` int DEFAULT NULL,
    `cor` enum('VERMELHO','VERDE','AZUL') DEFAULT NULL,
    `data_coleta_mes` int DEFAULT NULL,
    `data_coleta_ano` int DEFAULT NULL,
    `solo_id` int DEFAULT NULL,
    `relevo_id` int DEFAULT NULL,
    `vegetacao_id` int DEFAULT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ativo` tinyint(1) DEFAULT '1',
    `taxon` varchar(45) DEFAULT NULL,
    `rascunho` tinyint(1) DEFAULT '0',
    `coletor_id` int DEFAULT NULL,
    PRIMARY KEY (`hcf`),
    KEY `fk_tombos_entidade` (`entidade_id`),
    KEY `fk_tombos_tipo` (`tipo_id`),
    KEY `fk_tombos_especie` (`especie_id`),
    KEY `fk_tombos_genero` (`genero_id`),
    KEY `fk_tombos_familia` (`familia_id`),
    KEY `fk_tombos_sub_familia` (`sub_familia_id`),
    KEY `fk_tombos_sub_especie` (`sub_especie_id`),
    KEY `fk_tombos_variedade` (`variedade_id`),
    KEY `fk_tombos_colecao_anexa` (`colecao_anexa_id`),
    KEY `fk_tombos_local_coleta` (`local_coleta_id`),
    KEY `fk_tombos_solo` (`solo_id`),
    KEY `fk_tombos_relevo` (`relevo_id`),
    KEY `fk_tombos_vegetacao` (`vegetacao_id`),
    KEY `fk_tombos_coletor` (`coletor_id`),
    CONSTRAINT `fk_tombos_entidade` FOREIGN KEY (`entidade_id`) REFERENCES `herbarios` (`id`),
    CONSTRAINT `fk_tombos_colecao_anexa` FOREIGN KEY (`colecao_anexa_id`) REFERENCES `colecoes_anexas` (`id`),
    CONSTRAINT `fk_tombos_especie` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`id`),
    CONSTRAINT `fk_tombos_familia` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`),
    CONSTRAINT `fk_tombos_genero` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`),
    CONSTRAINT `fk_tombos_local_coleta` FOREIGN KEY (`local_coleta_id`) REFERENCES `locais_coleta` (`id`),
    CONSTRAINT `fk_tombos_sub_especie` FOREIGN KEY (`sub_especie_id`) REFERENCES `sub_especies` (`id`),
    CONSTRAINT `fk_tombos_sub_familia` FOREIGN KEY (`sub_familia_id`) REFERENCES `sub_familias` (`id`),
    CONSTRAINT `fk_tombos_tipo` FOREIGN KEY (`tipo_id`) REFERENCES `tipos` (`id`),
    CONSTRAINT `fk_tombos_solo` FOREIGN KEY (`solo_id`) REFERENCES `solos` (`id`),
    CONSTRAINT `fk_tombos_relevo` FOREIGN KEY (`relevo_id`) REFERENCES `relevos` (`id`),
    CONSTRAINT `fk_tombos_vegetacao` FOREIGN KEY (`vegetacao_id`) REFERENCES `vegetacoes` (`id`),
    CONSTRAINT `fk_tombos_coletor` FOREIGN KEY (`coletor_id`) REFERENCES `coletores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `coletores_complementares` (
    `hcf` int NOT NULL,
    `complementares` varchar(1000) NOT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`hcf`),
    CONSTRAINT `fk_coletores_complementares_tombo` FOREIGN KEY (`hcf`) REFERENCES `tombos` (`hcf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tombos_identificadores` (
    `identificador_id` int UNSIGNED NOT NULL,
    `tombo_hcf` int NOT NULL,
    `ordem` tinyint UNSIGNED DEFAULT 1,
    PRIMARY KEY (`identificador_id`, `tombo_hcf`),
    KEY `fk_tombos_identificadores_identificador` (`identificador_id`),
    KEY `fk_tombos_identificadores_tombo` (`tombo_hcf`),
    CONSTRAINT `fk_tombos_identificadores_identificador` FOREIGN KEY (`identificador_id`) REFERENCES `identificadores` (`id`),
    CONSTRAINT `fk_tombos_identificadores_tombo` FOREIGN KEY (`tombo_hcf`) REFERENCES `tombos` (`hcf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tombos_fotos` (
    `id` int NOT NULL AUTO_INCREMENT,
    `tombo_hcf` int NOT NULL,
    `codigo_barra` varchar(45) DEFAULT '',
    `num_barra` varchar(45) DEFAULT '',
    `caminho_foto` text,
    `em_vivo` tinyint(1) NOT NULL DEFAULT '0',
    `sequencia` int DEFAULT NULL,
    `ativo` int DEFAULT '1',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_tombos_fotos_num_barra` (`num_barra`),
    KEY `fk_tombos_fotos_tombo` (`tombo_hcf`),
    CONSTRAINT `fk_tombos_fotos_tombo` FOREIGN KEY (`tombo_hcf`) REFERENCES `tombos` (`hcf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tombo_alteracoes_antigas` (
    `sequencia` int NOT NULL,
    `data` date DEFAULT NULL,
    `descricao` text,
    `tombo_hcf` int NOT NULL,
    PRIMARY KEY (`sequencia`,`tombo_hcf`),
    KEY `fk_tombo_alteracoes_antigas_tombo` (`tombo_hcf`),
    CONSTRAINT `fk_tombo_alteracoes_antigas_tombo` FOREIGN KEY (`tombo_hcf`) REFERENCES `tombos` (`hcf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `retirada_exsiccata_tombos` (
    `retirada_exsiccata_id` int NOT NULL,
    `tombo_hcf` int NOT NULL,
    `tipo` enum('DOACAO','EMPRESTIMO','PERMUTA') NOT NULL,
    `data_vencimento` datetime DEFAULT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `devolvido` tinyint(1) DEFAULT '0',
    PRIMARY KEY (`retirada_exsiccata_id`,`tombo_hcf`),
    KEY `fk_retirada_exsiccata_tombos_tombo` (`tombo_hcf`),
    KEY `fk_retirada_exsiccata_tombos_remessa` (`retirada_exsiccata_id`),
    CONSTRAINT `fk_retirada_exsiccata_tombos_remessa` FOREIGN KEY (`retirada_exsiccata_id`) REFERENCES `remessas` (`id`),
    CONSTRAINT `fk_retirada_exsiccata_tombos_tombo` FOREIGN KEY (`tombo_hcf`) REFERENCES `tombos` (`hcf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tipos_usuarios` (
    `id` int NOT NULL AUTO_INCREMENT,
    `tipo` varchar(100) DEFAULT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `usuarios` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(200) NOT NULL,
    `ra` varchar(45) DEFAULT NULL,
    `email` varchar(200) NOT NULL,
    `senha` varchar(200) NOT NULL,
    `ativo` tinyint NOT NULL DEFAULT '1',
    `tipo_usuario_id` int NOT NULL,
    `telefone` varchar(45) DEFAULT NULL,
    `herbario_id` int NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_usuarios_tipo_usuario` (`tipo_usuario_id`),
    KEY `fk_usuarios_herbario` (`herbario_id`),
    CONSTRAINT `fk_usuarios_herbario` FOREIGN KEY (`herbario_id`) REFERENCES `herbarios` (`id`),
    CONSTRAINT `fk_usuarios_tipo_usuario` FOREIGN KEY (`tipo_usuario_id`) REFERENCES `tipos_usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `alteracoes` (
    `id` int NOT NULL AUTO_INCREMENT,
    `usuario_id` int NOT NULL,
    `status` enum('ESPERANDO','APROVADO','REPROVADO') NOT NULL,
    `observacao` text,
    `ativo` tinyint DEFAULT '1',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `tombo_hcf` int NOT NULL,
    `tombo_json` text,
    `identificacao` tinyint DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `fk_alteracoes_usuario` (`usuario_id`),
    KEY `fk_alteracoes_tombo` (`tombo_hcf`),
    CONSTRAINT `fk_alteracoes_tombo` FOREIGN KEY (`tombo_hcf`) REFERENCES `tombos` (`hcf`),
    CONSTRAINT `fk_alteracoes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO 'reinos' ('id', 'nome') VALUES
(1, 'Plantae', NOW(), NOW()),
(2, 'Fungi', NOW(), NOW()),
