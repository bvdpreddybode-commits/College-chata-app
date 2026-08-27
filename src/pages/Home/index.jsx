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
            <Col xs={24} md={8} className="h-100 p-0" style={{ borderRight: "1px solid #e2e8f0" }}>
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
                  <div className="text-center p-4">
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>💬</div>
                    <h5 style={{ fontWeight: 700, color: "#1e293b" }}>Select a Channel or Direct Message</h5>
                    <p style={{ color: "#64748b", fontSize: "13px" }}>
                      Choose a study group or peer from the left sidebar to start communicating.
                    </p>
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
