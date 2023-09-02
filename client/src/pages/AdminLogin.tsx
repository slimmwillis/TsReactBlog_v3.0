import React, { useState, useContext } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { AuthContext, AuthContextType } from "../context/AuthContext";

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "admin";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAdmin } = useContext(AuthContext) as AuthContextType;

  const loginAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("Please fill your email address and password");
      return;
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      toast.error("Wrong email or password!");
      return;
    }

    setAdmin({
      email,
      password,
    });

    localStorage.setItem("admin", JSON.stringify({ email, password }));
    toast.success("Login Successful");
    navigate(`/Subscribe`);
  };

  return (
    <Form onSubmit={loginAdmin}>
      <Row
        style={{
          // height: "80vh",
          justifyContent: "center",
          paddingTop: "3%",
        }}
      >
        <Col sm={5} xs={10}>
          <Stack gap={3}>
            <h2>Login</h2>
            <Form.Control
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Form.Control
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default AdminLogin;
