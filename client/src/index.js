import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from '../src/App/App';
import Register from './auth/Register';
import Login from './auth/Login';
import Unauthorized from './auth/Unauthorized';
import Main from './main/Main';
import MainAdmin from './main/MainAdmin';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/main' element={<Main/>}></Route>
        <Route path='/mainadmin' element={<MainAdmin/>}></Route>
        <Route path='/unauthorized' element={<Unauthorized/>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
