from flask import Flask, jsonify, request

app = Flask(__name__)

# Sample data (replace with your own data source)
todos = [
    {"id": 1, "task": "Buy groceries"},
    {"id": 2, "task": "Go to the gym"},
    {"id": 3, "task": "Learn Python"},
]

# Create a route to list all tasks


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify(todos)

# Create a route to get a specific task by ID


@app.route("/api/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = next((task for task in todos if task["id"] == task_id), None)
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task)

# Create a route to add a new task


@app.route("/api/tasks", methods=["POST"])
def add_task():
    if not request.json or "task" not in request.json:
        return jsonify({"error": "Bad request"}), 400

    new_task = {
        "id": len(todos) + 1,
        "task": request.json["task"],
    }
    todos.append(new_task)
    return jsonify(new_task), 201

# Create a route to update an existing task


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = next((task for task in todos if task["id"] == task_id), None)
    if task is None:
        return jsonify({"error": "Task not found"}), 404

    if not request.json or "task" not in request.json:
        return jsonify({"error": "Bad request"}), 400

    task["task"] = request.json["task"]
    return jsonify(task)

# Create a route to delete a task by ID


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = next((task for task in todos if task["id"] == task_id), None)
    if task is None:
        return jsonify({"error": "Task not found"}), 404

    todos.remove(task)
    return jsonify({"result": "Task deleted"}), 200


if __name__ == "__main__":
    app.run(debug=True)
