import { Link,Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import {useAuth} from "../hooks/useAuth"



const RegisterPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { register } = useAuth();

  if (user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>RegisterPage</div>
  )
}

export default RegisterPage