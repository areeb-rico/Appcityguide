import { Navigate } from 'react-router-dom';

function AuthGuard({ children }) 
{
    var token = localStorage.getItem("token")
    
    if(token)
    {
        return children 
    }
    else
    {
        return <Navigate to="/login" />  
    }
}

export default AuthGuard