import React, { useState } from "react";
import { useAuth } from "./context/authContext";
import Header from "./components/Header";
import ListView from "./components/ListView";
import BoardView from "./components/BoardView";
import { signInWithGoogle } from "./services/authService";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [view, setView] = useState<"list" | "board">("list");
  const [filter, setFilter] = useState<string | null>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>("asc");
  const [searchText, setSearchText] = useState<string>("");

  if (loading) return <p>Loading...</p>;

  return (
    <div>
       {!user ? (
         <div className="d-flex flex-column align-items-center justify-content-center vh-100">
         <h2>Welcome to TaskBuddy</h2>
         <button className="btn btn-primary" onClick={signInWithGoogle}>
           Sign In with Google
         </button>
       </div>
      ) : ( 
        <>
          <Header setView={setView} setFilter={setFilter} setSortOrder={setSortOrder} setSearchText={setSearchText} searchText={searchText} />
          {view === "list" ? (
            <ListView filter={filter} sortOrder={sortOrder} searchText={searchText} />
          ) : (
            <BoardView filter={filter} sortOrder={sortOrder} searchText={searchText} />
          )}
          
        </>
      )} 
    </div>
  );
};

export default App;
