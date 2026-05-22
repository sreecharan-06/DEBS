import { HashRouter, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Home from './components/Home.jsx';

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <Routes>
        <Route path='/' element={<App/>} />
        <Route path='/home' element={<Home/>} />
    </Routes>
  </HashRouter>
)
