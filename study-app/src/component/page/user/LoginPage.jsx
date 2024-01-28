import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Button from '../../ui/Button';
const Server_URL = "http://localhost:3002";


const StyledInput=styled.input`
    padding:10px;
    font-size:14px;
    border-radius:10px;
    background-color:white;
    border-color:white;
    width:10vw;
    margin:10px;
`;

const LoginPage=()=>{
    const [id,setId]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    
    
    const LoginBtn=async()=>{
        console.log(id,password);
        if(id==="" || password===""){
            alert("아이디 또는 비밀번호가 입력되지 않았습니다!");
            return;
        }else{
           
            try{
                fetch(Server_URL+"/login", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                      },
                    body: JSON.stringify({
                        userId:id,
                        userPw: password,
                      }),
                  })
                    .then((res) => 
                        res.json()

                    )
                    .then((json) => {
                        console.log(json.message);
                        localStorage.clear()
                        localStorage.setItem('id',id)
                        localStorage.setItem('token',json.token);
                        //window.location.replace('http://localhost:3000/category')
                        navigate("/category");
                    })
                    .catch((error)=>{
                        console.error("error:",error);
                    });

                
            }catch(err){
                console.log(err);
            }
           
        }
    }

    return(
        <div>
            <h3>로그인</h3>
            <div>
                <div class="id">
                    아이디🐥 <StyledInput value={id} onChange={(e)=>setId(e.target.value)}></StyledInput>
                    </div>
                <div className='pw'>
                    비밀번호 <StyledInput type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></StyledInput>
                </div>
                <Button type="submit" onClick={LoginBtn} title="로그인"></Button>
            </div>
        </div>
    );
}

export default LoginPage;