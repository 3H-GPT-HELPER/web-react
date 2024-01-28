import styled from "styled-components";

const StyledButton=styled.button`
    padding:10px;
    font-size:14px;
    border-radius:10px;
    background-color:white;
    border-color:white;
    cursor:pointer;
    width:20vw;
    height:"0px";
    margin:10px;
    :hover{
        background-color:grey;
    };
      
`;

function Button(props){
  const {title, onClick}=props;
  return(<StyledButton onClick={onClick}>
      {title||"card"}
  </StyledButton>);
}

export default Button;
