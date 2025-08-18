#!/bin/bash
# Shebang line - tells the system to run this script with the Bash shell

# THIS script is used to import existing .env files to AWS Secrets Manager 

# Capture the first command-line argument as the environment name (dev, staging, prod)
ENV=$1
# Set the AWS region where secrets will be stored
REGION="ap-southeast-1"

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

# Print progress message with emoji indicator
echo "🔄 Importing .env.$ENV to AWS Secrets Manager..."

# Start a while loop to read the .env file line by line
# IFS= prevents trimming of leading/trailing whitespace
# -r prevents backslash escapes from being interpreted
while IFS= read -r line; do
  # Skip comment lines (starting with #) and lines without = (empty or invalid)
  # [[ ]] is bash's extended test command for pattern matching
  [[ $line == \#* || $line != *=* ]] && continue
  
  # Extract the key (everything before the first =)
  # ${line%%=*} removes the longest match of =* from the end
  key=${line%%=*}
  # Extract the value (everything after the first =)
  # ${line#*=} removes the shortest match of *= from the beginning
  val=${line#*=}
  
  # Print progress message for each key being imported
  echo "  ✅ Importing $key"
  
  # Try to create a new secret in AWS Secrets Manager
  # --name: The secret name with hierarchical path structure
  # --secret-string: The actual secret value
  # --region: AWS region where the secret will be stored
 
# 2>/dev/null: hides the error message that AWS returns if the secret already exists.
# || is a logical OR operator -> if the previous command fails, execute the next command
  # If create-secret fails (secret already exists), use put-secret-value instead
  # This updates the existing secret with a new value
  # --secret-id: Identifies the existing secret to update
  aws secretsmanager create-secret \
    --name "/t3-todo/$ENV/$key" \
    --secret-string "$val" \
    --region "$REGION" 2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "/t3-todo/$ENV/$key" \
    --secret-string "$val" \
    --region $REGION

# End of while loop - redirect input from the .env file
done < ".env.$ENV"

# Print success message when all secrets have been imported
echo "🎉 Successfully imported .env.$ENV to AWS Secrets Manager"