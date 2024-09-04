#!/bin/bash

# Define the base directory paths
base_dir=$(dirname "$0")
strategies_dir="$base_dir/StrategiesDataScripts"
results_dir="$base_dir/Results"

# Create the Results directory if it does not exist
mkdir -p "$results_dir"

# Check if the required arguments worker_ip and workers_count are provided
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Error: Missing required arguments."
    echo "Usage: $0 <worker_ip> <workers_count> [<folder_name> | <file_path>]"
    exit 1
fi

# Assign the required arguments to variables
worker_ip=$1
workers_count=$2

# Validate that workers_count is a positive integer
if ! [[ "$workers_count" =~ ^[0-9]+$ ]] || [ "$workers_count" -le 0 ]; then
    echo "Error: workers_count must be a positive integer."
    exit 1
fi

# Function to execute curl requests for each JSON file
execute_curl() {
    local json_file=$1
    local output_dir=$2

    # Loop through the specified number of workers and execute the curl command
    for ((i = 1; i <= workers_count; i++)); do
        port=$(printf "80%02d" $i)  # Format the port as 8001, 8002, ..., based on the workers count
        url="http://$worker_ip:$port/executeSubmission"
        echo "Executing for $json_file on $url"

        # Construct the output file name
        base_filename=$(basename "$json_file" .json)
        ip_formatted=$(echo "$worker_ip" | tr '.' '-')
        result_file="$output_dir/${base_filename}-${ip_formatted}-${port}-results.json"

        # Execute curl and save the output to the corresponding result file, formatted with jq
        curl -s -X POST -H 'content-type: application/json' -d @"$json_file" "$url" | jq . > "$result_file" &
    done
    wait
}

# If a folder name is provided as the third argument
if [ -n "$3" ] && [ -d "$strategies_dir/$3" ]; then
    folder="$strategies_dir/$3"
    output_folder="$results_dir/$3"
    mkdir -p "$output_folder"
    echo "Executing for all JSON files in folder: $folder"

    for json_file in "$folder"/*.json; do
        execute_curl "$json_file" "$output_folder"
    done

# If a specific file path is provided as the fourth argument
elif [ -n "$4" ] && [ -f "$4" ]; then
    json_file="$4"
    output_folder="$results_dir/$(basename "$(dirname "$json_file")")"
    mkdir -p "$output_folder"
    echo "Executing for specific file: $json_file"
    execute_curl "$json_file" "$output_folder"

# If no folder or file arguments are provided, execute for all JSON files in all subdirectories of StrategiesDataScripts
else
    echo "No folder or file arguments provided, executing for all JSON files in all subdirectories of StrategiesDataScripts"

    for folder in "$strategies_dir"/*; do
        if [ -d "$folder" ]; then
            output_folder="$results_dir/$(basename "$folder")"
            mkdir -p "$output_folder"
            for json_file in "$folder"/*.json; do
                execute_curl "$json_file" "$output_folder"
            done
        fi
    done
fi

echo "Execution completed. Results are stored in the Results folder."
