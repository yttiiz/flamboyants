COMPOSE=docker compose
API_CONTAINER=les_flamboyants
PROJECT_NAME=lf
BAKE=COMPOSE_BAKE=true # Use once with 'up' command

# Production
up:
	$(BAKE) $(COMPOSE) -p $(PROJECT_NAME) up -d

stop:
	$(COMPOSE) -p $(PROJECT_NAME) stop

start:
	$(COMPOSE) -p $(PROJECT_NAME) start

down:
	$(COMPOSE) -p $(PROJECT_NAME) down

rmi:
	$(COMPOSE) -p $(PROJECT_NAME) down --rmi local

logs-api:
	docker logs $(API_CONTAINER)

sh:
	docker exec -it $(API_CONTAINER) sh