import { useAuthSore } from "../../store/authUser";
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen";

const HomePage = () => {
  const {user}=useAuthSore();
  return (
    <>
    {user ? <HomeScreen /> : <AuthScreen />}
    </>
  )
}

export default HomePage