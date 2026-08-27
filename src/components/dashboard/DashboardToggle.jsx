import React, { useCallback } from "react";
import { Button, Drawer, Message, toaster } from "rsuite";
import DashboardIcon from "@rsuite/icons/Dashboard";
import { useMediaQuery, useModalState } from "../../misc/custom-hooks";
import Dashboard from ".";
import { supabase } from "../../misc/supabaseClient";

import { useProfile } from "../../context/profile.context";

const DashboardToggle = () => {
  const { isOpen, close, open } = useModalState();
  const isMobile = useMediaQuery("(max-width: 992px)");
  const { signOut } = useProfile();

  const onSignOut = useCallback(async () => {
    try {
      if (signOut) {
        await signOut();
      } else {
        await supabase.auth.signOut();
      }
      toaster.push(
        <Message type="info" closable duration={4000}>
          Signed out successfully
        </Message>
      );
      close();
    } catch (err) {
      toaster.push(
        <Message type="error" closable duration={4000}>
          {err.message}
        </Message>
      );
    }
  }, [close, signOut]);

  return (
    <>
      <Button block color="blue" appearance="primary" onClick={open}>
        <DashboardIcon /> Dashboard
      </Button>
      <Drawer
        size={isMobile ? "full" : "sm"}
        open={isOpen}
        onClose={close}
        placement="left"
      >
        <Dashboard onSignOut={onSignOut} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
