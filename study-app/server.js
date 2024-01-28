
const express = require("express"); // npm i express | yarn add express
const cors    = require("cors");    // npm i cors | yarn add cors
const mysql   = require("mysql2");   // npm i mysql | yarn add mysql
const app     = express();
const bodyParser=require('body-parser');
const PORT    = 3002; // 포트번호 설정
const jwt=require('jsonwebtoken');
const SECRET_KEY='MY-SECRET-KEY';

const bcrypt=require('bcrypt');
const db=require('./server/db');



let usersLoginStatus={};

let temp_userId="";

app.use(cors({
    origin:'*',
    credentials:true,
    optionsSuccessStatus:200,
}))

app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json());

//port 연결 확인용
app.listen(PORT,()=>{
    console.log(`server is running on port! ${PORT}`);
})
app.get('/', (req, res) =>{
    res.send('화가나')
})

//promise객체 반환까지 async-await에서 await이 기다림
const checkId=(userId)=>{
    return new Promise((resolve,reject)=>{
        db.query('SELECT * FROM User where userId=?',[userId],(err,result)=>{
            if(err) reject(err);
            else resolve(result);
        });

    });
   
};

const createToken=(userId)=>{
    //token
    const date=new Date();
    const day=String(date.getDay()).padStart(2,"0");
    const hour=String(date.getHours()).padStart(2,"0");
    const minutes=String(date.getMinutes()).padStart(2,"0");
    const today=(day+hour+minutes);
    
    const token=jwt.sign({
        type:'JWT',
        user:userId,
    },SECRET_KEY,{
        expiresIn:'15m',
        issuer:today,
    });

    return token;

}

app.post("/signup",async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    const {userId,userPw}=req.body;
    
    try{
        const checkUser=checkId(userId);
        if(checkUser.length){
            res.status(401).json("이미 존재하는 아이디입니다");
            return;
        }    
        const hashedPw=await bcrypt.hashSync(userPw,10);
        console.log("server:",userId,hashedPw);
    
        db.query("INSERT INTO User (userId, password) VALUES (?,?);",[userId,hashedPw],(err,result)=>{
            if (err) {
                res.status(500).send(err); // Sending an error response with status code 500
            } else {
                res.status(200).json("가입 성공");
            }
        });
        
    }catch(err){
        console.error(err);
        res.status(500).json(err);
    }

})

//login
app.post("/login",async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    const {userId,userPw}=req.body;
    try{
        const checkUser=await checkId(userId);
        if(!checkUser.length){
            res.status(401).json("존재하지 않는 아이디입니다.")
            return;
        }
        const dbPw=checkUser[0].password;
        const isMatched=await bcrypt.compare(userPw,dbPw);

        if(!isMatched){
            res.status(401).json("비밀번호가 일치하지 않습니다");
            return;
        }

        const token=createToken(userId);

        res.json({
            message:"로그인 성공",
            token:token
        });

        usersLoginStatus[userId]=true;


    }catch(err){
        console.error(err);
        res.status(500).json(err);
    }
});
//chrome extension connection

//site login 여부 확인
//middle ware
const authenticateToken=(req,res,next)=>{
    const token=req.header('Authorization');
    if(!token) return res.status(401).json({error:'인증 실패'})
    
    jwt.verify(token,SECRET_KEY,(err,user)=>{
        if(err) return res.status(403).json({error:'토큰 만료'});
        req.user=user;
        next();
        
        usersLoginStatus[`${req.user.user}`]=true;
        temp_userId=req.user.user;
        
    });
   

};

app.get('/checkLoginStatus',authenticateToken,(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    const token=req.header('Authorization');
    //console.log("token??",token);
    
    res.json({isloggedIn:true});
});
app.get("/proxy",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    
    if(usersLoginStatus[temp_userId]==true){
        console.log("temp:",temp_userId);
        res.json({username:temp_userId,authenticated:'True'})
    }
    else{
        res.json({authenticated:'False'})
    }
    
})

//python->js
//const spawn=require('child_process').spawn;
const {spawn} = require('child_process');
const cal_similarity_path='./processing/cal_similarity.py';
const extract_topic_path="./processing/extract_topic.py"

const cal_similarity=(answer,categories)=>{
    return new Promise((resolve,reject)=>{
        var newOrOld=""
        const return_dic=spawn('python',[cal_similarity_path,answer,categories]);
                return_dic.stdout.on('data',function(data){
                    newOrOld=data.toString();
                    resolve(newOrOld);
                
                })
    });
     

};

const extract_topic=(answer)=>{
    return new Promise((resolve)=>{
        var result=""
        const topics=spawn('python',[extract_topic_path,answer]);
        topics.stdout.on('data',function(data){
            result=data.toString();
            resolve(result)
        });

    })

};

