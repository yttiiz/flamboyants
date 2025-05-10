#bind container host to network
HOST=--network host
CONTAINER=RVJ
IMAGE=rvj-img
LAUNCH=docker run --name $(CONTAINER) -d -p 3000:3000 $(HOST) -v $(shell pwd):/app $(IMAGE) deno task start

init:
	docker build -t $(IMAGE) . && $(LAUNCH)

up:
	$(LAUNCH)

stop:
	docker stop $(CONTAINER)

start:
	docker start $(CONTAINER)

down:
	docker rm -v $(CONTAINER)

sh:
	docker exec -it $(CONTAINER) sh

logs:
	docker logs -f $(CONTAINER)

ps:
	docker ps

rmi:
	docker rmi $(IMAGE):latest