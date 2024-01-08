import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {useState,useEffect} from "react";
import Card from "../ui/Card";

const BASE_URL = "http://localhost:3001";

const Wrapper=styled.div`
    width:calc(100%-32px);
    padding:16px;
    display:flex;
    flex-direction:column;
    align-itmes:center;
    justify-content:center;

`;

const Container=styled.div`
    width:100%;
    &>*{
        :not(:last-child){
            margin-bottom:16px;
        }
    }
`;



function MainPage(props){
    const navigate=useNavigate();
    const [isLogin,setIsLogin]=useState(false);

    useEffect(()=>{
        if(localStorage.getItem('token')!==null){
            setIsLogin(true);
        }
  
    },[]);

    return(
        <Wrapper>
            <Container>
                <Card
                title="categories"
                onClick={(item)=>{navigate("/category");}}
                >
                </Card>
                
                <Card
                title="signup"
                onClick={(item)=>{navigate("/signup");}}
                >
                </Card>
                {isLogin?
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
    );
}

export default MainPage;