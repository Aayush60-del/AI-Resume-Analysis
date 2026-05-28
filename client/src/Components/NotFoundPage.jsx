import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContextValue";

const NotFoundPage = () => {
  const { token } = useContext(AuthContext);

  return (
    <main className="empty-analysis">
      <h1>Page Not Found</h1>
      <p>The page you opened does not exist in ResumAI.</p>

      <div className="button-row" style={{ justifyContent: "center" }}>
        <Link to="/">
          <button className="go-dashboard-btn" type="button">
            Go Home
          </button>
        </Link>

        <Link to={token ? "/dashboard" : "/login"}>
          <button className="btn-white" type="button">
            {token ? "Go To Dashboard" : "Sign In"}
          </button>
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
