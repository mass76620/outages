# Outages

This repo contains code that fetch outages, filter them based on requirements and attach the device name to then POST them to an endpoint.

## Setup (This step in needed to run the tests and run the scripts)

Create a `.env` file at the root directory of the project and create `API_KEY` environment variable and set it with the API key provided in `api.yaml`.


## Test

Tests are written with jest in order to execute them, please run the following command:

```
  yarn run test
```

## Run

1. Install dependencies

```
  yarn 
```

2. Build the project

```
  yarn run build
```

3. Run the script

```
  yarn run start
```
