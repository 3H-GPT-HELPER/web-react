import styled from "styled-components";

const StyledCard=styled.button`
    padding:8px 16px;
    font-size:16px;
    border-white:1px;
    border-radius:8px;
    cursor:pointer;
    width:"100vw";
    height:"100vh";
    padding:"1.5rem";
    backgroundColor:lightgrey;
    :hover{
        background:grey;
    };
    
`;

function Card(props){
    const {title, onClick}=props;
    return(<StyledCard onClick={onClick}>
        {title||"card"}
    </StyledCard>);
}

export default Card;