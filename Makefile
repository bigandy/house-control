dev-migration:
	npx prisma migrate dev

run-migration:
	npx prisma migrate deploy

generate-schema:
	npm run generate && npx graphql-codegen --config ./codegen.yml

init: run-migration generate-schema

