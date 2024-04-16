# Teste Técnico (Tech Lead)

O presente projeto corresponde à etapa de teste técnico da empresa OnFly do participante Matheus Rodrigues Borges para a posição de Tech Lead.

## Linguagem e framework

O presente projeto foi escrito utilizando-se a linguagem TypeScript e valendo-se do Framework NestJs como framework principal.

## Database

Para esse projeto, foi escolhido o SQLite como banco uma vez que se trata apenas de uma prova de conceito e, para tanto, ele é uma escolha que agrega muita simplicidade ao projeto.

## Environment

Para facilitar a execução do teste, o presente repositório conta com o arquivo `.env`. Vale ressaltar que não se trata de uma boa prática, tais informações devem ser compartilhadas por meio de vaults e canais seguros.

## Usuários

O JSON com os dados dos usuários cadastrados se encontram no repositório no arquivo `users.json`, juntamente com suas informações de login. Eles foram gerados aleatoriamente para fins de teste, contudo, o último usuário teve seu e-mail alterado para `sara.pinheiro@onfly.com.br`. Assim, para testar o envio de e-mail basta cadastrar uma nova despesa para ele.

## Execução via Docker

Basta executar

```bash
docker compose up --build
```

Ou, caso já tenha o gerenciador de pacotes NPM ou YARN instalados:

```bash
# Para yarn
yarn compose
# Ou para Npm
npm run compose
```

OBS: a aplicação será disponibilizada na porta `8080`.

## Instalação na máquina hospedeira com ambiente NodeJs prepado ([v19](https://nodejs.org/download/release/v19.9.0/))

```bash
# Install package.json dependencies
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod

# compose app in docker container
$ yarn compose
```

## Test

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```

## Endpoints

### Documentação swagger

A API tem seus endpoints documentados com swagger. Para acessar a documentação basta acessar:

```
GET: /doc
```
