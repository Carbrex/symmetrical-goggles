cd "/media/histox/LinuxFiles/Files/symmetrical-goggles/apiServer/8 Emotion/SavedModel/"
export MODEL_DIR="/media/histox/LinuxFiles/Files/symmetrical-goggles/apiServer/8 Emotion/SavedModel/"
nohup tensorflow_model_server --rest_api_port=8501 --model_name=fashion_model --model_base_path="${MODEL_DIR}" >server.log 2>&1