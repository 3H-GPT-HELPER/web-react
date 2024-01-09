const THRESHOLD=0.8;

function cal_similarity(answer,userCategories,userContents){
    scores=[];

    if (userCategories.length===0 ||(userContents.length)===0){
        return {'new':answer};
    }

    scores=ModelConfig.test_model.similarity(answer,userCategories);
    console.log("Scores:",scores);

    const maxScore=Math.max(...scores);

    if(maxScore>=THRESHOLD){
        const indexOfMaxScore=scores.indexOf(maxScore);
        const category=userCategories[indexOfMaxScore];
        console.log(`{existed:${category}}`);
        return {'existed':category};
    }else{
        console.log(`{new: ${answer}}`);
        return {'new':answer};
    }
    
}