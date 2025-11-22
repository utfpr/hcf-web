#!/bin/bash

BACKUP_FILE="/backup/$(basename $FIREBIRD_DATABASE '.GDB').FBK"
DATABASE_FILE="/firebird/data/$FIREBIRD_DATABASE"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "No such file found $BACKUP_FILE"
  exit 0
fi

echo "Backup: $BACKUP_FILE"
echo "Database: $DATABASE_FILE"

/usr/local/firebird/bin/gbak \
  -USER SYSDBA \
  -PASSWORD "$ISC_PASSWORD" \
  -TRANSPORTABLE \
  -VERIFY \
  -REPLACE_DATABASE \
  "$BACKUP_FILE" \
  "$DATABASE_FILE"
