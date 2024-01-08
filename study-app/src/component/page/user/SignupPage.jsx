import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Server_URL = "http://localhost:3002";

const SignupPage=()=>{
    const [id,setId]=useState("");
    const [password,setPassword]=useState("");
    
    const submitBtn=async()=>{
        console.log(id,password);
        if(id==="" || password===""){
            alert("아이디 또는 비밀번호가 입력되지 않았습니다!");
            return;
        }else{
           
            try{
                fetch(Server_URL+"/signup", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                      },
                    body: JSON.stringify({
                        userId:id,
                        userPw: password,
                      }),
                  })
                    .then((res) => res.json())
                    .then((json) => {      
                        console.log(json);     
                        
                    })
                    .catch((error)=>{
                        console.error("error:",error);
                    });

                // const res=fetch(BASE_URL+'/signup',{
                //     method:'POST',
                //     body:JSON.stringify(userData),
                //     //credentials:'include',
                //     headers:{'Content-Type': 'application/json'},
                // });

                // const data=res.json();
                // alert(data);
                // if(res.status===200){
                //     alert(data);
                //     setId(id);
                //     setPassword(password);
                // }else{
                //     setId("");
                //     setPassword("")
                //     return ;
                // }
            }catch(err){
                console.log(err);
            }
           
        }
    }

    return(
        <div>
            <h1>회원가입</h1>
            <div>
                <input type="text" value={id} onChange={(e)=>setId(e.target.value)}></input>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
                <button type="submit" onClick={submitBtn}>submit</button>
            </div>
        </div>
    );
}

export default SignupPage;