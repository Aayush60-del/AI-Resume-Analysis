import { useContext, useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import neuralImage from "../assets/unnamed.png";
import { AuthContext } from "../context/authContextValue";
import { registerUser } from "../services/authServices";
import getErrorMessage from "../utils/getErrorMessage";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await registerUser(formData);

      login(response.token, response.user);
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error, "Registration failed"));
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
            Initialize <br />
            <b>Your Future</b> <br />
            Profile.
          </h1>

          <img src={neuralImage} alt="Neural scan visualization" />

          <p>
            Create your AI-powered professional identity and unlock neural ATS
            analysis.
          </p>
        </motion.div>
      </section>

      <section className="auth-right">
        <motion.form
          className="login-card"
          onSubmit={handleRegister}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div className="card-heading">
            <h2>Provision Account</h2>
            <p>Create your professional AI profile.</p>
          </div>

          <label>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="Ayush Negi"
              className="real-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="candidate@nexus.corp"
              className="real-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="real-input"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </label>

          <button type="submit" className="login-primary" disabled={loading}>
            {loading ? "Initializing..." : "Create Account"}
          </button>

          <small>ALREADY INITIALIZED?</small>

          <button
            type="button"
            className="login-secondary"
            onClick={() => navigate("/login")}
          >
            Return to Login
          </button>
        </motion.form>

        <footer>Copyright 2026 ResumAI Engineering.</footer>
      </section>
    </main>
  );
};

export default RegisterPage;
