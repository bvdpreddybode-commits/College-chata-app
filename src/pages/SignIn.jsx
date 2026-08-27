import React, { useState } from "react";
import GoogleOfficialIcon from "@rsuite/icons/legacy/Google";
import {
  Button,
  Col,
  Container,
  Form,
  Grid,
  Message,
  Nav,
  Panel,
  Row,
  SelectPicker,
  Tag,
  toaster,
} from "rsuite";
import { supabase } from "../misc/supabaseClient";
import { useProfile } from "../context/profile.context";
import { useHistory } from "react-router-dom";

const DEPARTMENTS = [
  { label: "Computer Science & Engineering", value: "Computer Science" },
  { label: "Information Technology", value: "Information Technology" },
  { label: "Electronics & Communication", value: "Electronics & Communication" },
  { label: "Electrical Engineering", value: "Electrical Engineering" },
  { label: "Mechanical Engineering", value: "Mechanical Engineering" },
  { label: "Civil Engineering", value: "Civil Engineering" },
  { label: "Biotechnology & Bioinformatics", value: "Biotechnology" },
  { label: "Business & Management", value: "Business & Management" },
  { label: "Applied Sciences & Math", value: "Applied Sciences" },
];

const ROLES = [
  { label: "🎓 Student", value: "Student" },
  { label: "👨‍🏫 Faculty / Professor", value: "Faculty" },
  { label: "📘 Teaching Assistant (TA)", value: "Teaching Assistant" },
  { label: "🛡️ Club Coordinator / Lead", value: "Club Coordinator" },
];

const BATCHES = [
  { label: "1st Year (Batch 2026-2030)", value: "1st Year" },
  { label: "2nd Year (Batch 2025-2029)", value: "2nd Year" },
  { label: "3rd Year (Batch 2024-2028)", value: "3rd Year" },
  { label: "4th Year (Batch 2023-2027)", value: "4th Year" },
  { label: "Postgraduate / Research", value: "Postgraduate" },
  { label: "Faculty / Staff", value: "Faculty / Staff" },
];

const ALLOWED_DOMAIN = "vnrvjiet.in";

