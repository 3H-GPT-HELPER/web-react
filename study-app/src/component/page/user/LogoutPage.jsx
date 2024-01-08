import { useNavigate } from "react-router-dom";

function LogoutPage(props){
    const navigate=useNavigate();

    const logoutBtn=()=>{
       localStorage.clear();
       navigate("/");

    }


    return(
    <div>
        <button onClick={logoutBtn}>logout</button>
    </div>
    );
}
export default LogoutPage;