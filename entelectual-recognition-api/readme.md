Docker command for PostgresSQL:
docker run -p 127.0.0.1:5432:5432 --name postgres -e POSTGRES_PASSWORD=P@ssword123 -e POSTGRES_USER=postgres -d postgres

Seed Database
npx sequelize db:seed:all

Migrate Database
npx sequelize db:migrate 

Generate seed 
npx sequelize seed:generate --name Locations