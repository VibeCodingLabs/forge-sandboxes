.PHONY: build up down test clean images logs

build:
	bash infra/build-vm-images.sh

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down -v

logs:
	docker compose logs -f firecracker-host

test:
	node scripts/test-sandbox.js

clean:
	rm -rf vm-images sandboxes dist
