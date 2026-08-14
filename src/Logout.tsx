import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  const history = useHistory();

  useEffect(() => {
    logout();
    history.replace("/");
  }, [logout, history]);

  return (
    <Layout activePage="home">
      <div className="container page">
        <p>Signing out...</p>
      </div>
    </Layout>
  );
}
