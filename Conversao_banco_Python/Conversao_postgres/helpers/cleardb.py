import psycopg2

def reset_database():
    conn = psycopg2.connect(
        dbname="hcf",
        user="postgres",
        password="postgres",
        host="localhost",
        port=5432
    )
    conn.autocommit = True
    cursor = conn.cursor()

    sql = """
    DO $$ DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
        END LOOP;
    END $$;
    """

    cursor.execute(sql)
    cursor.close()
    conn.close()
    print("✅ Banco de dados resetado com sucesso!")

reset_database()
