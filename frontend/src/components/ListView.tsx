import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { Accordion, Button, Row, Col, Container, Dropdown } from "react-bootstrap";
import TaskModal from "./AddTaskModal";
import { FaGripVertical, FaEllipsisV, FaCheckCircle, FaTrash, FaEdit } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { fetchTasks, editTask, deleteTask } from "../redux/taskSlice";
import { AppDispatch } from "../store";

interface TaskSectionProps {
  filter: string | null;
  sortOrder: "asc" | "desc" | null;
  searchText: string;
}

const TaskSection: React.FC<TaskSectionProps> = ({ filter, sortOrder, searchText }) => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);

  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [selectedStatus, setSelectedStatus] = useState<string>("To Do");

  const [filteredTasks, setFilteredTasks] = useState(tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    let updatedTasks = [...tasks]; 
   
    if (filter && filter !== "All") {
      updatedTasks = updatedTasks.filter((task) => task.category === filter);
      
    }

    if (searchText.trim() !== "") {
      updatedTasks = updatedTasks.filter((task) =>
        task.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (sortOrder === "asc") {
      updatedTasks = updatedTasks.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
    } else if (sortOrder === "desc") {
      updatedTasks = updatedTasks.sort((a, b) => (a.dueDate < b.dueDate ? 1 : -1));
    }

    setFilteredTasks(updatedTasks);
  }, [filter, sortOrder, searchText, tasks]); 

  const handleTaskSelect = (taskId: string) => {
    const updatedSelectedTasks = new Set(selectedTasks);
    if (updatedSelectedTasks.has(taskId)) {
      updatedSelectedTasks.delete(taskId);
    } else {
      updatedSelectedTasks.add(taskId);
    }
    setSelectedTasks(updatedSelectedTasks);
  };

  const handleBatchDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedTasks).map(async (taskId) => {
         await dispatch(deleteTask(taskId)).unwrap();
        })
      );
      console.log("Tasks deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting tasks:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setSelectedTasks(new Set());
    }
  }; 

  /*Batch change status of selected tasks */
  const handleBatchStatusChange = async () => {
    try {
      await Promise.all(
        Array.from(selectedTasks).map(async (taskId) => {
          const task = tasks.find((t) => t._id === taskId);
          if (task) {
            await dispatch(editTask({ ...task, status: selectedStatus })).unwrap();
          }
        })
      );
      console.log("Tasks updated successfully");
    } catch (error) {
      console.error("Error updating tasks:", error);
    } finally {
      setSelectedTasks(new Set());
    }
  };
  
  const handleEditTask = (task: any) => {
    setTaskToEdit(task); 
    setShowModal(true);
  };

const allTasksSelected = selectedTasks.size === tasks.length;

const toggleAllTasksSelection = () => {
  if (allTasksSelected) {
    setSelectedTasks(new Set()); 
  } else {
    setSelectedTasks(new Set(tasks.map(task => task._id))); 
  }
};

  const categories = ["To Do", "In Progress", "Completed"];
  const categoryColors = ["primary", "info", "success"];

  return (
    <Container className="mt-4">
      <Row className="fw-bold border-bottom py-2 bg-border border rounded-pill">
        <Col md={3}>Task Name</Col>
        <Col md={2}>Due On</Col>
        <Col md={2}>Task Status</Col>
        <Col md={2}>Task Category</Col>
        <Col md={3} className="text-end">Actions</Col>
      </Row>
     
  {/* Floating Action Bar */}
      
{selectedTasks.size > 0 && (
  <div
    className="position-fixed bottom-0 start-50 translate-middle-x bg-dark text-white p-2 rounded-pill d-flex align-items-center gap-3 shadow-lg"
    style={{ zIndex: 1050, width: "auto" }}
  >
    {/* Selected Tasks Count */}
    <span className="px-3 py-1 bg-secondary rounded-pill">
      {selectedTasks.size} Tasks Selected
    </span>

    {/* Checkbox */}
    <input
      type="checkbox"
      checked={allTasksSelected}
      onChange={toggleAllTasksSelection}
      className="form-check-input"
    />

    {/* Status Dropdown */}
<Dropdown onSelect={(eventKey) => setSelectedStatus(eventKey as string)}>
  <Dropdown.Toggle variant="secondary" className="border-0">
    {selectedStatus || "Status"}
  </Dropdown.Toggle>
  <Dropdown.Menu className="dropdown-menu-dark">
    <Dropdown.Item eventKey="To Do">TO-DO</Dropdown.Item>
    <Dropdown.Item eventKey="In Progress">IN-PROGRESS</Dropdown.Item>
    <Dropdown.Item eventKey="Completed">COMPLETED</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>

{/* Change Status Button */}
<Button variant="success" onClick={handleBatchStatusChange}>
  Change Status
</Button>

    {/* Delete Button */}
    <Button variant="danger" onClick={handleBatchDelete}>
      Delete
    </Button>
  </div>
)}
      {/* Task List Accordion */}
      <DragDropContext
onDragEnd={(result) => {
  if (!result.destination) return;
  console.log("Drag Result:", result);
}}
>
  <Accordion defaultActiveKey="0">
    {categories.map((category, index) => {
      const categoryTasks = filteredTasks.filter((task) => task.status === category);

      return (
        <Accordion.Item eventKey={String(index)} key={category}>
          <Accordion.Header>
            <strong className={`text-${categoryColors[index]}`}>
              {category} ({categoryTasks.length})
            </strong>
          </Accordion.Header>
          <Accordion.Body>
            {category === "To Do" && (
              <Button variant={`outline-${categoryColors[index]}`} className="mb-2" onClick={() => setShowModal(true)}>
                + Add Task
              </Button>
            )}

            <Droppable droppableId={category.replace(/\s/g, "")} type="TASK">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {categoryTasks.length === 0 ? (
                    <p className="text-muted">No Tasks in {category}</p>
                  ) : (
                    categoryTasks.map((task, taskIndex) => (
                      <Draggable key={task._id} draggableId={task._id} index={taskIndex}>
  {(provided) => (
    <Row
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="border-bottom py-2 align-items-center"
    >

      <Col md={1} className="text-center d-flex align-items-center gap-2" {...provided.dragHandleProps}>
        <input
          type="checkbox"
          checked={selectedTasks.has(task._id)}
          onChange={() => handleTaskSelect(task._id)}
        />
        <FaGripVertical />

        {task.status === "Completed" ? (
          <span className="text-success">
            <FaCheckCircle />
          </span>
        ) : (
          <span className="text-secondary">
            <FaCheckCircle />
          </span>
        )}

      </Col>

      <Col md={3} className={task.status === "Completed" ? "text-decoration-line-through text-muted" : ""}>
        {task.title}
      </Col>

      <Col md={2}>{task.dueDate}</Col>
      <Col md={2}>{task.status}</Col>
      <Col md={2}>{task.category}</Col>

      {/* Options Dropdown */}
      <Col md={1} className="text-center">
        <Dropdown>
          <Dropdown.Toggle variant="light" size="sm" className="border-0">
            <FaEllipsisV />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleEditTask(task)}> <FaEdit className="me-2" /> Edit Task</Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(deleteTask(task._id))}> <FaTrash className="me-2" /> Delete Task</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  )}
</Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Accordion.Body>
        </Accordion.Item>
      );
    })}
  </Accordion>
</DragDropContext>
      <TaskModal show={showModal} handleClose={() => setShowModal(false)} editTask={taskToEdit} />
    </Container>
  );
};

export default TaskSection;
