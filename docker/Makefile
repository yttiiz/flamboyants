COMPOSE=docker compose
API_CONTAINER=api

# Production
up:
	$(COMPOSE) up -d

stop:
	$(COMPOSE) stop

start:
	$(COMPOSE) start

down:
	$(COMPOSE) down

rmi:
	$(COMPOSE) down --rmi local

logs-api:
	docker logs $(API_CONTAINER)

sh:
	docker exec -it $(API_CONTAINER) sh