//get data from chrome extension 
app.post("/proxy",async (req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    
    try{
        const {question,answer}=req.body;
    
    //preprocessing, topic filtering 추가
    var main_category="test_main"
    var sub_category1="test_sub1"
    var sub_category2="test_sub2"
    
    console.log("?!?",question);
    //python->js
    if(usersLoginStatus[temp_userId]==true){
        const getUserCategoryQuery="SELECT * FROM Usercategory where userId=?;"

        const getCategory=()=>{
            return new Promise((resolve,reject)=>{
                db.query(getUserCategoryQuery,[temp_userId],(err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                            
                    }
                });
                
            });
        };
        
        const result=await getCategory();
        const categories=result.map((category)=>(category.name))
        console.log("before cate",categories);

        try{
            const newOrOld=await cal_similarity(answer,categories);
            console.log("neworOld:",newOrOld);

            const topics=await extract_topic(answer);
            console.log("topics",topics);
            var topic_arr=[]
            topic_arr=topics.split("/")
                
                
            if(newOrOld=="new"){
                main_category=topic_arr[0]
                sub_category1=topic_arr[1]
                sub_category2=topic_arr[2]

                console.log("new categories:",main_category,sub_category1,sub_category2);

            }
            else if(newOrOld.slice(0,6)=="existed"){
                main_category=newOrOld.substring(7)
                sub_category1=topic_arr[0]
                sub_category2=topic_arr[1]

                console.log("existed main category:",main_category,sub_category1,sub_category2);

            }
            

        }catch(err){
                console.log("similarity err",err);
        }

        //UserCategory생성, SubCategory, Content순으로 넣기

        //db로 저장
        const addUserCategoryQuery="INSERT INTO UserCategory (name,userId) VALUES(?,?);"
        const addSubCategoryQuery="INSERT INTO SubCategory (main_category,name) VALUES(?,?);"
        const addContent_query="INSERT INTO CONTENT (userId,question,answer,main_category,sub_category1,sub_category2) VALUES(?,?,?,?,?,?);"

        var isMainDuplicated=false;
        //이미 존재하는 user category가 있다면 sub추가부터 진행
        db.query("select *from usercategory where name=?",main_category,(err)=>{
            if(err){
                console.log(err);
            }
            else{
                isMainDuplicated=true;
                console.log("이미 동일한 main category 존재");
            }
        
        })

        if(!isMainDuplicated){
            //User Category db저장
            db.query(addUserCategoryQuery,[main_category,temp_userId],(err)=>{
                if(err){
                    console.error(err);
                    //res.status(500).send(err);
                }else{
                    console.log("main category 저장 완료")
                    //res.status(200).json("main category 저장 완료");
                }
            })

        }

        //sub cagtegory db저장
        db.query(addSubCategoryQuery,[main_category,sub_category1],err=>{
            if(err){
                //res.status(500).send(err);
                console.log(err);
            }else{
                console.log("sub category1 저장 완료")
                //res.status(200).json("sub category1 저장 완료");
            }
        })

        db.query(addSubCategoryQuery,[main_category,sub_category2],err=>{
            if(err){
                //res.status(500).send(err);

            }else{
                //res.status(200).json("sub category2 저장 완료");
            }
        })


        //content db에 저장
        db.query(addContent_query,[temp_userId,question,answer,main_category,sub_category1,sub_category2],(err,result)=>{
            if(err){
                //res.status(500).send(err);
            }else{
                res.status(200).json("답변 서버 저장 완료!");
                console.log("답변 서버 저장 완료!");
            }
        });
        
    }
    else{
        console.log("not login");
    }
    

    }catch(err){
        console.error(err);
        res.status(500).json(err);

    }

   
});
//사용자의 main_category가져오는 api
app.get("/getMainCategory",authenticateToken,(req,res)=>{
    //cors 에러 사전 차단
    res.header("Access-Control-Allow-Origin", "*");
    const userId=req.user.user;

    const query="SELECT * FROM Usercategory where userId=?;"

    db.query(query,[userId],(err,result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).json(result);
            // console.log(result);
            // res.send(result);
        }
    })
    
})
//사용자가 클릭한 main catogory에 속하는 sub category 가져오는 api
app.post("/getSubCategory",authenticateToken,(req,res)=>{
    //cors 에러 사전 차단
    res.header("Access-Control-Allow-Origin", "*");
    const main=req.body.main;
    const userId=req.user.user;
    console.log("main cate",main);

    const query="SELECT * FROM Subcategory where main_category=?;"

    db.query(query,[main],(err,result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).json(result);
          
        }
    })
    
})

//마지막 content detail 가져오는 api
app.post("/getContent",authenticateToken,(req,res)=>{
    //cors 에러 사전 차단
    res.header("Access-Control-Allow-Origin", "*");
    const userId=req.user.user;
    const main=req.body.main;
    const sub=req.body.sub;

    const query="SELECT * FROM Content where main_category=? and sub_category1=? or sub_category2=? and userId=?;"

    db.query(query,[main,sub,sub,userId],(err,result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).json(result);
        }
    })
    
})

//get 잘되는지 test용 추후에 지우기
app.get("/api/user",(req,res)=>{

    //cors 에러 사전 차단
    res.header("Access-Control-Allow-Origin", "*");

    const getUser="SELECT * FROM USER;";

    db.query(getUser,(err,result)=>{
        if (err) {
            res.status(500).send(err); // Sending an error response with status code 500
        } else {
            res.send(result); // Sending the result on success
            console.log(`server is running on port! ${PORT}`);
        }
    })
})



