import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState,AppDispatch } from "../store";
import { fetchTasks, deleteTask } from "../redux/taskSlice"; 
import { FaEllipsisV, FaTrash, FaEdit } from "react-icons/fa";
import TaskModal from "./AddTaskModal";

interface BoardViewProps {
  filter: string | null;
  sortOrder: "asc" | "desc" | null;
  searchText: string;
}

const BoardView: React.FC<BoardViewProps> = ({ filter, sortOrder, searchText }) => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
      dispatch(fetchTasks());
    }, [dispatch]);

  useEffect(() => {
    let updatedTasks = [...tasks];
    console.log('Filter->',filter)
    if (filter && filter !== "All") {
      console.log('updatedTasksBV->',updatedTasks)
      updatedTasks = updatedTasks.filter((task) => task.category === filter);
      console.log('updatedTasksBV@->',updatedTasks)
    }

    if (searchText.trim() !== "") {
      updatedTasks = updatedTasks.filter((task) =>
        task.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (sortOrder === "asc") {
      updatedTasks = [...updatedTasks].sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
    } else if (sortOrder === "desc") {
      updatedTasks = [...updatedTasks].sort((a, b) => (a.dueDate < b.dueDate ? 1 : -1));
    }

    setFilteredTasks(updatedTasks);
  }, [tasks, filter, sortOrder, searchText]);

  const handleEdit= (task: any) => {
    setTaskToEdit(task); 
    setShowModal(true);
  };

  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const categories = [
    { title: "TO-DO", status: "To Do", color: "primary" },
    { title: "IN-PROGRESS", status: "In Progress", color: "info" },
    { title: "COMPLETED", status: "Completed", color: "success" },
  ];

  return (
    <Container className="mt-4">
      <Row className="g-4">
        {categories.map((category) => {
          console.log('filteredTasks->',filteredTasks)
          const categoryTasks = filteredTasks.filter((task) => task.status === category.status);
          console.log('categoryTasks->',categoryTasks)
          return (
            <Col md={4} key={category.status}>
              <Card className="p-3 shadow-sm">
                <Card.Header className={`fw-bold text-${category.color} bg-transparent border-0`}>
                  {category.title}
                </Card.Header>
                <Card.Body className="bg-light">
                  {categoryTasks.length === 0 ? (
                    <div className="text-center text-muted">No Tasks in {category.title}</div>
                  ) : (
                    categoryTasks.map((task) => (
                      <Card key={task._id} className="p-3 shadow-sm mb-3 border-0 rounded">
                        <Card.Body className="d-flex justify-content-between align-items-start">
                        <div>
                              <Card.Title className={task.status === "Completed" ? "text-decoration-line-through text-muted" : ""}>{task.title}</Card.Title>
                              <div className="d-flex align-items-center">
                                <span className="text-muted small">{task.category}</span>
                                <span className="text-muted small ms-auto">
                                  {task.dueDate === new Date().toISOString().split("T")[0] ? "Today" : task.dueDate}
                                </span>
                              </div>
                          </div>

                          {/* Dropdown for Edit & Delete */}
                          <Dropdown>
                            <Dropdown.Toggle variant="link" className="text-dark p-0 border-0">
                              <FaEllipsisV />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" className="shadow-sm border-0">
                              <Dropdown.Item onClick={() => handleEdit(task)}>
                                <FaEdit className="me-2" /> Edit
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDelete(task._id)} className="text-danger">
                                <FaTrash className="me-2" /> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Card.Body>
                      </Card>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      <TaskModal show={showModal} handleClose={() => setShowModal(false)} editTask={taskToEdit} />
    </Container>
  );
};

export default BoardView;
