import logo from './logo.svg';
import './App.css';
import{
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import styled from 'styled-components';
import MainPage from './component/page/MainPage';
import CategoryPage from './component/page/CategoryPage';
import DetailPage from './component/page/DetailPage';
import SignupPage from './component/page/user/SignupPage';
import LoginPage from './component/page/user/LoginPage';
import { useEffect } from 'react';
import LogoutPage from './component/page/user/LogoutPage';
import {useState} from "react"; 
const Server_URL = "http://localhost:3002";


const MainTitleText=styled.p`
  font-size:24px;
  font-weight:bold;
  text-align:center;
`;

function App() {
  
  return (
    <BrowserRouter>
      <MainTitleText>welcome to chat-gpt study helper</MainTitleText>
      <Routes>
        <Route index element={<MainPage></MainPage>}></Route>
        <Route path="/signup" element={<SignupPage></SignupPage>}></Route>
        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        <Route path="/logout" element={<LogoutPage></LogoutPage>}></Route>

        <Route path="/category" element={<CategoryPage></CategoryPage>}></Route>
        <Route path="/category/:main_category/:sub_category" element={<DetailPage></DetailPage>}></Route>
        
      </Routes>
    </BrowserRouter>

    
  );
}

export default App;