const SignIn = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [loading, setLoading] = useState(false);
  const { loginAsDemo } = useProfile();
  const history = useHistory();

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
    rollNo: "",
    department: "Computer Science",
    batch: "3rd Year",
    role: "Student",
  });

  const handleDemoSignIn = (roleKey) => {
    try {
      setLoading(true);
      loginAsDemo(roleKey);
      toaster.push(
        <Message type="success" closable duration={3500}>
          {`Welcome! Signed in as ${roleKey === "admin" ? "🛡️ Super Admin" : roleKey === "faculty" ? "👨‍🏫 Faculty" : "👨‍🎓 Student"}.`}
        </Message>
      );
      history.push("/");
    } catch (err) {
      console.error("Demo login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            hd: ALLOWED_DOMAIN,
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      toaster.push(
        <Message type="error" closable duration={4000}>
          {error.message}
        </Message>
      );
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!signInData.email || !signInData.password) {
      toaster.push(
        <Message type="warning" closable duration={4000}>
          Please fill in both email and password.
        </Message>
      );
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: signInData.email.trim(),
        password: signInData.password,
      });

      if (error) throw error;

      toaster.push(
        <Message type="success" closable duration={4000}>
          Signed in successfully! Welcome back to CampusConnect.
        </Message>
      );
      history.push("/");
    } catch (error) {
      toaster.push(
        <Message type="error" closable duration={4000}>
          {error.message}
        </Message>
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    if (!signUpData.fullName || !signUpData.email || !signUpData.password || !signUpData.rollNo) {
      toaster.push(
        <Message type="warning" closable duration={4000}>
          Please fill in all required campus credentials.
        </Message>
      );
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email.trim(),
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.fullName,
            roll_no: signUpData.rollNo,
            department: signUpData.department,
            batch: signUpData.batch,
            role: signUpData.role,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        // Insert or update profile row in Supabase
        await supabase.from("profiles").upsert({
          id: data.user.id,
          name: signUpData.fullName,
          email: signUpData.email,
          roll_no: signUpData.rollNo,
          department: signUpData.department,
          batch: signUpData.batch,
          role: signUpData.role,
          bio: `${signUpData.role} at ${signUpData.department}`,
          status: "online",
        });
      }

      toaster.push(
        <Message type="success" closable duration={5000}>
          Account created successfully! Welcome to CampusConnect.
        </Message>
      );
      history.push("/");
    } catch (error) {
      toaster.push(
        <Message type="error" closable duration={4000}>
          {error.message}
        </Message>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ minHeight: "100vh", background: "#f1f5f9", padding: "40px 10px" }}>
      <Grid>
        <Row>
          <Col xs={24} sm={20} smOffset={2} md={14} mdOffset={5} lg={12} lgOffset={6}>
            <div className="text-center mb-3">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                  color: "#ffffff",
                  fontSize: 32,
                  boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                }}
              >
                🎓
              </div>
              <h2 className="mt-2" style={{ color: "#0f172a", fontWeight: 800, letterSpacing: "-0.5px" }}>
                CampusConnect <span style={{ color: "#2563eb" }}>Cloud</span>
              </h2>
              <p style={{ color: "#64748b", fontSize: "14px" }}>
                Official University Student & Faculty Collaboration Portal • VNRVJIET
              </p>
            </div>

            {/* Instant 1-Click Demo Login Panel */}
            <div
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "20px",
                color: "#ffffff",
                boxShadow: "0 4px 15px rgba(15,23,42,0.15)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap" style={{ gap: "6px" }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#60a5fa" }}>
                  ⚡ Quick 1-Click Demo Access
                </div>
                <Tag color="green" size="sm">Instant Sandbox</Tag>
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 12px 0", lineHeight: 1.4 }}>
                Explore all channels, study tools, AI assistant, placements, and admin moderation without registration:
              </p>
              <div className="d-flex gap-2 flex-wrap" style={{ gap: "8px" }}>
                <Button
                  size="sm"
                  appearance="primary"
                  color="blue"
                  loading={loading}
                  onClick={() => handleDemoSignIn("student")}
                  style={{ fontWeight: 600, flex: 1, minWidth: "130px" }}
                >
                  👨‍🎓 Student Demo
                </Button>
                <Button
                  size="sm"
                  appearance="primary"
                  color="cyan"
                  loading={loading}
                  onClick={() => handleDemoSignIn("faculty")}
                  style={{ fontWeight: 600, flex: 1, minWidth: "130px" }}
                >
                  👨‍🏫 Faculty Demo
                </Button>
                <Button
                  size="sm"
                  appearance="primary"
                  color="red"
                  loading={loading}
                  onClick={() => handleDemoSignIn("admin")}
                  style={{ fontWeight: 600, flex: 1, minWidth: "130px" }}
                >
                  🛡️ Super Admin Demo
                </Button>
              </div>
            </div>

            <Panel
              bordered
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                padding: "12px",
              }}
            >
              <Nav
                appearance="subtle"
                activeKey={activeTab}
                onSelect={setActiveTab}
                justified
                style={{ marginBottom: "20px" }}
              >
                <Nav.Item eventKey="signin" style={{ fontWeight: 600 }}>
                  Campus Sign In
                </Nav.Item>
                <Nav.Item eventKey="signup" style={{ fontWeight: 600 }}>
                  Student / Faculty Register
                </Nav.Item>
              </Nav>

              {activeTab === "signin" && (
                <div>
                  <Form fluid>
                    <Form.Group controlId="signin-email">
                      <Form.ControlLabel>Campus / University Email</Form.ControlLabel>
                      <Form.Control
                        name="email"
                        type="email"
                        placeholder="student@vnrvjiet.in"
                        value={signInData.email}
                        onChange={(v) => setSignInData({ ...signInData, email: v })}
                      />
                    </Form.Group>

                    <Form.Group controlId="signin-password">
                      <Form.ControlLabel>Password</Form.ControlLabel>
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="Enter password..."
                        value={signInData.password}
                        onChange={(v) => setSignInData({ ...signInData, password: v })}
                        onKeyDown={(e) => e.keyCode === 13 && handleEmailSignIn()}
                      />
                    </Form.Group>

                    <Button
                      block
                      color="blue"
                      appearance="primary"
                      loading={loading}
                      onClick={handleEmailSignIn}
                      style={{ marginTop: "15px", height: "42px", fontWeight: 600 }}
                    >
                      Sign In to Portal
                    </Button>
                  </Form>

                  <div
                    style={{
                      textAlign: "center",
                      margin: "20px 0 10px 0",
                      color: "#94a3b8",
                      fontSize: "12px",
                      position: "relative",
                    }}
                  >
                    <span>── OR CONTINUE WITH ──</span>
                  </div>

                  <Button
                    block
                    appearance="ghost"
                    loading={loading}
                    onClick={onGoogleSignIn}
                    style={{ height: "42px", color: "#334155" }}
                  >
                    <GoogleOfficialIcon style={{ color: "#ea4335", marginRight: "8px" }} />
                    University Google Account (@{ALLOWED_DOMAIN})
                  </Button>
                </div>
              )}

              {activeTab === "signup" && (
                <div>
                  <Form fluid>
                    <Form.Group controlId="signup-name">
                      <Form.ControlLabel>Full Name *</Form.ControlLabel>
                      <Form.Control
                        name="fullName"
                        placeholder="e.g. Alex Johnson"
                        value={signUpData.fullName}
                        onChange={(v) => setSignUpData({ ...signUpData, fullName: v })}
                      />
                    </Form.Group>

                    <Row>
                      <Col xs={12}>
                        <Form.Group controlId="signup-roll">
                          <Form.ControlLabel>Roll No / ID *</Form.ControlLabel>
                          <Form.Control
                            name="rollNo"
                            placeholder="e.g. 21241A0501"
                            value={signUpData.rollNo}
                            onChange={(v) => setSignUpData({ ...signUpData, rollNo: v })}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group controlId="signup-role">
                          <Form.ControlLabel>Campus Role</Form.ControlLabel>
                          <SelectPicker
                            data={ROLES}
                            cleanable={false}
                            block
                            value={signUpData.role}
                            onChange={(v) => setSignUpData({ ...signUpData, role: v })}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId="signup-dept">
                      <Form.ControlLabel>Department / Major</Form.ControlLabel>
                      <SelectPicker
                        data={DEPARTMENTS}
                        cleanable={false}
                        block
                        value={signUpData.department}
                        onChange={(v) => setSignUpData({ ...signUpData, department: v })}
                      />
                    </Form.Group>

                    <Form.Group controlId="signup-batch">
                      <Form.ControlLabel>Academic Year / Batch</Form.ControlLabel>
                      <SelectPicker
                        data={BATCHES}
                        cleanable={false}
                        block
                        value={signUpData.batch}
                        onChange={(v) => setSignUpData({ ...signUpData, batch: v })}
                      />
                    </Form.Group>

                    <Form.Group controlId="signup-email">
                      <Form.ControlLabel>College / University Email *</Form.ControlLabel>
                      <Form.Control
                        name="email"
                        type="email"
                        placeholder="alex.j@vnrvjiet.in"
                        value={signUpData.email}
                        onChange={(v) => setSignUpData({ ...signUpData, email: v })}
                      />
                    </Form.Group>

                    <Form.Group controlId="signup-password">
                      <Form.ControlLabel>Create Password *</Form.ControlLabel>
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={signUpData.password}
                        onChange={(v) => setSignUpData({ ...signUpData, password: v })}
                      />
                    </Form.Group>

                    <Button
                      block
                      color="green"
                      appearance="primary"
                      loading={loading}
                      onClick={handleEmailSignUp}
                      style={{ marginTop: "15px", height: "42px", fontWeight: 600 }}
                    >
                      Register Campus ID
                    </Button>
                  </Form>
                </div>
              )}
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default SignIn;

