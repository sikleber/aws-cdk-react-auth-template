# aws-cdk-react-auth-template

This project is a template for creating a React application hosted on AWS and deployed using the AWS Cloud Development Kit (CDK).

**Note:** Web app domain will be created within the GitHub Actions CD workflow and outputted to its summary.

The application consists of two TypeScript projects using NPM:

## Frontend Project
See the [frontend package.json](frontend/package.json) for relevant scripts.

To enable the command `npm run serve` you need to create a `.env.dev` file in the `frontend` directory with the following environment variables:
```bash
COGNITO_USER_POOL_ID=<COGNITO_USER_POOL_ID>
COGNITO_USER_POOL_CLIENT_ID=<COGNITO_USER_POOL_CLIENT_ID>
COGNITO_REGION=<COGNITO_REGION>
```
For `npm run build` a similar `.env.build` file is required.

### Amplify Frontend SDK
The frontend uses the [Amplify Frontend SDK](https://docs.amplify.aws/react/) to interact with the AWS Cognito User Pool and provide a basic authentication UI.

See [Amplify Custom Configuration](https://docs.amplify.aws/react/reference/amplify_outputs/#custom-configuration) for more information on how to use the SDK without the Amplify CLI or Amplify Console.

## Infrastructure Project
See the [infrastructure package.json](infrastructure/package.json) for relevant scripts.

Deploy the infrastructure using the following commands:
```bash
cdk deploy --all --context config=dev --profile <profile> --region <region>
```

The [cdk.json](infrastructure/cdk.json) file tells the CDK Toolkit how to execute your app.

### Infrastructure Overview
<img alt="Infrastructure" src="docs/infrastructure.drawio.png" style="width: 50%; background-color: white;">

### Custom Configuration Settings
The [infrastructure/config.ts](infrastructure/src/config.ts) reads the configuration specified by the `--context config=<CONFIG_NAME` parameter when deploying the CDK stack.
Defined settings can be passed to underlying constructs.


## GitHub Actions CI/CD
This project uses GitHub Actions for CI/CD. Two workflows are defined in the [.github/workflows](.github/workflows) directory:
- [ci.yml](.github/workflows/ci.yml) - runs on every push to any branch except `main`
- [cd.yml](.github/workflows/cd.yml) - runs on every push to `main` and deploys the application to AWS

To use the CD workflow and deploy the application an AWS account, you need to set up the following secrets in your GitHub repository:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Before the first deployment, you may need to bootstrap the CDK in your AWS account (see: [Bootstrapping](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html)).:
```bash
npx cdk bootstrap aws://<account>/<region>
```

The CDK outputs are displayed in the GitHub CD workflow run summary.
There you also find the URL to the deployed application.
