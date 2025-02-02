import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { addTask, editTask as updateTask } from "../redux/taskSlice";

interface TaskModalProps {
  show: boolean;
  handleClose: () => void;
  editTask?: any;
}

const TaskModal: React.FC<TaskModalProps> = ({ show, handleClose, editTask }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setCategory(editTask.category);
      setDueDate(editTask.dueDate);
      setStatus(editTask.status);
      setAttachment(null);
    } else {
      resetForm();
    }
  }, [editTask]);

  const handleSubmit = async () => {
    if (!title || !description || !category || !dueDate || !status) {
      alert("All fields are required!");
      return;
    }

    const taskData = {
      title,
      description,
      category,
      dueDate,
      status,
      attachment: attachment ? URL.createObjectURL(attachment) : "",
    };

    try {
      if (editTask) {
        await dispatch(updateTask({ ...editTask, ...taskData })).unwrap();
      } else {
        await dispatch(addTask(taskData)).unwrap();
      }
      handleClose();
      resetForm();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setDueDate("");
    setStatus("");
    setAttachment(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editTask ? "Update Task" : "Create Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control as="textarea" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Task Category*</Form.Label>
            <div className="d-flex gap-2">
              <Button variant={category === "Work" ? "primary" : "outline-secondary"} onClick={() => setCategory("Work")}>Work</Button>
              <Button variant={category === "Personal" ? "primary" : "outline-secondary"} onClick={() => setCategory("Personal")}>Personal</Button>
            </div>
          </Form.Group>
          <div className="d-flex gap-3">
            <Form.Group className="mb-3 flex-grow-1">
              <Form.Label>Due on*</Form.Label>
              <Form.Control type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3 flex-grow-1">
              <Form.Label>Task Status*</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Choose</option>
                <option value="To Do">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Attachment</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>{editTask ? "Update" : "Create"}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;
