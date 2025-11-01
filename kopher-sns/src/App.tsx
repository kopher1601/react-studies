import "./App.css";
import { Route, Routes } from "react-router";
import CounterPage from "@/pages/counter-page.tsx";
import TodoListPage from "@/pages/todo-list-page.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/counter" element={<CounterPage />} />
      <Route path="/todo-list" element={<TodoListPage />} />
      <Route path="/sign-in" element={<div>Sign In</div>} />
      <Route path="/sign-up" element={<div>Sign Up</div>} />
    </Routes>
  );
}

export default App;
