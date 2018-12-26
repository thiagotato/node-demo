# node-demo

## Overview

Processo automatizado para realizar todo o provisionamento de uma aplicação em node.
A infraestrutura de "Prod" foi baseada nos Templates da AWS (https://github.com/aws-samples/ecs-refarch-cloudformation) onde conta com a utilização
de uma VPC, 2 Subnets e 2 privadas, 2 NAT gateways, 1 ALB e 1 RDS. Para o ambiente de "Dev",
foi utilizado docker compose para provisionar três container sendo eles Aplicação, Mysql e nginx.
Para gerir a criação desse ambientes foi criado um "Makefile" com alguns comando para facilitar a criação.

## Pré Requisitos
É necessário instalar alguns pacotes para que os comandos do Makefile funcionem corretamente.

  - Docker
    - https://docs.docker.com/install/linux/docker-ce/debian/
  - Docker Compose
    - https://docs.docker.com/compose/install/
  - AWS cli
    - https://docs.aws.amazon.com/pt_br/cli/latest/userguide/cli-chap-install.html
  - jq
    - apt-get install jq
  - S3
    - Copiar arquivos da pasta cformation para um bucket no s3, pode ser criado uma nova pasta dentro do bucket, porém as pastas infrastructure e services devem ser mantidas. Em seguida alterar o "Parameters" "S3 bucket" no arquivo master.yaml para a URL do bucket que será utilizado. O valor default está como s3url.

## Makefile

Comandos:
  - all
    - executa o estágio prod-images e prod
  - prod-images
    - faz o build das imagens docker em seguida faz o push para o ECR criado nesse estágio
  - prod
    - Realiza a criação das imagens através do dockerfile e provisiona a infraestrutura pelo comando aws utilizando o cloudformation
  - prod-test
    - Realiza um chamada ao endpoint de produção utilizando o comando "curl" para ler as notas, cria ou deletar uma nota
  - prod-clean
    - Executa a deleção do ambiente de produção
  - dev
    - Crias as imagens através de dockerfile e provisiona os containers através do docker-compose
  - dev-test
    - Realiza uma chamada para o endpoint local com o comando 'curl' para ler as notas, criar ou deletar.
  - dev-clean
    - Executa a deleção do ambiente de dev
    
## Execução
  ### Dev
  - Para provisionar o ambiente de Dev, executar o comando:
    - make dev
  - Para realizar os teste no ambiente de Dev, executar o comando:
    - make dev-test
  - Para realizar a deleção do ambiente de Dev, executar o comando:
    - make dev-clean    

  ### Prod
  - Para provisionar o ambiente de Prod, executar o comando:
    - make all
  - Para realizar os teste no ambiente de Prod, executar o comando:
    - make prod-test
  - Para realizar a deleção do ambiente de Prod, executar o comando:
    - make prod-clean  
