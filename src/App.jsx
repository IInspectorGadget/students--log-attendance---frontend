import "./app.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { AuthProvider } from "./context/AuthContext";

import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <div className='App'>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route element={<HomePage />} path='*' exact />
            </Route>
            <Route element={<LoginPage />} path='/login' />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
