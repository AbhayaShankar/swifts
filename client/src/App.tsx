import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Chat from "./pages/Chat.tsx";
import Wrapper from "./layout.tsx";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.tsx";

function App(): JSX.Element {
  const { user } = useContext(AuthContext);
  return (
    <Wrapper>
      <Routes>
        <Route path="/" element={user ? <Chat /> : <Login />} />
        <Route path="/login" element={user ? <Chat /> : <Login />} />
        <Route path="/register" element={user ? <Chat /> : <Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Wrapper>
  );
}

export default App;
