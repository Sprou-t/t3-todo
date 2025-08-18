#!/bin/bash

# Fetch secrets from AWS Secrets Manager
echo "Fetching secrets from AWS Secrets Manager..."

# Get secrets and export as environment variables
export DATABASE_URL=$(aws secretsmanager get-secret-value --secret-id t3-todo/database-url --query SecretString --output text)
export AUTH_SECRET=$(aws secretsmanager get-secret-value --secret-id t3-todo/auth-secret --query SecretString --output text)

# Start the application
exec node server.js 