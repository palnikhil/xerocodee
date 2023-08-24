import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register'
import ChooseDetail from './components/ChooseDetail/ChooseDetail';

function App() {
  return (
    <div className="App">
      <div className="App-header">
          <BrowserRouter>
              <Routes>
                  <Route path='/login' element={<Login />}/>
                  <Route path='/register' element={<Register />} />
                  <Route path='/dashboard' element={<ChooseDetail />}/>
              </Routes>
          </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
