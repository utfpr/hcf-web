# FirebirdDarwinCoreConverter

Utilitário para conversão do banco de dados Firebird para DarwinCore

**Selecione o arquivo de banco de dados do Firebird**

![select-firebird-database](./assets/select-firebird-database.png)

**Selecione o diretório de saída do arquivo CSV**

![select-output-directory](./assets/select-output-directory.png)

**Aguarde a conclusão do processo**

![converting-window](./assets/converting-window.png)

---

## Geração do arquivo `.jar`

Configuração para IntellJ IDEA

- Abra o menu File > Project Structure;
- Na barra lateral dentro da seção "Project Settings" selecione "Artifacts";
- Ao lado clique no botão "+" e em seguinda em JAR > From modules with dependencies;
- No campo "Main Class" selecione a classe principal do projeto (FirebirdToDarwin) e clique em OK;
- Agora no menu Build > Build Artifacts;
- Selecione a única configuração e clique em "Build";
- O arquivo `.jar` será criado dentro de `out/artifacts/FirebirdToDarwin_jar`.
