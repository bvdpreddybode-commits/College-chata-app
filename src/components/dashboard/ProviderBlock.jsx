import React from "react";
import { Tag } from "rsuite";
import GoogleOfficialIcon from "@rsuite/icons/legacy/Google";
import { useProfile } from "../../context/profile.context";

const ProviderBlock = () => {
  const { profile } = useProfile();

  return (
    <div>
      <div className="d-flex align-items-center flex-wrap" style={{ gap: "8px" }}>
        <Tag color="green" appearance="primary">
          <GoogleOfficialIcon style={{ marginRight: 4 }} /> Campus Supabase Auth
        </Tag>
        <span style={{ fontSize: "12px", color: "#64748b" }}>
          {profile?.email || "Signed In"}
        </span>
      </div>
    </div>
  );
};

export default ProviderBlock;
