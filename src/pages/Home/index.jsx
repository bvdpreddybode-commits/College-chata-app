import React, { useState } from "react";
import { Switch, Route, useRouteMatch } from "react-router";
import { useHistory } from "react-router-dom";
import { Col, Grid, Row } from "rsuite";
import Sidebar from "../../components/Sidebar";
import { RoomsProvider } from "../../context/rooms.context";
import { useMediaQuery } from "../../misc/custom-hooks";
import Chat from "./Chat";
import StartDmModal from "../../components/direct_messages/StartDmModal";
import AiStudyRoomTabs from "../../components/chat_window/AiStudyRoomTabs";

const Home = () => {
  const isDesktop = useMediaQuery("(min-width: 992px)");
  const { isExact } = useRouteMatch();
  const history = useHistory();

  const [isDmModalOpen, setIsDmModalOpen] = useState(false);
  const [isAiHubOpen, setIsAiHubOpen] = useState(false);

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
                    <div
                      style={{
                        marginTop: "24px",
                        display: "flex",
                        gap: "12px",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => history.push("/chat/general-campus")}
                        style={{
                          padding: "10px 18px",
                          background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(139,92,246,0.08))",
                          borderRadius: "var(--radius-md)",
                          border: "1.5px solid rgba(37,99,235,0.2)",
                          fontSize: "13px",
                          color: "var(--primary)",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 2px 6px rgba(37,99,235,0.06)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 6px rgba(37,99,235,0.06)";
                        }}
                      >
                        🏛️ Join a Channel
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsDmModalOpen(true)}
                        style={{
                          padding: "10px 18px",
                          background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.08))",
                          borderRadius: "var(--radius-md)",
                          border: "1.5px solid rgba(139,92,246,0.2)",
                          fontSize: "13px",
                          color: "var(--accent)",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 2px 6px rgba(139,92,246,0.06)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(139,92,246,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 6px rgba(139,92,246,0.06)";
                        }}
                      >
                        🔒 Private DM a Peer
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsAiHubOpen(true)}
                        style={{
                          padding: "10px 18px",
                          background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(37,99,235,0.08))",
                          borderRadius: "var(--radius-md)",
                          border: "1.5px solid rgba(16,185,129,0.2)",
                          fontSize: "13px",
                          color: "#059669",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 2px 6px rgba(16,185,129,0.06)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,185,129,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 6px rgba(16,185,129,0.06)";
                        }}
                      >
                        🤖 Ask AI Study Buddy
                      </button>
                    </div>
                  </div>
                </Col>
              )}
            </Route>
          </Switch>
        </Row>
      </Grid>

      {/* Direct Message Finder Modal */}
      <StartDmModal
        isOpen={isDmModalOpen}
        onClose={() => setIsDmModalOpen(false)}
      />

      {/* AI Study Hub & Explanations Modal */}
      <AiStudyRoomTabs
        isOpen={isAiHubOpen}
        onClose={() => setIsAiHubOpen(false)}
        initialTab="ai"
      />
    </RoomsProvider>
  );
};

export default Home;
