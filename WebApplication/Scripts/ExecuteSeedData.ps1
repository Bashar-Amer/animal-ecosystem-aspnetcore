sqlcmd -S "(localdb)\MSSQLLocalDB" `
       -d "AnimalEcosystem" `
       -E `
       -b `
       -i ".\SeedProductionDemoData.sql"