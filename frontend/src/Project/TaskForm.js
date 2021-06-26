import { useState } from "react";
import { toast } from "react-toastify";
import "./TaskForm.css";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.minimal.css";

const TaskForm = (props) => {
  const [taskTextValue, setTaskText] = useState("");
  const handleChange = (event) => {
    setTaskText(event.target.value);
  };

  const createTask = async (event) => {
    event.preventDefault();
    const response = await fetch("/projects/newTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: props.projectId,
        taskText: taskTextValue,
        taskState: "todo",
      }),
    });
    if (response) {
      setTaskText("");
      props.newTaskAdded();
      toast.dark("Successfully added in a new task!");
    }
  };

  return (
    <div className="card p-3 border mt-3 shadow">
      <form onSubmit={createTask}>
        <div className="mb-3">
          <label htmlFor="taskText" className="form-label">
            New Task
          </label>
          <textarea
            className="form-control"
            id="taskText"
            name="taskText"
            rows="3"
            value={taskTextValue}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn addBtn me-2" type="submit">
          Add task
        </button>
        <button
          className="btn btnClose"
          onClick={(event) => {
            event.preventDefault();
            props.closeTaskForm();
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

TaskForm.propTypes = {
  newTaskAdded: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  closeTaskForm: PropTypes.func.isRequired,
};

export default TaskForm;
