import { useNavigate } from "react-router-dom";

const useLoginRedirect = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = (location) => {
    localStorage.setItem("redirectAfterLogin", location);
    navigate("/auth/login");
  };

  return handleLoginRedirect;
};

export default useLoginRedirect;