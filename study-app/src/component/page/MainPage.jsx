import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {useState,useEffect} from "react";
import Card from "../ui/Card";
const Server_URL = "http://localhost:3002";

const Wrapper=styled.div`
    width:calc(100%-32px);
    height:100%;
    padding:16px;
    display:flex;
    flex-direction:column;
    align-itmes:center;
    justify-content:center;
    
`;

const Container=styled.div`
    width:100%;
    background-color:white;
    text-align:right;
    &>*{
        :not(:last-child){
            margin-bottom:16px;
        }
    }
`;



function MainPage(props){
    const navigate=useNavigate();
    const [isLoggedIn,setIsLoggedIn]=useState(false);

    useEffect(()=>{
        if(localStorage.getItem('token')!==null){
            setIsLoggedIn(true);
        }
        
        const checkLoginStatus=async()=>{
            try{
              const response=await fetch(Server_URL+"/checkLoginStatus",{
                method:"GET",
                headers:{ 
                    "Content-Type": "application/json",
                    Authorization:localStorage.getItem("token")}
                
              })
              const data=await response.json();
              console.log(data.isloggedIn);
              setIsLoggedIn(data.isloggedIn);
              
              }catch(err){
                console.log('login status check',err);
              };
            };
            //component mount시
            checkLoginStatus();
        //
  
    },[]);

    return(
        <div>
            <Wrapper>
                    <Container>
                        {isLoggedIn && <Card
                        title="categories"
                        onClick={(item)=>{navigate("/category");}}
                        >
                        </Card>}
                        
                        <Card
                        title="signup"
                        onClick={(item)=>{navigate("/signup");}}
                        >
                        </Card>
                        {isLoggedIn?
                        <Card
                        title="Logout"
                        onClick={(item)=>{navigate("/logout");}}
                        >
                        </Card>:
                        <Card
                        title="Login"
                        onClick={(item)=>{navigate("/login");}}
                        >
                        </Card>}

                    
                    </Container>
            
                </Wrapper>  

        </div>

    );
}

export default MainPage;