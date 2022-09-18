# sxi backend

This repository contains the SovTech Core backend code, powered by Strapi @ `3.0.4`

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before we get started, we're going to need to make sure we have a few things installed and available on our machine.

#### Node >= 12

##### MacOS

```bash
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

##### Other

See the installation guides available @ nodejs.org:

https://nodejs.org/en/download/package-manager/

#### Yarn

```bash
npm i -g yarn
```

### Installing

Below is a series of step by step instructions that tell you how to get a development env running.

Create a local clone of the repository

```
git clone git@bitbucket.org:sovtech/sxi-backend.git
```

Enter the cloned repositories' directory

```
cd sxi-backend
```

Install the projects dependencies

```
yarn
```

Start the projects development server

```
yarn develop
```

Start the projects development server - with hot reloading

```
yarn develop --watch-admin
```

The project should now be available at http://localhost:1337 or http://localhost:8000

You will first be greeted with a registration page, as by default Strapi uses the `development` environment configuration, which points to a sqlite db on your local machine (this does not exist until first run).

## Environment Variables

These are the environment variables required to successfully deploy the application.

### Repository Variables

| key                   | description                                       |
| --------------------- | ------------------------------------------------- |
| ECS_CLUSER_NAME       | ECS Cluster Name                                  |
| AWS_ACCESS_KEY_ID     | AWS IAM access key with deploy permissions        |
| AWS_SECRET_ACCESS_KEY | AWS IAM secret access key with deploy permissions |
| DATABASE_USERNAME     | Aurora DB Username                                |
| DATABASE_PASSWORD     | Aurora DB Password                                |
| DATABASE_HOST         | Aurora DB endpoint                                |
| DATABASE_PORT         | Aurora DB Port                                    |

### Deployment Variables

Each of the below keys need to be applied to each deployment (dev, uat, prod) and their values will be dependant on the environment.

| key              | description                                       |
| ---------------- | ------------------------------------------------- |
| HOST             | Deployed Strapi instance host                     |
| DATABASE_NAME    | Name of env specific db                           |
| ECR_REPO_URI     | ECR repo url                                      |
| NODE_ENV         | Node env to use in deployment                     |
| ECR_REPO_NAME    | ECR repo name                                     |
| ECS_TASK_FAMILY  | ECS task family                                   |
| ECS_SERVICE_NAME | ECS service name                                  |
| STAGE            | Current release stage                             |
| CLIENT_HOST      | Url of hosted frontend client (includes protocol) |

## Environments

Below is a detailed list of the current deployed environments, how they can accessed and any other relevant information.

### Development

> This environment is deployed to automatically on every merge to the `develop` branch.

**Access**
This environment can be accessed using the credentials below.

| Portal  | Endpoint                                    | Username | Password    |
| ------- | ------------------------------------------- | -------- | ----------- |
| Admin   | https://backend-dev.sxi.sovtech.org/admin/  | core     | Sovtech123! |
| User    | https://dev.sxi.sovtech.org/                |          |             |
| GraphQL | https://backend-dev.sxi.sovtech.org/graphql |          |             |

### Staging

> This environment is deployed to automatically on every merge to the `master` branch.

**Access**
This environment can be accessed using the credentials below.

| Portal  | Endpoint                                    | Username | Password    |
| ------- | ------------------------------------------- | -------- | ----------- |
| Admin   | https://backend-uat.sxi.sovtech.org/admin/  | core     | Sovtech123! |
| User    | https://uat.sxi.sovtech.org/                |          |             |
| GraphQL | https://backend-uat.sxi.sovtech.org/graphql |          |             |

### Production

> This environment is deployed to manually by promoting a build from the `master` branch.

**Access**
This environment can be accessed using the credentials below.

| Portal  | Endpoint                                     | Username | Password    |
| ------- | -------------------------------------------- | -------- | ----------- |
| Admin   | https://backend-prod.sxi.sovtech.org/admin/  | core     | Sovtech123! |
| User    | https://prod.sxi.sovtech.org/                |          |             |
| GraphQL | https://backend-prod.sxi.sovtech.org/graphql |          |             |

## Deployment

Deployments are handled by bitbucket pipelines, below is an overview of how the deployments work:

1. A docker container image is built using the code from this repository, see [Dockerfile](Dockerfile)
2. The resulting image is uploaded to an [Amazon ECR](https://aws.amazon.com/ecr/) repository.
3. An [Amazon ECS Task Definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) file is created based off the [task-definition.json](task-definition.json) template.
4. The resulting task definition and docker image uri are used by the _[Bitbucket Pipelines Pipe: AWS ECS deploy](https://bitbucket.org/atlassian/aws-ecs-deploy)_ to deploy the built image to [Amazon ECS](https://aws.amazon.com/ecs/)

In addition to the above mentioned deployed environments

## Go Live Considerations

- Environment variables
  - set `NODE_ENV` variable to `production` - this enables the strapi `production` environment options under `config/environments/**` it also disables admin actions such as creating new content types, updating content types and configuring views.
- AWS Resources
  - bump the configured cpu and memory for the production task definition. By default, we allocate 256 cpu units and 512mb memory to reduce hosting costs while in development (dev envs see very little traffic).

## Networking

### DNS records

DNS records are managed by AWS Route53. Each record is an A alias record points to a Cloudfront distribution.

### Cloudfront CDN

All static assets are distributed via Cloudfront. Each environment has it's own Cloudfront distribution. Distributions are invalidated on every deployment.

## Security

### SSL certificates

SSL certificates are managed by AWS certificate manager. Certificates are issued for `sxi.sovtech.org` and `*.sxi.sovtech.org` in the `us-east-1` region.
Certificates are auto renewed by AWS certificate manager granted the validation records are still present.

## Built With

Details of the tech stack that has been used.

- [React](https://reactjs.org/) - Client Framework
- [Strapi](https://strapi.io/) - Server Framework

## Architecture

A basic architecture diagram or description of the chosen architecture should be detailed here.
![ERD](ERD.jpg)

## Infrastructure

A list of infrastructure requirements

- AWS VPC
- AWS RDS
- AWS ECS
- AWS IAM
- AWS ECR
- AWS ELB

## Services

A list of all services used in this project.

| Service Name | Owner/Admin      | Service Details                                                                              |
| ------------ | ---------------- | -------------------------------------------------------------------------------------------- |
| AWS          | aws+sxi@sov.tech | Access the sxi org using IAM credentials, here https://sovtech.signin.aws.amazon.com/console |

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on the SovTech standard for commit messages and the accepted pull request process.

## Versioning

We use [SemVer](http://semver.org/) for versioning. Versioning occurs automatically in the pipelines using [Semantic Release](https://github.com/semantic-release/semantic-release). For the versions available, see the tags on this repository.

## Changelog

A running changelog can be found here: [CHANGELOG.md](CHANGELOG.md)

## Authors

- **Nusrath Khan** <nus@sov.tech>

## Licenses

Place the result of `npx license-checker --summary` here

```
├─ MIT: 1201
├─ ISC: 95
├─ BSD-3-Clause: 49
├─ Apache-2.0: 30
├─ BSD-2-Clause: 21
├─ (CC-BY-4.0 AND MIT): 3
├─ BSD*: 2
├─ MIT*: 2
├─ (CC-BY-4.0 AND OFL-1.1 AND MIT): 1
├─ (MIT OR Apache-2.0): 1
├─ CC-BY-4.0: 1
├─ Apache*: 1
├─ (MIT OR WTFPL): 1
├─ (OFL-1.1 AND MIT): 1
├─ UNLICENSED: 1
├─ Apache 2.0: 1
├─ AFLv2.1,BSD: 1
├─ (BSD-3-Clause OR GPL-2.0): 1
├─ (MIT AND Zlib): 1
├─ (WTFPL OR MIT): 1
├─ (BSD-2-Clause OR MIT OR Apache-2.0): 1
├─ CC0-1.0: 1
├─ (MIT AND BSD-3-Clause): 1
├─ 0BSD: 1
├─ Unlicense: 1
└─ (MIT OR CC0-1.0): 1
```

## Troubleshooting

Below are a few common issues users experience - including an overview of their possible cause and solutions.

- New deployments don't reflect changes.
  > **Possible Cause:** Task failed to deploy
  > **Solution**: Check the logs under ECS > Cluster > Service > Logs > Stopped

## Frequently Asked Questions

**Why can't I create or update content-types in production/staging**

> Strapi stores model configuration files (what defines the model schema) in files such as api/restaurant/models/restaurant.settings.json. Due to how Node.js works, in order for changes to take effect, that would require Node to restart the server. This could potentionally cause downtime of your production service and likewise these changes should be tracked in some kind of source control.

> Generally your "flow" of development would follow the following path:

> Development - Develop your Strapi application locally on your host machine, then push changes into source control
> Staging - Deploy changes from source control to a "production-like" environment for testing
> Production - If no other changes are needed, deploy into production
> Repeat as needed, it is recommended that you properly version and test your application as you go
> At this time and in the future there is no plan to allow model creating or updating while in a production environment, and there is currently no plans to move model settings into the database. There is no known nor recommended workarounds for this.

**Does Strapi handle deploying or migrating of content**

> Strapi does not currently provide any tools for migrating or deploying your data changes between different environments (ie. from development to production).

> With the release of the stable version (current ETA end of May 2020), there will be a CLI based migration command, and eventually this will be expanded into the AdminUI migration feature as well as a data import and export option in the future, current ETA is around Q3 of 2020.

**User can't login to the admin panel**

> With the release of the Strapi beta version a fundamental change occurred in that the "end-users" (REST and GraphQL users) were split from the Administrators (admin panel users) in such a way that normal users can not be given access to the admin panel. If you would like to read more on why this change was done, you can read the Strapi blog post about it.

> In the future Strapi does plan to implement a solution where Administrators could use the REST and GraphQL routes like a standard 3rd party provider, but there is no intention of allowing for the reverse. Instead within Q1/Q2 2020 we plan to offer a plugin called Administrators Roles & Permissions that will allow you to control access to Administrators within the admin panel. As of right now there is no work around to currently do this, anyone with access to the admin panel will have full access to all parts of it.

**Relations aren't maintaining their sort order**

> With the components there is a hidden field called order that allows entries to maintain their sort, however with relations there is no such field. If you consider the typical count of of component entries vs relational based entries (in retrospect they function in the backend the same) there is generally a much higher number of relations. If relations were to have an order field applied to them as well it could cause significant performance degradation when trying to update the order, and likewise in the case where a relation could be attached to multiple entries it would be quite difficult to maintain the order.

> For the time being there is no recommended way to handle this automatically and instead it may be required for you to create custom controllers to handle this within your own project.
