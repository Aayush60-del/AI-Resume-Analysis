import { useContext, useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import neuralImage from "../assets/unnamed.png";
import { AuthContext } from "../context/authContextValue";
import { loginUser } from "../services/authServices";
import getErrorMessage from "../utils/getErrorMessage";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await loginUser(formData);

      login(response.token, response.user);
      navigate("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-left">
        <motion.div
          className="auth-copy"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span>ResumAI v2.0</span>
          <h1>
            Engineering <br />
            <b>The Future</b> of <br />
            Talent.
          </h1>
          <img src={neuralImage} alt="Neural scan visualization" />
          <p>
            Access our specialized neural engine to deconstruct resumes and
            synthesize high-performance career narratives.
          </p>
        </motion.div>
      </section>

      <section className="auth-right">
        <motion.form
          className="login-card"
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <div className="card-heading">
            <h2>System Access</h2>
            <p>Initialize your professional profile.</p>
          </div>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="candidate@nexus.corp"
              className="input-shell"
              required
            />
          </label>

          <label>
            <span className="label-line">
              Password <Link to="/signup">Create account</Link>
            </span>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="input-shell"
              required
            />
          </label>

          <button type="submit" className="login-primary" disabled={loading}>
            {loading ? "Initializing..." : "Execute Login"}
          </button>

          <small>OR INITIALIZE NEW</small>

          <button
            type="button"
            className="login-secondary"
            onClick={() => navigate("/signup")}
          >
            Provision New Account
          </button>

          <div className="cluster-status">
            <i /> AI Cluster: Online
          </div>
        </motion.form>

        <footer>Copyright 2026 ResumAI Engineering. Built for Elite Careers.</footer>
      </section>
    </main>
  );
};

export default AuthPage;
