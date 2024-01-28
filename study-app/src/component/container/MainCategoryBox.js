import {useState} from "react"
import styled from "styled-components";
import data from "../../data.json"
import SubCategoryBox from "./SubCategoryBox";
import "../../css/mainCategoryBox.css"

const Server_URL = "http://localhost:3002";

const StyledCard=styled.button`
    padding:16px;
    font-size:16px;
    border-radius:10px;
    background-color:#95E0B7;
    border-color:#95E0B7;
    cursor:pointer;
    height:"0px";
    margin:10px;
    :hover{
        background-color:grey;
    };
    
`;


const filterSubCategories=async(main)=>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            var subs=[];
            data.forEach((item)=>{
                if(item.main_category==main){
                    subs.push(item.sub_category);
                    subs.push(item.sub_category2);
                }
            });

            //중복제거
            const uniqueSubs = Array.from(new Set(subs));
            resolve(uniqueSubs);

            //resolve(subs);
        },100);

    });
    //return subs;
};
//main에 해당하는 sub들 가져오기

//setSubs로 useState에 배열 저장하는것부터 수정

function MainCategoryBox(props){
    const {main_category}=props;
    const [isMainSelected,setIsMainSelected]=useState(false);
    const [isClicked,setIsClicked]=useState(false);

    const [subs,setSubs]=useState([]);

    const getSubCategory=async()=>{
        try{
            const res=await fetch(Server_URL+'/getSubCategory',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    main: props.main_category
                })
            })
            const datas=await res.json();

            setSubs(datas);
            console.log(datas);
            console.log(subs);
        
        }catch(err){
            console.log('main category get err:',err);
        };
    };

    
    const selectMainCategory=async ()=>{
        setIsMainSelected(!isMainSelected);
        
        if(!isClicked){
            // var sub=await filterSubCategories(props.main_category);
            // setSubs((prevSubs) => [...prevSubs, ...sub]);
            getSubCategory();
        }
        setIsClicked(true);
        
        
    };
    
    return(
        <div class="container">
            <div class="main_container">
                <StyledCard onClick={selectMainCategory}>
                {props.main_category||"card"}
                </StyledCard>
            </div>
            {isMainSelected && <SubCategoryBox main={props.main_category} subs={subs}></SubCategoryBox>}

        </div>
    
    );
}

export default MainCategoryBox;