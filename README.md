
[![Build Status](https://travis-ci.org/madhums/node-express-mongoose-demo.svg?branch=master)](https://travis-ci.org/madhums/node-express-mongoose-demo)
[![Dependencies](https://img.shields.io/david/madhums/node-express-mongoose-demo.svg?style=flat)](https://david-dm.org/madhums/node-express-mongoose-demo)
[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/madhums/node-express-mongoose-demo)
[![Join Gitter Chat](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg?style=flat)](https://gitter.im/madhums/node-express-mongoose-demo?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Nodejs Express Mongoose Demo

This is a demo application illustrating various features used in everyday web development, with a fine touch of best practices. The demo app is a blog application where users can signup, create an article, delete an article and add comments etc.

Table of contents:

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Boilerplate](#boilerplate)
- [Install](#install)
- [Tests](#tests)
- [Docker](#docker)
- [License](#license)

<!-- /TOC -->

## Boilerplate

Want to build something from scratch? use the [boilerplate](https://github.com/madhums/node-express-mongoose)

* Checkout the [apps that are built using this approach](https://github.com/madhums/node-express-mongoose/wiki/Apps-built-using-this-approach)
* The [wiki](https://github.com/madhums/node-express-mongoose/wiki) is wip, it has some information about the way application is setup.

## Install

```sh
git clone git://github.com/madhums/node-express-mongoose-demo.git
npm install
cp .env.example .env
npm start
```

Then visit [http://localhost:3000/](http://localhost:3000/)

**NOTE:** Do not forget to set the twitter, google, linkedin and github `CLIENT_ID`s and `SECRET`s. In `development` env, you can set the env variables in `.env` and replace the values there. In `production` env, it is not safe to keep the ids and secrets in a file, so you need to set it up via commandline. If you are using heroku checkout how environment variables are set [here](https://devcenter.heroku.com/articles/config-vars).

## Tests

```sh
npm test
```

## Docker

You can also use docker for development. Make sure you run npm install on your host machine so that code linting and everything works fine.

```sh
npm i
cp .env.example .env
```

Start the services

```sh
docker-compose up -d
```

View the logs

```sh
docker-compose logs -f
```

In case you install a npm module while developing, it should also be installed within docker container, to do this first install the module you want with simple `npm i module name`, then run it within docker container

```sh
docker-compose exec node npm i
```

If you make any changes to the file, nodemon should automatically pick up and restart within docker (you can see this in the logs)

To run tests

```sh
docker-compose exec -e MONGODB_URL=mongodb://mongo:27017/noobjs_test node npm test
```

Note that we are overriding the environment variable set in `.env` file because we don't want our data erased by the tests.

Note: The difference between exec and run is that, exec executes the command within the running container and run will spin up a new container to run that command. So if you want to run only the tests without docker-compose up, you may do so by running `docker-compose run -e MONGODB_URL=mongodb://mongo:27017/noobjs_test node npm test`

## License

MIT
