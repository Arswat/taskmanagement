import React, { useState } from "react";
import { Navbar, Nav, Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { FaBars, FaTable, FaSearch } from "react-icons/fa";
import TaskModal from "./AddTaskModal";
import { logOut } from "../services/authService"; 
import "../App.css"; 

interface HeaderProps {
  setView: (view: "list" | "board") => void;
  setFilter: (category: string | null) => void;
  setSortOrder: (sortOrder: "asc" | "desc" | null) => void;
  setSearchText: (text: string) => void;
  searchText: string;
}

const Header: React.FC<HeaderProps> = ({ setView, setFilter, setSortOrder, setSearchText, searchText }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm px-4 py-3 navbar-container">
      {/* TaskBuddy Title */}
      <div className="taskbuddy-title">
        <Navbar.Brand className="fw-bold fs-4">
          <span role="img" aria-label="logo">📱</span> TaskBuddy
        </Navbar.Brand>
      </div>

      {/* View Toggle for Large Screens */}
      <div className="d-none d-lg-flex view-toggle w-100 justify-content-between align-items-center">
      <div className="d-flex gap-3">
        <Nav.Link className="fw-bold text-dark" onClick={() => setView("list")}>
          <FaBars className="me-2" /> List
        </Nav.Link>
        <Nav.Link className="text-muted" onClick={() => setView("board")}>
          <FaTable className="me-2" /> Board
        </Nav.Link>
      </div>
        <Button variant="outline-danger" className="rounded-pill px-3 ms-auto mb-10" onClick={logOut}>
          Logout
        </Button>
</div>

  {/* Filter Options */}
  <div className="d-flex w-100 justify-content-between align-items-center">
  {/* Filter Options on the left */}
  <div className="d-flex align-items-center gap-2">
    <span className="fw-bold">Filter by:</span>
    <Dropdown onSelect={(eventKey: string | null) => setFilter(eventKey)}>
      <Dropdown.Toggle variant="light" className="border rounded-pill px-3">Category</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item eventKey="All">All</Dropdown.Item>
        <Dropdown.Item eventKey="Work">Work</Dropdown.Item>
        <Dropdown.Item eventKey="Personal">Personal</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

    <Dropdown onSelect={(eventKey: string | null) => setSortOrder(eventKey as "asc" | "desc" | null)}>
      <Dropdown.Toggle variant="light" className="border rounded-pill px-3">Due Date</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item eventKey="asc">Ascending</Dropdown.Item>
        <Dropdown.Item eventKey="desc">Descending</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>

  {/* Search Bar & Add Task on the right */}
  <div className="d-flex align-items-center gap-3">
    <div className="search-bar">
      <InputGroup className="border rounded-pill overflow-hidden">
        <InputGroup.Text className="bg-white border-0">
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border-0"
        />
      </InputGroup>
    </div>
  
    <Button variant="primary" className="px-4 rounded-pill" onClick={() => setShowModal(true)}>
      ADD TASK
    </Button>
  </div>
</div>

      <TaskModal show={showModal} handleClose={() => setShowModal(false)} />
    </Navbar>
  );
};

export default Header;
