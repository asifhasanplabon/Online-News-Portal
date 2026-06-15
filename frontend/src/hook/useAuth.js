import { useSelector } from "react-redux";

const useAuth = () => {
  const { user, loading, error, initialized } = useSelector((state) => state.auth);

  return {
    user,
    loading,
    error,
    initialized,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isEditor: user?.role === "editor",
    isUser: user?.role === "user",
  };
};

export default useAuth;