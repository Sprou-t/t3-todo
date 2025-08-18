#!/bin/bash
# Shebang line - tells the system to run this script with the Bash shell

# THIS script is used to import existing .env files to AWS Secrets Manager 

# Capture the first command-line argument as the environment name (dev, staging, prod)
ENV=$1
# Set the AWS region where secrets will be stored
REGION="ap-southeast-1"

echo "🔍 DEBUG: Starting script with ENV=$ENV, REGION=$REGION"

# Check if the environment argument was provided
# -z checks if the string is empty or null
if [ -z "$ENV" ]; then
  # $0 represents the script name, show usage instructions
  echo "Usage: $0 <environment> (dev|staging|prod)"
  # Exit with error code 1 to indicate failure
  exit 1
fi

# Check if the corresponding .env file exists for the specified environment
# -f tests if the file exists and is a regular file
if [ ! -f ".env.$ENV" ]; then
  # Print error message if file not found
  echo ".env.$ENV file not found!"
  # Exit with error code 1 to indicate failure
  exit 1
fi

# Test AWS credentials and permissions
echo "🔍 DEBUG: Testing AWS credentials..."
aws sts get-caller-identity --region "$REGION"

echo "🔍 DEBUG: Testing Secrets Manager permissions..."
aws secretsmanager list-secrets --region "$REGION" --max-items 3

# Print progress message with emoji indicator
echo "🔄 Importing .env.$ENV to AWS Secrets Manager..."

# Start a while loop to read the .env file line by line
# IFS= prevents trimming of leading/trailing whitespace
# -r prevents backslash escapes from being interpreted
while IFS= read -r line; do
  echo "🔍 DEBUG: Processing line: '$line'"
  # Skip comment lines (starting with #) and lines without = (empty or invalid)
  # [[ ]] is bash's extended test command for pattern matching
  [[ $line == \#* || $line != *=* ]] && continue
  
  # Extract the key (everything before the first =)
  # ${line%%=*} removes the longest match of =* from the end
  key=${line%%=*}
  # Extract the value (everything after the first =)
  # ${line#*=} removes the shortest match of *= from the beginning
  val=${line#*=}
  
  echo "🔍 DEBUG: Raw key='$key', Raw value length=${#val}"

  # Trim whitespace from key and value
  key=$(echo "$key" | tr -d '[:space:]')
  val=$(echo "$val" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  
  # Skip empty keys
  [[ -z "$key" ]] && continue
  
  # Define the secret name (without leading slash for put-secret-value)
  SECRET_NAME="t3-todo/$ENV/$key"
  
  # Print progress message for each key being imported
  echo "  ✅ Importing $key"
  echo "  📝 Secret name will be: /$SECRET_NAME"
  echo "  🔍 DEBUG: Create name='/$SECRET_NAME', Update name='$SECRET_NAME'"
  
  echo "🔍 DEBUG: Checking if secret exists..."
# aws secretsmanager describe-secret: AWS CLI command to get details about a specific secret
# --secret-id: Parameter specifying which secret to describe (uses the SECRET_NAME variable)
# --region: Specifies the AWS region to search in
# >/dev/null: Redirects standard output to null (suppresses successful output)
# 2>&1: Redirects standard error (2) to the same place as standard output (1), effectively suppressing all output
# The entire command is wrapped in an if statement to check the exit code (0 = success, non-zero = failure)
if aws secretsmanager describe-secret --secret-id "$SECRET_NAME" --region "$REGION" >/dev/null 2>&1; then
  echo "🔍 DEBUG: Secret EXISTS, will try to update"
  echo "🔄 DEBUG: Attempting put-secret-value..."
  
  # aws secretsmanager put-secret-value: AWS CLI command to update an existing secret's value
  # --secret-id: Identifies which existing secret to update (without leading slash)
  # --secret-string: The new secret value to store (from the $val variable)
  # --region: AWS region where the secret is located
  aws secretsmanager put-secret-value \
    --secret-id "$SECRET_NAME" \
    --secret-string "$val" \
    --region "$REGION"
  
  # $?: Special bash variable that contains the exit code of the last executed command
  # -eq: Numeric equality comparison operator in bash
  # 0: Success exit code in Unix/Linux systems
  if [ $? -eq 0 ]; then
    echo "    🔄 Updated existing secret"
  else
    echo "    ❌ Failed to update secret"
  fi
else
  # This else block executes when describe-secret fails (secret doesn't exist)
  echo "🔍 DEBUG: Secret does NOT exist, will try to create"
  echo "🔨 DEBUG: Attempting create-secret..."
  
  # aws secretsmanager create-secret: AWS CLI command to create a new secret
  # --name: The name for the new secret (with leading slash for hierarchical naming)
  # --secret-string: The secret value to store (from the $val variable)
  # --region: AWS region where the secret will be created
  aws secretsmanager create-secret \
    --name "$SECRET_NAME" \
    --secret-string "$val" \
    --region "$REGION"
  
  # Check the exit code of the create-secret command
  # $?: Contains the exit code of the previous command
  # -eq 0: Tests if the exit code equals 0 (success)
  if [ $? -eq 0 ]; then
    echo "    ✨ Created new secret"
  else
    echo "    ❌ Failed to create secret"
  fi
fi

# Print an empty line for better readability in the output
echo ""

# this done command feeds the correct .env file to the while loop to read line by line 
# Bash needs to know you’ve written the entire loop body before it knows where to send the input.
# in bash, it is while ...; do ... done
# < ".env.$ENV" tells bash "Use the contents of .env.[ENV] as input"
done < ".env.$ENV"

# Print success message when all secrets have been imported
echo "🎉 Successfully imported .env.$ENV to AWS Secrets Manager"