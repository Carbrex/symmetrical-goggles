import subprocess

# Replace 'your_env_name' with the name of your Conda environment
conda_activate = f"conda run -n speechRealtime python3 ./python/start.py"

# Run the command to activate the Conda environment and execute your script
process = subprocess.Popen(conda_activate, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=subprocess.PIPE)

