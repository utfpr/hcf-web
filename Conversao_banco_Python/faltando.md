SELECT id FROM coletores ORDER BY id
INTO OUTFILE '/var/lib/mysql-files/coletores_mysql.txt'
FIELDS TERMINATED BY '\n'
LINES TERMINATED BY '\n';

coletores:

1047
1129
145
1552
253
338
350
525
983

Os coletores não estão sendo migrados para o banco mysql porque os coletores não estão associados a um tombo e outros 3 estão com o mesmo nome.

identificador: 1669
1663 unicos SELECT COUNT(DISTINCT nome) FROM identificador;

Identificador: F. Almeida
Identificadores: ['I.M.C. Rodrigues']
Identificador: I.M.C. Rodrigues
Identificadores: ['P.J.F. Guimarães']
Identificador: P.J.F. Guimarães
Identificadores: ['C. Forzza']
Identificador: C. Forzza
Identificadores: ['E.R. de Souza']
Identificador: E.R. de Souza
Identificadores: ['A.M. Torres']
Identificador: A.M. Torres
Identificadores: ['D.J.G. Morais']
Identificador: D.J.G. Morais
Identificadores: ['E. Castro']
Identificador: E. Castro
Identificadores: ['W. Dietrich']
Identificador: W. Dietrich
Identificadores: ['L.S.S. Cardoso']
Identificador: L.S.S. Cardoso
Identificadores: ['P.M.W Giuffre ', ' M.K. Caddah']
Identificador: P.M.W Giuffre
Identificadores: ['M.C.A. Pestana']
Identificador: M.C.A. Pestana
Identificadores: ['L. Luz']
Identificador: L. Luz
Identificadores: ['R.C. Barneby']
Identificador: R.C. Barneby
Identificadores: ['H.C. Lima ', ' J. Iganci']
Identificadores: ['L. Bianchetti']
Identificador: L. Bianchetti
Identificadores: ['A.S. Mello']
Identificador: A.S. Mello
Identificadores: ['R. Bortoluzzi']
Identificador: R. Bortoluzzi
Identificadores: ['T. Grespan']
Identificador: T. Grespan
Identificadores: ['A.M. Silva']
Identificador: A.M. Silva
Identificadores: ['E.P. Santos']
Identificadores: ['J.E. Meirelles']
Identificador: J.E. Meirelles
Identificadores: ['R.C.V. Taques']
Identificador: R.C.V. Taques
Identificadores: ['M.M.F. Melo']
Identificador: M.M.F. Melo
Identificadores: ['C. Félix']
Identificador: C. Félix
Identificadores: ['T.V. Costa']
Identificador: T.V. Costa
Identificadores: ['J.F. Soares']
Identificador: J.F. Soares
Identificadores: ['E.K.S. Brandão']
Identificador: E.K.S. Brandão
Identificadores: ['A.V. Scatigna']
Identificador: A.V. Scatigna
Identificadores: ['L.J.T. Cardoso']
Identificador: L.J.T. Cardoso
Identificadores: ['T.M. Silva']
Identificador: T.M. Silva
Identificadores: ['Werner ', ' W.S. Mancinelli']
Identificador: Werner
Identificadores: ['C. Azevedo']
Identificador: C. Azevedo
Identificadores: ['D.S. Bauer']
Identificador: D.S. Bauer
Identificadores: ['J. Prado ', ' R.Y. Hirai']
Identificadores: ['F.B. Matos ', ' I.K. Hoffmann']
Identificador: I.K. Hoffmann
Identificadores: ['P. Windisch']
Identificador: P. Windisch
Identificadores: ['M. Christenhusz']
Identificador: M. Christenhusz
Identificadores: ['J.L. Ferreira']
Identificador: J.L. Ferreira
Identificadores: ['E.C. Smidt ', ' M. Machnicki-Reis']
Identificadores: ['M.C. Santos', ' Toscano Brito ', ' E.C. Smidt']
Identificador: M.C. Santos
Identificador: Toscano Brito
Identificadores: ['M.K. Caddah ', ' R. Goldenberg']
Identificadores: ['R. Vanni']
Identificador: R. Vanni
Identificadores: ['F. Souto']
Identificador: F. Souto
Identificadores: ['J.V. Lemos']
Identificadores: ['M.C. Souza']
Identificador: M.C. Souza
Identificadores: ['D.A. Morais']
Identificador: D.A. Morais
Identificadores: ['N.C. Bigio']
Identificador: N.C. Bigio
Identificadores: ['L.A. Teixeira']
Identificador: L.A. Teixeira
Identificadores: ['S.H.D. Pulsides']
Identificador: S.H.D. Pulsides
Identificadores: ['L.C. Zeferino']
Identificador: L.C. Zeferino
Identificadores: ['E. Menezes']
Identificador: E. Menezes
Identificadores: ['A.M. Panizza']
Identificador: A.M. Panizza
Identificadores: ['N. Zaruvne']
Identificador: N. Zaruvne
Identificadores: ['D. Mitja']
Identificador: D. Mitja
Identificadores: ['A.C.B. Maia']
Identificador: A.C.B. Maia
Identificadores: [' M.L. Fonseca I.O. Moura ', ' B.T.P.M. Góes']
Identificador: M.L. Fonseca I.O. Moura
Identificador: B.T.P.M. Góes
Identificadores: ['A.M. Miranda']
Identificador: A.M. Miranda
Identificadores: ['F.S. Meyer ', ' V. Weiss']
Identificador: V. Weiss

