
### Samar Insurance API - This is the backbone of the Samar Insurance application. Samar Insurance application is a software that helps in daily routine work, and generate reports for business records and reviews.

[![CodeFactor](https://www.codefactor.io/repository/github/hesbon5600/brooks-insurance-api/badge?s=01288c381b0c90786afffb7f680081d8a363e8a8)](https://www.codefactor.io/repository/github/hesbon5600/brooks-insurance-api)

[![Brooks Insurance API](https://github.com/ACTSERV/brooks-insurance-api/actions/workflows/brooks-insurance.yml/badge.svg?branch=develop)](https://github.com/ACTSERV/brooks-insurance-api/actions/workflows/brooks-insurance.yml)

#### Api Documentation

- use this [link](http://134.209.28.109:8087/api/v1/graphql/) to access the api documentation

> ## How to set up the project.

### Features.

- python 3
- postgreSQL as database engine
- pipenv
- redis

---

### Installation.

- clone the repository

```
$ https://github.com/ACTSERV/brooks-insurance-api.git
```

- cd into the directory

```
$ cd brooks-insurance-api
```

- Run pipenv

```
$ pipenv install
```

- After dependencies are installed, run the virtual environment

```
$ pipenv shell
```

- create environment variables
  On Unix or MacOS, run:

```
$ touch .env
```

open .env file and enter your corresponding database details as follows

```
DB_NAME=<DB name>
DB_USER=<Db User>
DB_HOST=<DB host>
DB_PASSWORD=<DB Password>
export SENDGRID_API_KEY=<Sendgrid API key>
export EMAIL_HOST="smtp.sendgrid.net"
export EMAIL_HOST_USER=<Sendgrid Username>
export EMAIL_HOST_PASSWORD=<Sendgrid password>
export EMAIL_PORT=587
export EMAIL_SENDER="samar-insurance-api@no-reply.com"
export VERIFY_URL_DEV="http://127.0.0.1:8000/api/v1/"com
export DJANGO_SETTINGS_MODULE=app.settings.development


```

Note: There is no space next to '='

---

##### On terminal,

```
$ source .env
```

- make migrations

```
$ python manage.py makemigrations
$ python manage.py migrate
```

- Run the application

```
python manage.py runserver
```

- Testing the application

```
$ python manage.py test --verbosity=2
```

---

**Running Redis server**

- You can install redis by running the command `bash redis.sh` in the root project directory, this will install redis for you (if not already installed) and also run/start the redis server for the first time on your local machine.

**Running Celery worker**
Please endevour to update the `.env` file with the following keys and the appropriate values(`redis_server_url`):
`export CELERY_BROKER_URL=<Your_Redis_Server_URL>`

---

- To run redis after it has been stopped run `redis-server`

- In a new terminal tab run the Celery Message Worker with:

  ```
    celery -A app worker -l info --pool=gevent --concurrency=1000
  ```

## API documentation
> For the API documentation, Go to insomnia and import `Insomnia.json` located in the project base directory

> The API url is:

```
{base-url}/api/v1/graphql/
```

---

## API Spec

The preferred JSON object to be returned by the API should be structured as follows:

##### Pull Request Process

- A contributor shall identify a task to be done from the [pivotal tracker](https://www.pivotaltracker.com/).If there is a bug , feature or chore that has not been included among the tasks, the contributor can add it only after consulting the owner of this repository and the task being accepted.
- The Contributor shall then create a branch off the `develop` branch where they are expected to undertake the task they have chosen.
- Contributors are required to activate the git pre-commit hook to auto format staged Python files to pep8 with yapf and check for residual pep8 linting errors using pylint.
  All commits are required to pass all checks from the pre-commit hook.
  The pre-commit hook can be installed as follows:
  Option 1: Copy the `hooks/pre-commit` file into the `.git/hooks` directory.
  You will need to do this every time the `hooks/pre-commit` file is changed.
  Option 2: Create a file `.git/hooks/pre-commit` then create a symlink to this file by running the command:
  `ln -s -f ../../hooks/pre-commit .git/hooks/pre-commit`
  You will only need to do this once for your local repository.
- Although highly discouraged, the pre-commit hook can be bypassed by passing the `--no-verify` flag to the commit command as follows:
  `git commit --no-verify -m "commit message"`
- After undertaking the task, a fully detailed pull request shall be submitted to the owners of this repository for review.
- If there any changes requested ,it is expected that these changes shall be effected and the pull request resubmitted for review.Once all the changes are accepted, the pull request shall be closed and the changes merged into `develop` by the owners of this repository.
