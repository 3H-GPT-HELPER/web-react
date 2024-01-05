import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import Card from "../ui/Card";

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
    &>*{
        :not(:last-child){
            margin-bottom:16px;
        }
    }
`;

function MainPage(props){
    const navigate=useNavigate();
    return(
        <Wrapper>
            <Container>
                <Card
                title="categories"
                onClick={(item)=>{navigate("/category");}}
                >

                </Card>
            </Container>
        </Wrapper>
    );
}

export default MainPage;