import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import AuthorImage from "./AuthorImage";

interface NavbarProps {
  activePage?: "home" | "login" | "register";
}

export default function Navbar({ activePage }: NavbarProps) {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link className={`nav-link${activePage === "home" ? " active" : ""}`} to="/">
              Home
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/editor">
                  <i className="ion-compose" />
                  &nbsp;New Article
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/settings">
                  <i className="ion-gear-a" />
                  &nbsp;Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/profile/${user?.username}`}>
                  <AuthorImage image={user?.image} alt={user?.username} className="user-pic" />
                  &nbsp;{user?.username}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/logout">
                  Sign out
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className={`nav-link${activePage === "login" ? " active" : ""}`} to="/login">
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link${activePage === "register" ? " active" : ""}`} to="/register">
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
