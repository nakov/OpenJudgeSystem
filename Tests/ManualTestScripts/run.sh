#!/bin/bash

# Define color codes
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Define the base directory paths
base_dir=$(dirname "$0")
strategies_dir="$base_dir/StrategiesDataScripts"
results_dir="$base_dir/Results"

# Create the Results directory if it does not exist
mkdir -p "$results_dir"

# Default values
port=""
workers_count=""

# Parse arguments
args=()
while [[ $# -gt 0 ]]; do
    case "$1" in
        --port)
            port="$2"
            shift 2
            ;;
        --workers)
            workers_count="$2"
            shift 2
            ;;
        *)
            args+=("$1")
            shift
            ;;
    esac
done

# Set positional parameters to the non-option arguments
set -- "${args[@]}"

# Check if worker_ip is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Missing required argument worker_ip.${NC}"
    echo -e "${RED}Usage: $0 <worker_ip> [--port <port> | --workers <workers_count>] [<folder_name> | <file_path>]${NC}"
    exit 1
fi

worker_ip="$1"
shift

# Ensure that at least one of --port or --workers is specified
if [ -z "$port" ] && [ -z "$workers_count" ]; then
    echo -e "${RED}Error: Either --port or --workers must be specified.${NC}"
    exit 1
fi

if [ -n "$port" ] && [ -n "$workers_count" ]; then
    echo -e "${RED}Error: Cannot specify both --port and --workers.${NC}"
    exit 1
fi

if [ -n "$workers_count" ]; then
    # Validate that workers_count is a positive integer
    if ! [[ "$workers_count" =~ ^[0-9]+$ ]] || [ "$workers_count" -le 0 ]; then
        echo -e "${RED}Error: workers_count must be a positive integer.${NC}"
        exit 1
    fi

    # Generate array of ports based on workers_count
    ports=()
    base_port=8000
    for (( i = 1; i <= workers_count; i++ )); do
        ports+=($((base_port + i)))
    done
fi

# If port is specified, use it as the only port
if [ -n "$port" ]; then
    ports=("$port")
fi

# Initialize test_index as a global variable
test_index=1

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

# Function to execute curl requests for each JSON file and each port
execute_curl() {
    local json_file=$1
    local result_file=$2

    # Extract and clean (remove comments) the expected results comment
    local expected_results=$(extract_expected_results "$json_file")
    local json_content=$(read_json_content "$json_file")

    for port in "${ports[@]}"; do
        url="http://$worker_ip:$port/executeSubmission"
        echo -e "Executing for ${BLUE}$json_file${NC} on ${YELLOW}$url${NC}"

        # Execute curl with the cleaned JSON content and format the output using jq
        test_result=$(echo "$json_content" | curl -s -X POST -H 'content-type: application/json' -d @- "$url" | jq .)

        # Check if the test result is valid JSON
        if [ -z "$test_result" ] || ! echo "$test_result" | jq -e '.' > /dev/null; then
            echo -e "${RED}Error: Failed to fetch or parse the result for ${BLUE}$json_file${NC} on ${YELLOW}$url${NC}"
            echo "Test #$test_index: $(basename "$json_file" .json)" >>"$result_file"
            echo "$expected_results - Error: Invalid response" >>"$result_file"
            echo -e "\n" >>"$result_file"
        else
            # Append the test results to the summary file with proper formatting, including the worker endpoint
            {
                echo "// Test #$test_index: $(basename "$json_file" .json) (Endpoint: $worker_ip:$port)"
                echo "// Expected: $expected_results"
                echo "$test_result"
                echo -e "\n"
            } >>"$result_file"
        fi

        test_index=$((test_index + 1))
    done
}

# Main logic to execute the script based on provided arguments

# If a folder name is provided as the next argument
if [ -n "$1" ] && [ -d "$strategies_dir/$1" ]; then
    folder="$strategies_dir/$1"
    output_folder="$results_dir/$1"
    mkdir -p "$output_folder"
    result_file="$output_folder/results-summary.json"
    echo "Executing for all JSON files in folder: $folder"

    # Find and iterate over each JSON file in the specified folder and its subdirectories
    find "$folder" -type f -name '*.json' | while read -r json_file; do
        execute_curl "$json_file" "$result_file"
    done

# If a specific file path is provided as the next argument
elif [ -n "$1" ] && [ -f "$1" ]; then
    json_file="$1"
    output_folder="$results_dir/$(basename "$(dirname "$json_file")")"
    mkdir -p "$output_folder"
    result_file="$output_folder/results-summary.json"
    echo "Executing for specific file: $json_file"
    execute_curl "$json_file" "$result_file"

# If the specified file or directory does not exist, display an error message
elif [ -n "$1" ]; then
    echo -e "${RED}Error: The specified file or directory '$1' does not exist.${NC}"
    exit 1

# If no folder or file arguments are provided, execute for all JSON files in all subdirectories
else
    echo -e "${YELLOW}No folder or file arguments provided, executing for all JSON files in all subdirectories of StrategiesDataScripts${NC}"
    result_file="$results_dir/results-summary.json"  # Compile all results into a single summary file

    # Find and iterate over all JSON files in all subdirectories of StrategiesDataScripts
    find "$strategies_dir" -type f -name '*.json' | while read -r json_file; do
        execute_curl "$json_file" "$result_file"
    done
fi

echo -e "${GREEN}Execution completed. Results are stored in the Results folder.${NC}"
