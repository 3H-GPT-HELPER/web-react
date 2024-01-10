import {useState} from "react"
import styled from "styled-components";
import data from "../../data.json"
import SubCategoryBox from "./SubCategoryBox";

const Server_URL = "http://localhost:3002";

const Wrapper=styled.div`
    width:calc(100%-32px);
    padding:16px;
    display:flex;
    flex-direction:column;
    align-itmes:center;
    justify-content:center;

`;

const StyledCard=styled.button`
    padding:8px 16px;
    font-size:16px;
    border-white:1px;
    border-radius:8px;
    cursor:pointer;
    width:"100vw";
    height:"100vh";
    padding:"1.5rem";
    backgroundColor:blue;
    :hover{
        background:grey;
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
        <Wrapper>
            <StyledCard onClick={selectMainCategory}>
        {props.main_category||"card"}
        </StyledCard>
        {isMainSelected && <SubCategoryBox main={props.main_category} subs={subs}></SubCategoryBox>}

        </Wrapper>
    
    );
}

export default MainCategoryBox;