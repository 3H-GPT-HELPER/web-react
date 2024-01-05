
import styled from "styled-components";
import ListItem from "./ListItem"; 

const Wrapper=styled.div`
    display:flex;
    flex-direction:column;
    align-itmes:flex-start;
    justify-content:center;
    
    &>*{
        :not(:last-child){
            margin-bottom:16px;
        }
    }
`;

function List(props){
    const {contents,onClickItem}=props;
    return(
        <Wrapper>
            {contents.map((content,index)=>{
                return(
                    <ListItem
                    key={content.id}
                    content={content}
                    onClick={()=>{onClickItem(content);}}
                    >

                    </ListItem>
                );
            })}

        </Wrapper>
    );
}

export default List;