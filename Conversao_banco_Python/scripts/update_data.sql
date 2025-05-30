SET NAMES UTF8;

UPDATE tombo SET longitude = '52°20''58,3" W' WHERE hcf = 38260;
UPDATE tombo SET longitude = '52°21''27,4" W' WHERE hcf = 38393;
UPDATE tombo SET longitude = '51°05''48,2" W' WHERE hcf = 38607;
UPDATE tombo SET longitude = '50°01''07,0" W' WHERE hcf = 39006;
UPDATE tombo SET longitude = '43°41''07,4" W' WHERE hcf = 40285;
UPDATE tombo SET longitude = '52°17''12,1" W' WHERE hcf = 40573;

UPDATE tombo SET latitude = '24°36''22,2" S' WHERE hcf = 40780;
UPDATE tombo SET latitude = '18°21''39,1" S' WHERE hcf = 40475;

UPDATE tombo SET data_identificacao = '25/XI/2013' WHERE hcf = 40560;
UPDATE tombo SET data_identificacao = '15/V/2024' WHERE hcf = 38416;
UPDATE tombo SET data_identificacao = '18/XII/2024' WHERE hcf = 11197;
UPDATE tombo SET data_identificacao = '29/IX/2024' WHERE hcf = 3130;
UPDATE tombo SET data_identificacao = '06/XII/2024' WHERE hcf = 1544;
UPDATE tombo SET data_identificacao = '06/II/2024' WHERE hcf = 745;
UPDATE tombo SET data_identificacao = '23/VI/2024' WHERE hcf = 237;
UPDATE tombo SET data_identificacao = '18/X/2024' WHERE hcf = 3743;
UPDATE tombo SET data_identificacao = '01/X/2024' WHERE hcf = 38802;
UPDATE tombo SET data_identificacao = '23/VIII/2004' WHERE hcf = 766;
UPDATE tombo SET data_identificacao = '29/IX/2024' WHERE hcf = 3130;

COMMIT;
