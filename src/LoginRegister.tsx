import React, { FormEvent, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import { ApiError } from "./types";

export default function LoginRegister() {
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation<{ from?: { pathname: string } }>();
  const isLogin = location.pathname === "/login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      await login(email, password);
      const redirectTo = location.state?.from?.pathname || "/";
      history.push(redirectTo);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.errors) {
        const messages = Object.values(apiError.errors).flat();
        setErrors(messages);
      } else {
        setErrors(["Invalid email or password"]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout activePage={isLogin ? "login" : "register"}>
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">{isLogin ? "Sign in" : "Sign up"}</h1>
              {isLogin ? (
                <p className="text-xs-center">
                  <Link to="/register">Need an account?</Link>
                </p>
              ) : (
                <p className="text-xs-center">
                  <Link to="/login">Have an account?</Link>
                </p>
              )}

              {errors.length > 0 && (
                <ul className="error-messages">
                  {errors.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              )}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <fieldset className="form-group">
                    <input className="form-control form-control-lg" type="text" placeholder="Your Name" disabled />
                  </fieldset>
                )}
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right" disabled={isSubmitting}>
                  {isLogin ? "Sign in" : "Sign up"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
