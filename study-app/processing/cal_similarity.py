#pip install promcse
#from promcse import PromCSE
import joblib
import sys

#추가해야하는 파라미터->categories에 user의 카테고리들
#받은 쿼리와 기존의 토픽들 간 거리 비교
def cal_similarity(answer_str,categories):
    THRESHOLD = 0.7          
    scores = [] #dictionary
        
    test_model = joblib.load(r'/Users/ohbom/Downloads/model.pkl')
    #test_model = joblib.load(r'./processing/model.pkl')

    scores = test_model.similarity(answer_str,categories)

    if len(scores)==1:
        result="new"
        print(result,end='')
        
    else:
        max_score = max(scores)
    
        if max_score >= THRESHOLD:
            ii = list(scores).index(max_score)
            category = categories[ii]
            result="existed"+category
            print(result,end='')
                
            # 새로운 category 생성
        else:
            result="new"
            print(result,end='')
                 
        

# if __name__=='__main__':
#     cal_similarity(sys.argv[1],sys.argv[2])
answer="Watermelon is a large, juicy fruit with a thick green rind and a sweet, red or pink interior containing black seeds or seedless varieties. It belongs to the Cucurbitaceae family, which also includes cucumbers, pumpkins, and squash. Watermelon is known for its high water content, which contributes to its refreshing taste and crisp texture.The fruit is a good source of vitamins A and C, as well as antioxidants like lycopene. Lycopene gives watermelon its red color and has been associated with various health benefits. Watermelon is commonly enjoyed fresh, sliced into wedges or cubes, particularly during hot summer months due to its hydrating properties. It is also used in salads, smoothies, and various desserts. Some varieties of watermelon are seedless, making them easier to eat, while others may contain black seeds."
categories=[ "test_name" ]
cal_similarity(answer,categories)