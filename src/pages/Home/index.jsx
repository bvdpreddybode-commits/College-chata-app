import React from "react";
import { Switch, Route, useRouteMatch } from "react-router";
import { Col, Grid, Row } from "rsuite";
import Sidebar from "../../components/Sidebar";
import { RoomsProvider } from "../../context/rooms.context";
import { useMediaQuery } from "../../misc/custom-hooks";
import Chat from "./Chat";

const Home = () => {
  const isDesktop = useMediaQuery("(min-width: 992px)");
  const { isExact } = useRouteMatch();

  const canRenderSidebar = isDesktop || isExact;

  return (
    <RoomsProvider>
      <Grid fluid className="h-100 p-0">
        <Row className="h-100 m-0">
          {canRenderSidebar && (
            <Col xs={24} md={8} className="h-100 p-0">
              <Sidebar />
            </Col>
          )}

          <Switch>
            <Route exact path="/chat/:chatId">
              <Col xs={24} md={16} className="h-100 p-0">
                <Chat />
              </Col>
            </Route>
            <Route>
              {isDesktop && (
                <Col xs={24} md={16} className="h-100 p-0 d-flex align-items-center justify-content-center">
                  <div className="welcome-empty-state">
                    <div className="welcome-icon">💬</div>
                    <h5>Start a Conversation</h5>
                    <p>
                      Pick a study channel from the sidebar, or message a classmate privately. Your campus, your connections.
                    </p>
                    <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                      <div
                        style={{
                          padding: "10px 16px",
                          background: "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(139,92,246,0.06))",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid rgba(37,99,235,0.1)",
                          fontSize: "12px",
                          color: "var(--primary)",
                          fontWeight: 600,
                        }}
                      >
                        🏛️ Join a Channel
                      </div>
                      <div
                        style={{
                          padding: "10px 16px",
                          background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(236,72,153,0.06))",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid rgba(139,92,246,0.1)",
                          fontSize: "12px",
                          color: "var(--accent)",
                          fontWeight: 600,
                        }}
                      >
                        🔒 Private DM a Peer
                      </div>
                      <div
                        style={{
                          padding: "10px 16px",
                          background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(37,99,235,0.06))",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid rgba(16,185,129,0.1)",
                          fontSize: "12px",
                          color: "#059669",
                          fontWeight: 600,
                        }}
                      >
                        🤖 Ask AI Study Buddy
                      </div>
                    </div>
                  </div>
                </Col>
              )}
            </Route>
          </Switch>
        </Row>
      </Grid>
    </RoomsProvider>
  );
};

export default Home;
