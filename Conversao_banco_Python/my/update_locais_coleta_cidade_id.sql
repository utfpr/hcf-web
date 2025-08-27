-- 1) Tabela temporária para importar o CSV mapeado (id, cidade_fb, uf_resolvida)
DROP TABLE IF EXISTS tmp_locais_coleta;
CREATE TEMPORARY TABLE tmp_locais_coleta (
  id INT UNSIGNED NOT NULL,
  cidade VARCHAR(255) NOT NULL,
  uf CHAR(4) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=Memory;

-- 2) Importe o arquivo CSV gerado (ajuste o caminho e habilite LOCAL INFILE se necessário)
--Exemplo:
SET GLOBAL local_infile=1;
LOAD DATA INFILE '/var/lib/mysql-files/tmp_locais_coleta_for_update.csv'
INTO TABLE tmp_locais_coleta
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id, cidade, uf);

-- 3) Atualize locais_coleta.cidade_id casando por (cidade, UF) → (cidades.nome, estados.sigla)
UPDATE locais_coleta lc
JOIN tmp_locais_coleta t ON t.id = lc.id
JOIN estados e ON UPPER(e.sigla) = UPPER(t.uf)
JOIN cidades c ON c.estado_id = e.id
  AND c.nome COLLATE utf8mb4_unicode_ci = t.cidade COLLATE utf8mb4_unicode_ci
SET lc.cidade_id = c.id
WHERE lc.cidade_id IS NULL;

-- 4) Verifique o que não casou
SELECT t.*
FROM tmp_locais_coleta t
LEFT JOIN estados e ON UPPER(e.sigla) = UPPER(t.uf)
LEFT JOIN cidades c ON c.estado_id = e.id
  AND c.nome COLLATE utf8mb4_unicode_ci = t.cidade COLLATE utf8mb4_unicode_ci
WHERE e.id IS NULL OR c.id IS NULL;