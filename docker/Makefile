COMPOSE=docker compose
API_CONTAINER=api
BAKE=COMPOSE_BAKE=true # Use once with 'up' command

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