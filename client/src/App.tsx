import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Chat from "./pages/Chat.tsx";
import Wrapper from "./layout.tsx";

function App(): JSX.Element {
  return (
    <Wrapper>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Wrapper>
  );
}

export default App;
