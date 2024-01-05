import styled from "styled-components";
import data from "../../data.json"
import MainCategoryBox from "../container/MainCategoryBox";

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

      // //for test
    const userId="ohbom"
    const user_contents = data.filter((item) => item.userId === userId);
    
    return(
        <Wrapper>
            <Container>
                {user_contents.map((content)=>(
                    <MainCategoryBox
                    key={content.main_category.id}
                    main_category={content.main_category}
                    >
                    </MainCategoryBox>
                ))}
                

            </Container>
        </Wrapper>
    );
    

}
export default CategoryPage;