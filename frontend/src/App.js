import { Route, Routes } from 'react-router-dom';

import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <div>
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
    </div>
  );
}

export default App;
