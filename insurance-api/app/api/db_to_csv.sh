CONTAINER="samar-insurance-api_database_1"
DB="docker"
TABLE="client_individualclient"
FILE="client_individual_client_to_edit.csv"

sudo docker exec -u postgres ${CONTAINER} psql -d ${DB} -c "COPY ${TABLE} TO STDOUT WITH CSV HEADER " > ${FILE}
