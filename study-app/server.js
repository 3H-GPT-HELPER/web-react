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

        //token
        const date=new Date();
        const day=String(date.getDay()).padStart(2,"0");
        const hour=String(date.getHours()).padStart(2,"0");
        const minutes=String(date.getMinutes()).padStart(2,"0");
        const today=(day+hour+minutes);
        
        const token=jwt.sign({
            type:'JWT',
            userId:userId,
        },SECRET_KEY,{
            expiresIn:'15m',
            issuer:today,
        }
        );
        res.status(200).json({
            message:'로그인 성공',
            token:token
        });

    }catch(err){
        console.error(err);
        res.status(500).json(err);
    }
})
//chrome extension connection

//site login 여부 확인
app.get("/proxy",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    
    if(localStorage.getItem('token')!==null){
        var userId=localStorage.getItem('id')
        res.json({userId:userId,authenticated:'True'})
    }
    else{
        res.json({authenticated:'False'})
    }
    
})

//get data from chrome extension 
app.post("/proxy",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);

    const {question,answer}=req.body;
    console.log("proxy:",question,answer);
   
});

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



