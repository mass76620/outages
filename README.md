# Outages

This repo contains code that fetches outages, filters them based on requirements and attaches the device name and finally POST them to an endpoint.

## Setup (This step in needed to run the tests and run the scripts)

Create a `.env` file at the root directory of the project and create `API_KEY` environment variable and set it with the API key provided in `api.yaml`.

```
API_KEY={TO_BE_REPLACE}
ENDPOINT=https://api.krakenflex.systems/interview-tests-mock-api/v1
```

## Test

Tests are written with jest in order to execute them. Run the following command:

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
