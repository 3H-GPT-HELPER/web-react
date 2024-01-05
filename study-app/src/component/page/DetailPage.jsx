import { useParams } from "react-router-dom";

function DetailPage(props){
    const {main_category,sub_category}=useParams();
    //해당 main, sub를 가지는 data를 요청해서 렌더링(db와 연결)

    return(<div>detail 도착!main:{main_category} sub:{sub_category}</div>);
}

export default DetailPage;