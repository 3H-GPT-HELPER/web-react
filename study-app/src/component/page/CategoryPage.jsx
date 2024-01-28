import styled from "styled-components";
import data from "../../data.json"
import "../../css/CategoryPage.css"
import MainCategoryBox from "../container/MainCategoryBox";
import {useState} from "react";
const Server_URL = "http://localhost:3002";

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
    max-width:720px;
    &>*{
        :not(:last-child){
            margin-bottom:16px;
        }
    }
`;
const ContentContainer=styled.div`
    padding:8px 16px;
    border:1px solid grey;
    border-radius:8px;
`;

const CategoryText=styled.p`
    font-size:28px;
    font-weight:500;
`;

const AnswerText=styled.p`
    font-size:20px;
    line-height:32px;
    white-space:pre-wrap;
`;

//category page에 main과 sub category 상태를 useState로 업데이트 한후 다 선택되면
//다음 detail page로 넘어가며 그때 렌더링
function CategoryPage(props){
    const [mains,setMains]=useState([]);
    
    const getMainCategory=async()=>{
        try{
            const res=await fetch(Server_URL+'/getMainCategory',{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:localStorage.getItem("token")
                }
            })
            const datas=await res.json();
            // const categories=[];
            // datas.forEach((item)=>{
            //     categories.append(item['name']);
            // })
            // console.log(categories);
            // const categories=data.mainCategories;
            //setMains((prevMains) => [...prevMains, ...datas]);
            setMains(datas);
        
        }catch(err){
            console.log('main category get err:',err);
        };
    };

    if(mains.length==0){
        getMainCategory();

    }

    
      // //for test
    const userId="ohbom"
    const user_contents = data.filter((item) => item.userId === userId);
    
    return(
        <div class="category_container">
                {mains.map((content)=>(
                    <div class="item">
            
                                <MainCategoryBox
                                key={content.id}
                                main_category={content.name}
                                >
                                </MainCategoryBox>
                                </div>))}
                    
        </div>

    );
    

}
export default CategoryPage;