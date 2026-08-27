import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentRoom } from "../../../context/current-room.context";
import ArowBackIcon from "@rsuite/icons/ArowBack";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import { useMediaQuery } from "../../../misc/custom-hooks";
import { Button, ButtonToolbar } from "rsuite";
import RoomInfoBtnModal from "./RoomInfoBtnModal";
import EditRoomBtnDrawer from "./EditRoomBtnDrawer";
import StudyMaterialsModal from "./StudyMaterialsModal";
import PinnedMessagesBanner from "./PinnedMessagesBanner";
import { useProfile } from "../../../context/profile.context";

const ChatTop = () => {
  const name = useCurrentRoom((v) => v.name);
  const description = useCurrentRoom((v) => v.description);
  const category = useCurrentRoom((v) => v.category);
  const isPrivate = useCurrentRoom((v) => v.isPrivate);
  const type = useCurrentRoom((v) => v.type);
  const isAdmin = useCurrentRoom((v) => v.isAdmin);
  const { profile } = useProfile();

  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 992px)");

  const isDm = type === "dm";
  let displayName = name;
  if (isDm && profile) {
    const parts = (name || "").split(" & ");
    if (parts.length === 2) {
      const myName = profile.name || "Peer";
      displayName = parts[0] === myName ? parts[1] : parts[0];
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center text-disappear">
          <Link to={"/"} className="link-unstyled">
            <ArowBackIcon
              className={isMobile ? "d-inline-block p-0 mr-2 text-blue" : "d-none"}
            />
          </Link>
          <div className="text-disappear">
            <div className="d-flex align-items-center">
              <h5 className="text-disappear" style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
                {displayName}
              </h5>
              {category && (
                <span className="badge-pill badge-category">
                  {category}
                </span>
              )}
              {isPrivate && (
                <span className="badge-pill badge-private">
                  🔒 {isDm ? "1-on-1 DM" : "Private"}
                </span>
              )}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {description || "Campus Collaboration Room"}
            </div>
          </div>
        </div>

        <ButtonToolbar className="ws-nowrap">
          <Button
            size="sm"
            appearance="ghost"
            color="blue"
            onClick={() => setIsStudyModalOpen(true)}
            style={{ fontWeight: 600 }}
          >
            <FileDownloadIcon /> Study Notes
          </Button>
          {!isDm && <RoomInfoBtnModal />}
          {isAdmin && !isDm && <EditRoomBtnDrawer />}
        </ButtonToolbar>
      </div>

      <PinnedMessagesBanner
        pinnedMessages={[
          { id: "pin-1", text: "📌 Welcome to the official study channel! Keep discussions academic and adhere to campus guidelines." },
        ]}
      />

      <StudyMaterialsModal
        isOpen={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
        roomName={displayName}
      />
    </div>
  );
};

export default memo(ChatTop);
