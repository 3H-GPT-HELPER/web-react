import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";

function LogoutPage(props){
    const navigate=useNavigate();

    const logoutBtn=()=>{
       localStorage.clear();
       navigate("/");

    }


    return(
    <div>
        <Button onClick={logoutBtn} title="로그아웃"></Button>
    </div>
    );
}
export default LogoutPage;