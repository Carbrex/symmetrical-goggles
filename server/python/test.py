import sys
import os

def read_stdin_write_to_file(file_name):
    try:
        output_directory = os.path.dirname(file_name)
        if not os.path.exists(output_directory):
            os.makedirs(output_directory)
        with open(file_name, 'wb') as file:
            while True:
                # Read from stdin buffer
                data = sys.stdin.buffer.read(1024)  # Adjust buffer size as needed

                # Break the loop if no more data
                if not data:
                    break

                # Write data to file
                file.write(data)
                file.flush()  # Flush the output
    except KeyboardInterrupt:
        print("Process interrupted.")
    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    output_file_name = "./python/Audio/output.webm"  # Change the file name as needed
    read_stdin_write_to_file(output_file_name)
