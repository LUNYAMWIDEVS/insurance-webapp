import pandas as pd
from sqlalchemy import create_engine

# 1. load the companies data
individual_clients = pd.read_csv("client_individual_client_edited.csv")

# 2. remove the unnamed columns
individual_clients = individual_clients.loc[:,
                                            ~individual_clients
                                            .columns.str.contains('^Unnamed')]
individual_clients['agency_id'] = '-MbKt-Q66U4eBRdYPbgT'

# 5. connect to the engine and dumping it into the database
engine = create_engine('postgresql+psycopg2://postgres:backend@database/docker')

individual_clients.to_sql('client_individualclient',
                          con=engine, if_exists='append', index=False)

# 3. rename the column header
print(individual_clients.head())
