import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Loader, Nav } from "rsuite";
import { useRooms } from "../../context/rooms.context";
import { useProfile } from "../../context/profile.context";
import RoomItem from "./RoomItem";

const CATEGORY_ORDER = [
  { key: "Announcements", title: "📢 Announcements & Notices" },
  { key: "Department", title: "🏛️ Department Channels" },
  { key: "Course", title: "📖 Courses & Subjects" },
  { key: "Study Group", title: "👥 Private Study Groups" },
  { key: "Clubs", title: "🎭 Clubs & Societies" },
  { key: "General", title: "💬 General Campus Rooms" },
];

const ChatRoomList = ({ aboveElHeight, activeTab = "channels" }) => {
  const rooms = useRooms();
  const location = useLocation();
  const { profile } = useProfile();
  const currentUid = profile?.uid || profile?.id;

  // Filter channels vs DMs
  const { channelsByCategory, directMessages } = useMemo(() => {
    if (!rooms) return { channelsByCategory: {}, directMessages: [] };

    const dms = [];
    const catMap = {
      Announcements: [],
      Department: [],
      Course: [],
      "Study Group": [],
      Clubs: [],
      General: [],
    };

    rooms.forEach((room) => {
      const isDm = room.type === "dm" || room.is_dm;
      if (isDm) {
        // Only show DMs where current user is a member or admin
        const isMember =
          (Array.isArray(room.members) && room.members.includes(currentUid)) ||
          (room.members && room.members[currentUid]) ||
          (room.admins && room.admins[currentUid]) ||
          room.created_by === currentUid;

        if (isMember) {
          dms.push(room);
        }
      } else {
        const cat = room.category || "General";
        if (catMap[cat]) {
          catMap[cat].push(room);
        } else {
          catMap.General.push(room);
        }
      }
    });

    return { channelsByCategory: catMap, directMessages: dms };
  }, [rooms, currentUid]);

  return (
    <Nav
      appearance="subtle"
      vertical
      className="overflow-y-scroll custom-scroll"
      style={{
        height: `calc(100% - ${aboveElHeight}px)`,
        paddingBottom: "20px",
      }}
      activeKey={location.pathname}
    >
      {!rooms && (
        <Loader center vertical content="Loading campus channels..." speed="slow" size="md" />
      )}

      {/* Direct Messages Tab */}
      {rooms && activeTab === "dms" && (
        <>
          {directMessages.length === 0 ? (
            <div className="text-center p-4" style={{ color: "#64748b", fontSize: "13px" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔒</div>
              <p>No direct messages yet.</p>
              <p style={{ fontSize: "11px", color: "#94a3b8" }}>
                Click "Private DM" above to search students and start a conversation.
              </p>
            </div>
          ) : (
            directMessages.map((room) => (
              <Nav.Item eventKey={`/chat/${room.id}`} key={room.id} style={{ borderRadius: 6, margin: "2px 0" }}>
                <Link style={{ textDecoration: "none" }} to={`/chat/${room.id}`}>
                  <RoomItem room={room} />
                </Link>
              </Nav.Item>
            ))
          )}
        </>
      )}

      {/* Channels Tab */}
      {rooms && activeTab === "channels" && (
        <>
          {CATEGORY_ORDER.map(({ key, title }) => {
            const list = channelsByCategory[key] || [];
            if (list.length === 0) return null;

            return (
              <div key={key} style={{ marginBottom: "10px" }}>
                <div className="category-header">
                  <span>{title}</span>
                  <span className="badge-pill badge-category" style={{ fontSize: "9px" }}>
                    {list.length}
                  </span>
                </div>
                {list.map((room) => (
                  <Nav.Item
                    eventKey={`/chat/${room.id}`}
                    key={room.id}
                    style={{ borderRadius: 6, margin: "2px 0" }}
                  >
                    <Link style={{ textDecoration: "none" }} to={`/chat/${room.id}`}>
                      <RoomItem room={room} />
                    </Link>
                  </Nav.Item>
                ))}
              </div>
            );
          })}
        </>
      )}
    </Nav>
  );
};

export default ChatRoomList;
