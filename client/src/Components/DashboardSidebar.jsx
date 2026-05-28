import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContextValue";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/dashboard#upload", label: "Upload" },
  { to: "/dashboard#history", label: "History" },
  { to: "/optimizations", label: "Optimizations", end: true },
  { to: "/settings", label: "Settings", end: true },
];

const DashboardSidebar = ({ active = "dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", open);
    return () => document.body.classList.remove("sidebar-open");
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isActive = (item) => {
    const key = item.label.toLowerCase();

    if (key === "upload" || key === "history") {
      return false;
    }

    if (key === "home") {
      return active === "home";
    }

    return active === key;
  };

  const closeSidebar = () => setOpen(false);

  const handleNavClick = () => {
    closeSidebar();
  };

  return (
    <div className="dashboard-sidebar-shell">
      <header className="dashboard-mobile-header">
        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <NavLink to="/dashboard" className="mobile-header-brand" onClick={handleNavClick}>
          ResumAI
        </NavLink>
      </header>

      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            className="sidebar-overlay"
            aria-label="Close navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      <aside className={`side-nav ${open ? "is-open" : ""}`} id="dashboard-sidebar">
        <div className="side-nav-head">
          <NavLink to="/" className="side-brand" onClick={handleNavClick}>
            ResumAI
          </NavLink>

          <button
            type="button"
            className="sidebar-close"
            aria-label="Close sidebar"
            onClick={closeSidebar}
          >
            ×
          </button>
        </div>

        <nav>
          {navItems.map((item) => (
            <motion.div key={item.label} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              {item.to.includes("#") ? (
                <a
                  href={item.to}
                  className={isActive(item) ? "active" : undefined}
                  onClick={handleNavClick}
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  to={item.to}
                  className={isActive(item) ? "active" : undefined}
                  end={item.end}
                  onClick={handleNavClick}
                >
                  {item.label}
                </NavLink>
              )}
            </motion.div>
          ))}

          <motion.button
            type="button"
            className="logout-btn"
            onClick={() => {
              closeSidebar();
              logout();
              navigate("/login");
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            Logout
          </motion.button>
        </nav>

        <motion.div
          className="candidate-mini"
          onClick={() => {
            closeSidebar();
            navigate("/settings");
          }}
          style={{ cursor: "pointer" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span aria-hidden="true" />
          <div>
            <b>{user?.name || "Candidate"}</b>
            <small>View Settings</small>
          </div>
        </motion.div>
      </aside>
    </div>
  );
};

export default DashboardSidebar;
