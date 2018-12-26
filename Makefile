aws_account_id := $(shell aws sts get-caller-identity  | jq -r '.Account')
url_teste := $(shell aws cloudformation describe-stacks --stack-name node-demo | grep notes | cut -d'"' -f4)

all: prod-images	prod

prod-images:
	$(shell aws ecr get-login --no-include-email --region us-east-1)
	docker build -f ./docker/Dockerfile-app -t app .
	$(shell aws ecr create-repository --repository-name node/app | echo)
	docker tag app:latest $(aws_account_id).dkr.ecr.us-east-1.amazonaws.com/node/app
	docker push $(aws_account_id).dkr.ecr.us-east-1.amazonaws.com/node/app

prod:
	aws cloudformation create-stack --stack-name node-demo --template-body file://cformation/master.yaml --capabilities CAPABILITY_NAMED_IAM

prod-test:
	curl -X GET $(url_teste)
	curl -X POST -H "Content-Type: application/json" --data '{"Text": "Teste"}' $(url_teste)
	curl -X GET $(url_teste)
	curl -X DELETE $(url_teste)/1
	curl -X GET $(url_teste)

prod-clean:
	aws cloudformation delete-stack --stack-name node-demo

dev:
	docker-compose up --force-recreate --build -d

dev-test:	
	curl -X GET localhost/notes  
	curl -X POST -H "Content-Type: application/json" --data '{"Text": "Teste"}' localhost/notes
	curl -X GET localhost/notes
	curl -X DELETE localhost/notes/1
	curl -X GET localhost/notes

dev-clean:
	docker-compose kill
