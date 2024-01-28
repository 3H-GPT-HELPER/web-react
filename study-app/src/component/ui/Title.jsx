import styled from "styled-components";

const title=styled.div`
    font-style:bold;
    border-radius:10
    
    
`;

function Title(props){
    const {title,type}=props;

    
    return(<title>
        {title}
    </title>);
}

export default Title;