import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContextValue";

const links = [
  { label: "Home", href: "/" },
  { label: "Analyze", href: "/dashboard" },
  { label: "History", href: "/dashboard#history" },
  { label: "Optimizations", href: "/optimizations" },
  { label: "Settings", href: "/settings" },
];

const TopNav = ({ active = "Home", compact = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, logout } = useContext(AuthContext);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setAccountOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setAccountOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      className={`top-nav ${compact ? "compact" : ""}`}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="top-nav-bar">
        <motion.a
          href="/"
          className="brand"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          ResumAI
        </motion.a>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => (
            <motion.a
              key={link.label}
              className={active === link.label ? "active" : ""}
              href={link.href}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={closeMenu}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <div className="account-menu">
          <motion.button
            type="button"
            className="avatar avatar-button"
            aria-label="Open account menu"
            aria-expanded={accountOpen}
            onClick={() => {
              setAccountOpen((value) => !value);
              setMenuOpen(false);
            }}
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.92 }}
          >
            <span>{user?.name?.charAt(0)?.toUpperCase() || "R"}</span>
          </motion.button>

          <AnimatePresence>
            {accountOpen && (
              <motion.div
                className="account-dropdown"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
              >
                <div className="account-summary">
                  <strong>{user?.name || "Guest Candidate"}</strong>
                  <small>{user?.email || "Sign in to save scans"}</small>
                </div>

                <a href="/" onClick={() => setAccountOpen(false)}>
                  Home
                </a>
                <a href="/dashboard" onClick={() => setAccountOpen(false)}>
                  Dashboard
                </a>
                <a href="/settings" onClick={() => setAccountOpen(false)}>
                  Settings
                </a>

                {token ? (
                  <button type="button" onClick={handleLogout}>
                    Logout
                  </button>
                ) : (
                  <a href="/login" onClick={() => setAccountOpen(false)}>
                    Login
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.button
            type="button"
            className="nav-overlay"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default TopNav;
