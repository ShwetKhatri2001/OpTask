import { useRef, useState } from "react";
import { toast } from "react-toastify";
import "./Task.css";
import PropTypes from "prop-types";

const Task = (props) => {
  const [editTextAreValue, setTextAreaValue] = useState(props.task.taskText);
  const updateTimelineForm = useRef(null);
  let timelineSelectedValue = "";

  const updateTaskText = async (event) => {
    event.preventDefault();
    const result = await fetch("/projects/updatetasktext", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.task._id,
        newText: editTextAreValue,
      }),
    });
    if (result) {
      document.querySelector(`#editTextModal${props.task._id}`).click();
      props.taskUpdated();
      toast.dark("Successfully updated task!");
    } else {
      toast.error("Couldn't updated task text :(");
    }
  };

  // this updates the task's state when they select a new timeline status
  const updateTimeline = async (event) => {
    event.preventDefault();
    if (timelineSelectedValue) {
      const result = await fetch("/projects/updateTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.task._id,
          newState: timelineSelectedValue,
        }),
      });
      if (result) {
        document
          .querySelector(`#closeUpdateModalButton${props.task._id}`)
          .click();
        props.taskUpdated();
        toast.dark("Successfully updated task state!");
      }
    } else {
      console.log("successfully caught bad update value");
      toast.error("Unsuccessfully updated task state :(");
    }
  };

  // this function haldnes the form changes in updating the status of a task
  const onTimeLineChange = (event) => {
    timelineSelectedValue = event.target.value;
  };

  const deleteTask = async () => {
    const result = await fetch("/projects/deletetask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: props.task._id,
      }),
    });
    if (result) {
      props.taskUpdated();
      toast.error("Deleted task");
    }
  };

  const handleEditTextChange = (event) => {
    setTextAreaValue(event.target.value);
  };

  return (
    <div>
      <div className="card mt-3 border shadow">
        <div className="card-body">
          <h3>{props.task.taskText}</h3>
          <hr></hr>
          <div>
            {/* start of update progress button */}
            <button
              type="button"
              className="btn"
              data-bs-toggle="modal"
              data-bs-target={"#stateModal" + props.task._id}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <g>
                  <rect fill="none" height="24" width="24" />
                </g>
                <g>
                  <g>
                    <g>
                      <path d="M23,8c0,1.1-0.9,2-2,2c-0.18,0-0.35-0.02-0.51-0.07l-3.56,3.55C16.98,13.64,17,13.82,17,14c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-0.18,0.02-0.36,0.07-0.52l-2.55-2.55C10.36,10.98,10.18,11,10,11s-0.36-0.02-0.52-0.07l-4.55,4.56C4.98,15.65,5,15.82,5,16 c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2c0.18,0,0.35,0.02,0.51,0.07l4.56-4.55C8.02,9.36,8,9.18,8,9c0-1.1,0.9-2,2-2s2,0.9,2,2 c0,0.18-0.02,0.36-0.07,0.52l2.55,2.55C14.64,12.02,14.82,12,15,12s0.36,0.02,0.52,0.07l3.55-3.56C19.02,8.35,19,8.18,19,8 c0-1.1,0.9-2,2-2S23,6.9,23,8z" />
                    </g>
                  </g>
                </g>
              </svg>{" "}
              Update Task
            </button>
            {/* start of edit task description button */}
            <button
              className="btn"
              data-bs-toggle="modal"
              data-bs-target={"#editTextModal" + props.task._id}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>{" "}
              Edit Task
            </button>
            {/* start of delete task button */}
            <button className="btn" onClick={deleteTask}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>{" "}
              Delete Task
            </button>
          </div>
        </div>
      </div>
      {/* start of update progress modal */}
      <div
        className="modal fade"
        id={"stateModal" + props.task._id}
        tabIndex="-1"
        aria-label="timelineModal"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                Edit progress for task: {props.task.taskText}
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                onChange={onTimeLineChange}
                onSubmit={updateTimeline}
                ref={updateTimelineForm}
              >
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic radio toggle button group"
                >
                  <input
                    type="radio"
                    className="btn-check active"
                    name="btnradio"
                    value="todo"
                    id={"todoRadioButton" + props.task._id}
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-primary"
                    htmlFor={"todoRadioButton" + props.task._id}
                  >
                    To-do
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="btnradio"
                    value="inprogress"
                    id={"inProgressRadioButton" + props.task._id}
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-primary"
                    htmlFor={"inProgressRadioButton" + props.task._id}
                  >
                    In Progress
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    value="done"
                    name="btnradio"
                    id={"doneRadioButton" + props.task._id}
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-primary"
                    htmlFor={"doneRadioButton" + props.task._id}
                  >
                    Done
                  </label>
                </div>
                <div className="modal-footer mt-2">
                  <button
                    type="button"
                    className="btn btnClose"
                    data-bs-dismiss="modal"
                    id={"closeUpdateModalButton" + props.task._id}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btnUpdate">
                    Update progress
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* start of edit task text modal */}
      <div
        className="modal fade"
        id={"editTextModal" + props.task._id}
        tabIndex="-1"
        aria-labelledby={"editTextModalLabel" + props.task._id}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4
                className="modal-title"
                id={"editTextModalLabel" + props.task._id}
              >
                Edit Task
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                id={"editTaskTextForm" + props.task._id}
                onSubmit={updateTaskText}
              >
                <div className="mb-3">
                  <label
                    htmlFor={"editTextArea" + props.task._id}
                    className="col-form-label"
                  >
                    Task:
                  </label>
                  <textarea
                    className="form-control"
                    id={"editTextArea" + props.task._id}
                    value={editTextAreValue}
                    onChange={handleEditTextChange}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btnClose"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btnUpdate">
                    Update Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    taskText: PropTypes.string.isRequired,
  }),
  taskUpdated: PropTypes.func.isRequired,
};

export default Task;
