import { useSelector, useDispatch } from "react-redux";
import { selectAuth, logout } from "../../store/slices/authSlice";
import { useLogoutMutation } from "../../services/authApi";

export const useAuth = () => {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logout());
    }
  };

  return {
    ...auth,
    logout: handleLogout,
  };
};
