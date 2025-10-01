# Painel de Veículos MOBS2

## Introdução

Este projeto tem como objetivo construir uma aplicação para acompanhamento de veículos em tempo real.  
A solução é composta por três serviços principais:

- **vehicle-api**: responsável pelo cadastro de veículos e autenticação de usuários.  
- **telemetry-api**: fornece dados de telemetria simulada (posições, velocidade, combustível).  
- **mobs2-app**: painel web para visualização dos veículos no mapa com histórico de posições.  

O sistema é executado em containers Docker para garantir padronização e facilidade de instalação.

## System Design
![system-design](imgs/system-design.png)

- **mobs2-app** (vue-front): É o frontend que vai interagir com o usuário final, dando ao mesmo as opções de registro de usuário, login, visualização de marcadores dos veículos do sistema, tal como o CRUD desses veículos.

- **nginx** (reverse proxy): É a API Gateway que chama as duas APIs do sistema, diferenciando cada chamada e escondendo as portas de uso de cada API.

- **vehicle-api**: É a API responsável pelo CRUD de veículos (vehicles) e autenticação com JWT. Ela utiliza e guarda as informações das duas entidades no banco **vehicles_db**.

- **telemetry-api**: A API de telemetria dos veículos guarda as coordenadas de cada veículo no banco de dados, salvando os ids e placas de cada veículo na base de dados **telemetry_db**.

_OBS.: A ideia inicial era criar um job isolado para ir atualizando as coordenadas de cada veículo, mas decidi deixar como fiz inicialmente, com um job no próprio Nest (telemetry-api), que faz uma chamada interna com um secret compartilhado e em seguida atualiza os points com base em arrays mockados somente para uso rápido, então basta subir a aplicação, criar uma conta e uma vez logado, basta ir na página de vehicles, criar um veículo e voltar para a página maps, em até 5 segundos a página atualizará._

## Tecnologias

- **Frontend**: Vue 3 + Vite + TailwindCSS + ShadCN 
- **Backend**: Laravel (auth e veículos), NestJS (telemetria)  
- **Banco de Dados**: PostgreSQL  
- **Infraestrutura**: Docker, Docker Compose, Nginx (API Gateway)


## Instalação

- Clone o repositório:
    ```bash
    git clone https://github.com/loanmatteusz/mobs2-vehicle-app.git
    cd mobs2-vehicle-app
    ```
- Atualize a variável de ambiente do google (**VITE_GOOGLE_MAPS_KEY**) no **docker-compose.yml**.
    ```yml
        mobs2-app:
            build:
            context: ./mobs2-app
            args:
                VITE_GOOGLE_MAPS_KEY: MAPS-KEY # <-- SUA CHAVE GOOGLE
        ...
    ```

- Rode o comando de build do docker compose:
    ```bash
        docker compose up --build
        # ou
        docker-compose up --build
    ```

## Como usar

1. Acesse: http://localhost:5173
2. Registre um usuário na tela inicial.
3. Faça login para acessar o painel.
4. Vá até a aba **Vehicles** e cadastre um novo veículo.
5. Retorne ao **Maps** e aguarde alguns segundos para visualizar o veículo com telemetria em tempo real.
