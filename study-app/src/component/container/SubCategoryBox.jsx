import {useState} from "react"
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledCard=styled.button`
    padding:8px 16px;
    background-color:white;
    font-size:16px;
    border-white:1px;
    border-radius:8px;
    cursor:pointer;
    margin-left:10px;
    margin-top:15px;
    
    :hover{
        background:grey;
    };

    border-color: white;
    
`;
const Wrapper=styled.div`
    width:calc(100%-32px);
    padding:16px;
    display:flex;
    flex-direction:column;
    align-itmes:center;
    justify-content:center;

`;

//main category에 속하는 sub category filtering function

const replaceBlank=(name)=>name.replace(" ","_")

function SubCategoryBox(props){
    
    const {main,subs}=props;
    const navigate=useNavigate();

    const selectSubCategory=(selectedItem)=>{
        navigate(`/category/${replaceBlank(props.main)}/${replaceBlank(selectedItem)}`)
        
    }

    return(

        <div class="sub_container">
            {props.subs.map((item)=>(
            <StyledCard key={item.id} onClick={()=>selectSubCategory(item.name)}>
            {item.name||"card"}
            </StyledCard>
        ))}
        </div>
        
    );

  
};

export default SubCategoryBox;