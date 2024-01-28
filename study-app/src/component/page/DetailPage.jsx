import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";

import "../../css/detailPage.css"
import styled from "styled-components";
const Server_URL = "http://localhost:3002";


const Styledtitle=styled.div`
    padding:10px;
    font-size:14px;
    border-radius:10px;
    background-color:#95E0B7;
    border-color:#95E0B7;
    cursor:pointer;
    height:"0px";
    margin:10px;
    :hover{
        background-color:grey;
    };
    width:fit-content;
    height:fit-content;
    
`;

const StyledButton=styled.button`
    padding:10px;
    font-size:14px;
    border-radius:10px;
    background-color:white;
    border-color:white;
    cursor:pointer;
    width:20vw;
    height:"0px";
    margin:10px;
    :hover{
        background-color:grey;
    };
    
    
`;

const StyledWhiteTitle=styled.div`
    padding:10px;
    font-size:14px;
    border-radius:10px;
    background-color:white;
    border-color:white;
    cursor:pointer;
    width:20vw;
    height:"0px";
    margin:10px;
    :hover{
        background-color:grey;
    };
    
    width:fit-content;
    
`;

const StyledAnswer=styled.div`
    padding:10px;
    margin:10px;
    font-size:14px;
    border-radius:10px;
    background-color:white;
    border-color:white;
    cursor:pointer;
    width:80vw;
    
`;

function DetailPage(props){
    const {main_category,sub_category}=useParams();
    const [contents,setContents]=useState([]);
    //해당 main, sub를 가지는 data를 요청해서 렌더링(db와 연결)

    useEffect(()=>{
        const getContent=async()=>{
            try{
                const res=await fetch(Server_URL+'/getContent',{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:localStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                        main:main_category,
                        sub:sub_category
                    })
                })
                const datas=await res.json();
                console.log(datas);
                
                
                setContents(datas);
                console.log(contents);
            
            }catch(err){
                console.log('main category get err:',err);
            };
        }
    
        getContent();

    },[main_category,sub_category]);
    

    return(
        <div class="whole_container">
            
             <div class="category_container">
                <Styledtitle>main</Styledtitle><StyledButton>{main_category}</StyledButton>
                <Styledtitle>sub</Styledtitle><StyledButton>{sub_category}</StyledButton>
            </div>

                {contents.map((content)=>(
            <div class="content_container">
                <div class="question_container"><Styledtitle>question</Styledtitle><StyledWhiteTitle>{content.question}</StyledWhiteTitle></div>
                <div class="answer_container"><Styledtitle> answer+</Styledtitle><StyledAnswer>{content.answer}</StyledAnswer></div>

            </div>
  
    ))}
        </div>
   
    );
}

export default DetailPage;