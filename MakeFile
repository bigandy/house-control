dev-migration:
	npx prisma migrate dev --preview-feature

run-migration:
	npx prisma migrate deploy --preview-feature

generate-schema:
	npm run generate

setup: npm-setup docker-setups

npm-setup:
	npm install; typedoc

docker-setup:
	docker-compose pull

run-docker:
	docker-compose up

run-truenorth:
	npm run dev

init: run-migration generate-schema

build: npm-setup generate-schema
