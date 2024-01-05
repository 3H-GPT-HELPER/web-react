import styled from "styled-components";

const Wrapper=styled.div`
    width:calc(100%-32px);
    padding:16px;
    display:flex;
    flex-direction:column;
    align-itmes:flex-start;
    justify-content:center;
    border:1px solid grey;
    border-radius:8px;
    cursor:pointer;
    background:white;
    :hover{
        background:lightgrey;
    }
`;

const QuestionText=styled.p`
    font-size:20px;
    font-weight:500;
`;
const AnswerText=styled.p`
    font-size:20px;
    font-weight:500;
`;
function ListItem(props){
    const {content}=props;
    return(
        <Wrapper>
            <QuestionText>{content.title}</QuestionText>
            <AnswerText>{content.answer}</AnswerText>
        </Wrapper>

    );
}

export default ListItem;