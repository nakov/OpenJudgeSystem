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

# Function to extract the expected result types and counts from the comment at the beginning of the JSON file
extract_expected_results() {
    local json_file=$1
    # Extract the comment line from the file, assuming it's the first line
    local comment=$(grep '^//' "$json_file" | head -n 1)
    # Remove the leading slashes and trim any leading whitespace
    echo "${comment#// }"
}

# Function to read only the JSON content from the file, ignoring lines that start with '//'
read_json_content() {
    local json_file=$1
    # Read the file excluding lines starting with '//' and combine into one JSON structure
    json_content=$(grep -v '^//' "$json_file")
    echo "$json_content"
}

# Function to execute curl requests for each JSON file
execute_curl() {
    local json_file=$1
    local output_dir=$2
    local test_index=$3
    # Extract and clean (remove comments) the expected results comment
    local expected_results=$(extract_expected_results "$json_file")
    local json_content=$(read_json_content "$json_file")

    # Loop through the specified number of workers and execute the curl command
    for ((i = 1; i <= workers_count; i++)); do
        # Construct the URL for the curl request with appropriate port number
        port=$(printf "80%02d" $i)  # Format the port as 8001, 8002, ..., based on the workers count
        url="http://$worker_ip:$port/executeSubmission"
        echo "Executing for $json_file on $url"

        # Construct the output file name for the results
        base_filename=$(basename "$json_file" .json)
        ip_formatted=$(echo "$worker_ip" | tr '.' '-')
        result_file="$output_dir/results-summary.json"

        # Execute curl with the cleaned JSON content and format the output using jq
        test_result=$(echo "$json_content" | curl -s -X POST -H 'content-type: application/json' -d @- "$url" | jq .)

        # Check if the test result is valid JSON and contains testResults
        if [ -z "$test_result" ] || ! echo "$test_result" | jq -e '.' > /dev/null; then
            echo "Error: Failed to fetch or parse the result for $json_file on $url"
            echo "Test #$test_index: $base_filename" >>"$result_file"
            echo "$expected_results - Error: Invalid response" >>"$result_file"
            echo -e "\n" >>"$result_file"
            continue
        fi

        # Append the test results to the summary file with proper formatting
        {
            echo "// Test #$test_index: $base_filename"
            echo "// Expected: $expected_results"
            echo "$test_result"
            echo -e "\n"
        } >>"$result_file"
    done
}

# Main logic to execute the script based on provided arguments

# If a folder name is provided as the third argument
if [ -n "$3" ] && [ -d "$strategies_dir/$3" ]; then
    folder="$strategies_dir/$3"
    output_folder="$results_dir/$3"
    mkdir -p "$output_folder"
    echo "Executing for all JSON files in folder: $folder"
    test_index=1

    # Iterate over each JSON file in the specified folder
    for json_file in "$folder"/*.json; do
        execute_curl "$json_file" "$output_folder" "$test_index"
        test_index=$((test_index + 1))
    done

# If a specific file path is provided as the fourth argument
elif [ -n "$4" ] && [ -f "$4" ]; then
    json_file="$4"
    output_folder="$results_dir/$(basename "$(dirname "$json_file")")"
    mkdir -p "$output_folder"
    echo "Executing for specific file: $json_file"
    execute_curl "$json_file" "$output_folder" 1

# If no folder or file arguments are provided, execute for all JSON files in all subdirectories of StrategiesDataScripts
else
    echo "No folder or file arguments provided, executing for all JSON files in all subdirectories of StrategiesDataScripts"
    test_index=1

    # Iterate over all folders in StrategiesDataScripts and execute for each JSON file found
    for folder in "$strategies_dir"/*; do
        if [ -d "$folder" ]; then
            output_folder="$results_dir/$(basename "$folder")"
            mkdir -p "$output_folder"
            for json_file in "$folder"/*.json; do
                execute_curl "$json_file" "$output_folder" "$test_index"
                test_index=$((test_index + 1))
            done
        fi
    done
fi

echo "Execution completed. Results are stored in the Results folder."