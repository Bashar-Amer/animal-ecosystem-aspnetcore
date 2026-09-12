sqlcmd -S "(localdb)\MSSQLLocalDB" `
       -d "AnimalEcosystem" `
       -E `
       -b `
       -i ".\DeleteData.sql"