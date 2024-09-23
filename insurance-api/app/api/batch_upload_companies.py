import pandas as pd
from sqlalchemy import create_engine

# 1. load the companies data
companies = pd.read_csv("insurancecompanies.csv")

# 2. remove the unnamed columns
companies = companies.loc[:, ~companies.columns.str.contains('^Unnamed')]


# 5. connect to the engine and dumping it into the database
engine = create_engine('postgresql+psycopg2://postgres:backend@database/docker')

companies.to_sql('insurancecompany_insurancecompany',
                 con=engine, if_exists='append', index=False)

# 3. rename the column header
print(companies.head())