Processando Tombos Fotos! Aguarde...
Obtendo conteúdo da tabela tombo_exsicata: OK
Tombo 0.0 não inserido, pois é zero.
Dados: (0.0, 1, 'HCF000017582', 17582.0)
Tombo 0.0 não inserido, pois é zero.
Dados: (0.0, 2, 'HCF000021328', 21328.0)
Tombo 0.0 não inserido, pois é zero.
Dados: (0.0, 3, 'HCF000026309', 26309.0)
Tombo 0.0 não inserido, pois é zero.
Dados: (0.0, 4, 'HCF000026727', 26727.0)
Tombo 0.0 não inserido, pois é zero.
Dados: (0.0, 5, 'HCF000035040', 35040.0)
Tombo 0.0 não inserido, pois é zero.
Dados: (0.0, 6, 'HCF000039457', 39457.0)
Tombo 0.0 não inserido, pois é zero.
Dados: (0.0, 7, 'HCF000039458', 39458.0)

---- TOMBO_FOTOS ... ----
[DB_FIREBIRD] Obtendo dados da tabela: tombo_exsicata
[INFO] Geting table content tombo_exsicata: OK
[DB_MYSQL] Migrando dados para tabela: tombo_fotos
Tombo 0.0 não inserido, pois é zero.
Dados: {'num_tombo': 0.0, 'sequencia': 1, 'cod_barra': 'HCF000017582', 'num_barra': 17582.0}
Tombo com hcf 11197.0 não encontrado na tabela 'tombos'. Inserção em 'tombos_fotos' não permitida.
Tombo 0.0 não inserido, pois é zero.
Dados: {'num_tombo': 0.0, 'sequencia': 2, 'cod_barra': 'HCF000021328', 'num_barra': 21328.0}
Tombo 0.0 não inserido, pois é zero.
Dados: {'num_tombo': 0.0, 'sequencia': 3, 'cod_barra': 'HCF000026309', 'num_barra': 26309.0}
Tombo 0.0 não inserido, pois é zero.
Dados: {'num_tombo': 0.0, 'sequencia': 4, 'cod_barra': 'HCF000026727', 'num_barra': 26727.0}
Tombo 0.0 não inserido, pois é zero.
Dados: {'num_tombo': 0.0, 'sequencia': 5, 'cod_barra': 'HCF000035040', 'num_barra': 35040.0}
Tombo com hcf 38416.0 não encontrado na tabela 'tombos'. Inserção em 'tombos_fotos' não permitida.
Tombo 0.0 não inserido, pois é zero.
Dados: {'num_tombo': 0.0, 'sequencia': 6, 'cod_barra': 'HCF000039457', 'num_barra': 39457.0}
Tombo 0.0 não inserido, pois é zero.
Dados: {'num_tombo': 0.0, 'sequencia': 7, 'cod_barra': 'HCF000039458', 'num_barra': 39458.0}
Tombo com hcf 38802.0 não encontrado na tabela 'tombos'. Inserção em 'tombos_fotos' não permitida.
Tombo com hcf 40560.0 não encontrado na tabela 'tombos'. Inserção em 'tombos_fotos' não permitida.
