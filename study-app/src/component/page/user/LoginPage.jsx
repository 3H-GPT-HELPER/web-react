import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Server_URL = "http://localhost:3002";

const LoginPage=()=>{
    const [id,setId]=useState("");
    const [password,setPassword]=useState("");
    
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
            <h1>로그인</h1>
            <div>
                <input type="text" value={id} onChange={(e)=>setId(e.target.value)}></input>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
                <button type="submit" onClick={LoginBtn}>submit</button>
            </div>
        </div>
    );
}

export default LoginPage;