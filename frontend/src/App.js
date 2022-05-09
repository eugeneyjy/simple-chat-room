import { Route, Routes } from 'react-router-dom';

import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Chat/>}
      />
      <Route 
        path="/signup"
        element={<Signup/>}
      />
      <Route
        path="/login"
        element={<Login/>}
      />
    </Routes>
  );
}

export default App;
