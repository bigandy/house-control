dev-migration:
	npx prisma migrate dev --preview-feature

run-migration:
	npx prisma migrate deploy --preview-feature

generate-schema:
	npm run generate && npx graphql-codegen --config ./codegen.yml

setup: npm-setup docker-setups

npm-setup:
	npm install

docker-setup:
	docker-compose pull

run-docker:
	docker-compose up

init: run-migration generate-schema

build: npm-setup generate-schema
