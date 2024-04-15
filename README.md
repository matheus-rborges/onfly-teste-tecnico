# Teste Técnico (Tech Lead)

O presente projeto corresponde à etapa de teste técnico da empresa OnFly do participante Matheus Rodrigues Borges para a posição de Tech Lead.

## Linguagem e framework

O presente projeto foi escrito utilizando-se a linguagem TypeScript e valendo-se do Framework NestJs como framework principal.

## Database

Para esse projeto, foi escolhido o SQLite como banco uma vez que se trata apenas de uma prova de conceito e, para tanto, ele é uma escolha que agrega muita simplicidade ao projeto.

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

```
GET: /doc
```

Conta com a página de swagger para teste e documentação da API.
