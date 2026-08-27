import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../misc/supabaseClient";

const DEFAULT_ROOMS = [
  {
    id: "general-campus",
    name: "🏛️ General Campus Lounge",
    description: "Main college community chat for all students and faculty.",
    created_at: new Date().toISOString(),
    admins: { system: true },
  },
  {
    id: "cs-dept",
    name: "💻 Computer Science & IT Hub",
    description: "Discussions on coding, algorithms, projects, and hackathons.",
    created_at: new Date().toISOString(),
    admins: { system: true },
  },
  {
    id: "study-circle",
    name: "📚 Exam Prep & Study Circle",
    description: "Share notes, ask questions, and collaborate on assignments.",
    created_at: new Date().toISOString(),
    admins: { system: true },
  },
  {
    id: "campus-placements",
    name: "🚀 Placements & Internships",
    description: "Career guidance, interview experiences, and job openings.",
    created_at: new Date().toISOString(),
    admins: { system: true },
  },
];

const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [unlockedRooms, setUnlockedRooms] = useState(() => {
    try {
      const saved = sessionStorage.getItem("unlocked_rooms");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const unlockRoom = (roomId) => {
    setUnlockedRooms((prev) => {
      const updated = { ...prev, [roomId]: true };
      try {
        sessionStorage.setItem("unlocked_rooms", JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  const fetchRooms = async () => {
    try {
      const { data } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setRooms(data);
      } else if (!data || data.length === 0) {
        // Fallback default rooms
        setRooms(DEFAULT_ROOMS);
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setRooms(DEFAULT_ROOMS);
    }
  };

  useEffect(() => {
    fetchRooms();

    // Subscribe to realtime room changes
    const channel = supabase
      .channel("public:rooms")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <RoomsContext.Provider value={{ rooms, unlockedRooms, unlockRoom, fetchRooms }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const val = useContext(RoomsContext);
  return val ? val.rooms : undefined;
};

export const useRoomsContext = () => useContext(RoomsContext);
