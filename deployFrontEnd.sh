#!/bin/bash

# Source and destination paths
source_path="./dist/ibescore_2/"  # Current directory

# Prompt for the project name
read -p "Enter the project name: " project_name

# Check if the project name is provided
if [ -z "$project_name" ]; then
    echo "Project name is required."
    exit 1
fi

# Construct the destination path and ssh paths
destination_path="rob@13.41.104.238:/home/apps/$project_name/"
destination_hostname="rob@13.41.104.238"
destination_directory="/home/apps/$project_name/"

# Delete old files first
ssh -i ~/.ssh/personal_database.pem "$destination_hostname" \
"rm -rf $destination_directory*.js \
$destination_directory*.css \
$destination_directory*.html"

# Run rsync over SSH
rsync -avz --update --exclude "*.sh" --exclude "*.md" -e "ssh -i ~/.ssh/personal_database.pem" "$source_path" "$destination_path"

# Check rsync exit status
if [ $? -eq 0 ]; then
    echo "Successfully synchronized."
else
    echo "Synchronization encountered errors."
fi
