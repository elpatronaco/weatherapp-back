# WeatherApp Back

## First steps

### Database

Before deploying this server a mongoDB cluster needs to be created. You can use [the DBaaS _mongoDB Atlas_](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/). Then you'll create a user with Write/Read success and set the URI on the _.env_ file.

### Environment variables

Change the Port in the environment variables to the one you prefer. For password salting/hashing we need a random Sign Key and the number of salt rounds (the more salt rounds, the safer the salted password). You can create a pseudo-random Sign Key with the node package _crypto_. An example can be

```console
node
```

for entering the node console and

```console
require("crypto").randomBytes(64).toString("hex")
```

## How to Deploy

First, install the dependencies needed for the app to work with the command `npm install`. This command installs both dev dependencies and production dependencies.

### Dev mode

Command `npm run start:dev` runs the server for development purposes in port 3000. This should not be used in production

### Production mode

#### Old way

Compile the app to plain javascript and optimized for production mode with `npm run build`. This will create a directory named **dist**. Dev dependencies are no longer needed, so we'll delete them with

- Linux

```console
foo@bar:~$ sudo rm -r -f node_modules
```

- Windows

```console
PS C:\app> rmdir -r node_modules
```

To install production dependencies, just run `npm i only=production`. To run the app, just run the app with `npm start`

#### Dockerized

The easier way is to run a Docker container. Go to dockerfile and change the exposed port to the one you set in the _.env_ file. To build the docker image go to the console and run this command

```console
docker build --tag example .
```

(with _example_ being the name you want to set the docker image). To deploy it on AWS you can follow [this tutorial](https://aws.amazon.com/es/getting-started/hands-on/deploy-docker-containers/)
