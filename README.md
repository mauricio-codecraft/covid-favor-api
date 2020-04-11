# 1SimplesFavor API

1SimplesFavor API supports the frontend application with a set of methods for user account creation, offer and help request maintainance.

### Requirements

- [Install the Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/installation/)
- [Configure your AWS CLI](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

### Installation

- You should install serverless offline to run your application:

``` bash
$ npm i -g serverless-offline
```

- Initialize DynamoDB - this initializes DynamoDB offline in your project folder

``` bash
$ sls dynamodb install
```

- Create the dynamodb admin. This gives us a good GUI to view our DynamoDB tables

``` bash
$ npm install dynamodb-admin -g
$ dynamodb-admin
```

### Usage

- Start the offline application

``` bash
$ sls offline start --stage dev
```

- production deploy

``` bash
$ sls deploy --stage prod
```
#### Running Tests

Run your tests using

``` bash
$ npm test
```

We use Jest to run our tests. You can read more about setting up your tests [here](https://facebook.github.io/jest/docs/en/getting-started.html#content).

#### Environment Variables

To add environment variables to your project

1. Rename `env.example` to `.env`.
2. Add environment variables for your local stage to `.env`.
3. Uncomment `environment:` block in the `serverless.yml` and reference the environment variable as `${env:MY_ENV_VAR}`. Where `MY_ENV_VAR` is added to your `.env` file.
4. Make sure to not commit your `.env`.

#### Linting

We use [ESLint](https://eslint.org) to lint your code via the [serverless-bundle](https://github.com/AnomalyInnovations/serverless-bundle) plugin.

You can turn this off by adding the following to your `serverless.yml`.

``` yaml
custom:
  bundle:
    linting: false
```

To [override the default config](https://eslint.org/docs/user-guide/configuring), add a `.eslintrc.json` file. To ignore ESLint for specific files, add it to a `.eslintignore` file.

### Support

- Open a [new issue](https://github.com/mauricio-codecraft/covid-favor-api/issues) if you've found a bug or have some suggestions.
- Or submit a pull request!

