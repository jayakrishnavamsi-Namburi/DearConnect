import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const navigate = useNavigate();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
      } else {
        setAuthChecked(true);
      }
    }, []);

    if (!authChecked) {
      return null; // or show a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
