# ![favicon](./public/img/favicon.svg) Yz web application

This application is designed as a **craft-app**. The idea here, is to experiment
the `deno` ecosystem.

### Specifications

- **Language** : [Typescript](https://www.typescriptlang.org/) |
  [Javascript](https://tc39.es/ecma262/)
- **Runtime** : [deno](https://deno.com/)
- **Framework** : [oak](https://deno.land/x/oak)
- **Database** : [mongodb](https://www.mongodb.com/)

The application configuration is define in the `deno.json` file. It's the ID
card of the project, where alias to the main folders, compiler options and
dependencies import are set.

## How does it works ?

First of all, you have to install a **_MongoDB_** tool on your machine.

- You can download
  [_MongoDB compass_](https://www.mongodb.com/try/download/compass), a **user
  friendly tool** to handle interaction with the database.
- If you prefer command line tools, you can download the
  [_MongoDB Shell_](https://www.mongodb.com/try/download/shell) or the
  [_Atlas CLI_](https://www.mongodb.com/try/download/atlascli).

After your DB configuration, you have to create a `.env` file, to set your
**environnement variables**. Check the `.env.example` file to identify the
necessary keys you have to set :

```
APP_ENV="local"
PORT=3000
HOST=127.0.0.1
APP_URL="http://127.0.0.1:3000"
APP_SESSION_NAME="your_session_name"
DATABASE_HOST="your/database/url"
DATABASE_USERNAME="your_database_username"
DATABASE_PASSWORD="your_database_password"
EMAIL_ADDRESS="your_email_address"
EMAIL_USERNAME="your_email_username"
EMAIL_PASSWORD="your_email_password"
```

Then, you can start working with the applicatiton by running this command :

```sh
deno task start
```

It run the server with the flags `--allow-write` `--allow-read` `--allow-net`,
which allow you to write files, read files and connect to the internet.

## What is the architecture ?

### Server side :

- `main.ts` creates the **oak.Application** with the **_MongoDB_** _Session_
  middleware, the router routes and the static files middleware.
- After been created, the router, is injected into every **controllers**.
- The **default controller** manage the html rendering and the implementation of
  the responses (based on a [http](./server/utils/http.ts) instance). The others
  controllers, except the ApiController, inherit from its `prototype`.
- The **html** rendering is made by the **components** which basically returns
  large html `string`. They are organize in different folders, inspired by the
  **Atomic Design** methodology.
- The mongo folder implements a **static class** to manage the connexion with
  the DB.
- The **static text contents** of the application is driven by the json files in
  the [data](./server/data/) folder.

### Client side :

- The basics **css**, **img**, **js** folders, request by the client on every
  routes.

## Is the app has tests ?

Yes, of course. There are **[tests](./tests/)** for utils classes. Run this command below to see them :

```sh
deno task test
```
