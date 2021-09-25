# premise_backend
Premise Backend

A Node.js backend to a demo application.

It provides routes for CRUD operations for a dummy demo application with authentication/authorization via Jwt token.

You can pull the docker image at this address: https://hub.docker.com/r/fb040974/premise-backend

A 'MONGO_URL' environment variable for the URL of a running MondoDB  instance must be provided. By default, this variable is already set for a free online version of Mongo database at https://www.mongodb.com/. However, as a demo database server, it can stop at any time.

####File [deploy.sh](deploy.sh) is a complete script with four main tasks:
1. build the docker image
2. push it to Docker-Hub
3. deploy that image for the corresponding Kubernetes cluster set in the machine using kubectl, accordingly to
[deployment.yml](deployment.yml) 
4. config a horizontal autoscaling for pods based on cpu use

####File [user.test.js](./tests/unit/model/user.test.js) provides a Unit test to check the Jwt build function.



