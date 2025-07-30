#!/bin/bash

# Read environment variables from .env file
source .env

# Build Docker image with all environment variables
docker build \
  --build-arg DATABASE_URL="$DATABASE_URL" \
  --build-arg AUTH_SECRET="$AUTH_SECRET" \
  --build-arg NODE_ENV="$NODE_ENV" \
  -t t3-todo . 