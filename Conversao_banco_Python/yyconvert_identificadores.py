import fdb
import unicodedata

def conectar_firebird():
    return fdb.connect(
        host='127.0.0.1',
        database='./../firebird/data/HERBARIUM.GDB',
        user='SYSDBA',
        password='masterkey',
        charset='WIN1252'  # ou LATIN1 se necessário
    )

def sanitize_double_spaces(text):
    """Remove espaços duplos de uma string."""
    return ' '.join(text.split())

def normalizar_nome(nome: str) -> str:
    """Remove acentos e normaliza espaços e caixa baixa."""
    nome = unicodedata.normalize("NFKD", nome)
    nome = ''.join(c for c in nome if not unicodedata.combining(c))
    return sanitize_double_spaces(nome.lower().strip())

def convert_identificadores():
    fb_conn = conectar_firebird()
    fb_cursor = fb_conn.cursor()

    fb_cursor.execute("SELECT nome FROM identificador")

    identificadores_convertidos = {}
    nomes_normalizados = set()

    with open('identificadores_convertidos.txt', 'w', encoding='utf-8') as file:
        for row in fb_cursor.fetchall():
            nome_identificador = sanitize_double_spaces(row[0].strip())

            if any(sep in nome_identificador for sep in ['&', ';', ',', ' e ']):
                nomes_divididos = nome_identificador.replace('&', ';').replace(',', ';').replace(' e ', ';').split(';')
                for nome in nomes_divididos:
                    nome = sanitize_double_spaces(nome.strip())
                    nome_chave = normalizar_nome(nome)
                    if nome and nome_chave not in nomes_normalizados:
                        nomes_normalizados.add(nome_chave)
                        identificadores_convertidos[nome] = True
                        file.write(f"{nome}\n")
            else:
                nome_chave = normalizar_nome(nome_identificador)
                if nome_identificador and nome_chave not in nomes_normalizados:
                    nomes_normalizados.add(nome_chave)
                    identificadores_convertidos[nome_identificador] = True
                    file.write(f"{nome_identificador}\n")
                else:
                    print(f"Ignorado duplicado: {nome_identificador}")

    fb_conn.commit()
    fb_cursor.close()
    fb_conn.close()
    print("Identificadores convertidos com sucesso.")

if __name__ == "__main__":
    convert_identificadores()
