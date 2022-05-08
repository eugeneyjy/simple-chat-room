import { Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <div>
      <Routes>
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
