import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
const Server_URL = "http://localhost:3002";

const StyledButton=styled.button`
    padding:10px;
    font-size:14px;
    border-radius:10px;
    background-color:white;
    border-color:white;
    cursor:pointer;
    width:10vw;
    height:"0px";
    margin:10px;
    :hover{
        background-color:grey;
    };
      
`;

const StyledInput=styled.input`
    padding:10px;
    font-size:14px;
    border-radius:10px;
    background-color:white;
    border-color:white;
    width:20vw;
    margin:10px;
`;

const SignupPage=()=>{
    const [id,setId]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    
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
                        navigate("/"); 
                        
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
            <h3>회원가입</h3>
            
            <div>
                <div class="id">
                    아이디🐥 <StyledInput value={id} onChange={(e)=>setId(e.target.value)}></StyledInput>
                    </div>
                <div className='pw'>
                    비밀번호 <StyledInput type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></StyledInput>
                </div>
                <StyledButton type="submit" onClick={submitBtn}>회원가입</StyledButton>
    
                
            </div>
        </div>
    );
}

export default SignupPage;