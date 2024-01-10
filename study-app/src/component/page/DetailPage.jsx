import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
const Server_URL = "http://localhost:3002";

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
                // const categories=[];
                // datas.forEach((item)=>{
                //     categories.append(item['name']);
                // })
                // console.log(categories);
                // const categories=data.mainCategories;
                //setMains((prevMains) => [...prevMains, ...datas]);
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
        <div>
             <div>detail 도착!main:{main_category} sub:{sub_category}</div><br></br>
        {contents.map((content)=>(
            <div>
                <div>question:{content.question}</div>
                <div>answer:{content.answer}</div>

            </div>
  
    ))}
        </div>
   
    );
}

export default DetailPage;