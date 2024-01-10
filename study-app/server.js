
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

//get data from chrome extension 
app.post("/proxy",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    
    try{
        const {question,answer}=req.body;
    
    //preprocessing, topic filtering 추가
    const main_category="test_main"
    const sub_category1="test_sub1"
    const sub_category2="test_sub2"

    //UserCategory생성, SubCategory, Content순으로 넣기

    //db로 저장
    const query="INSERT INTO CONTENT (userId,question,answer,main_category,sub_category1,sub_category2) VALUES(?,?,?,?,?,?);"


    db.query(query,[temp_userId,question,answer,main_category,sub_category1,sub_category2],(err,result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).json("답변 서버 저장 완료!");
            console.log("!");
        }
    });

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

    const query="SELECT * FROM Subcategory where main_category=? and userId=?;"

    db.query(query,[main,userId],(err,result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).json(result);
            // console.log(result);
            // res.send(result);
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

    const query="SELECT * FROM Content where main_category=? and sub_category1=? and userId=?;"

    db.query(query,[main,sub,userId],(err,result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).json(result);
            // console.log(result);
            // res.send(result);
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



