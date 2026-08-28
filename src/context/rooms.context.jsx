import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../misc/supabaseClient";

export const parseRoom = (room) => {
  if (!room) return room;
  let category = room.category || "General";
  let isPrivate = room.isPrivate || room.is_private || false;
  let passcode = room.passcode || "";
  let cleanDesc = room.description || "";

  if (cleanDesc && (cleanDesc.startsWith("{") || cleanDesc.startsWith("["))) {
    try {
      const parsed = JSON.parse(cleanDesc);
      if (typeof parsed === "object" && parsed !== null) {
        cleanDesc = parsed.text || cleanDesc;
        if (parsed.category) category = parsed.category;
        if (parsed.isPrivate !== undefined) isPrivate = parsed.isPrivate;
        if (parsed.passcode) passcode = parsed.passcode;
      }
    } catch (e) {
      // not JSON, keep as is
    }
  }

  return {
    ...room,
    description: cleanDesc,
    category,
    isPrivate: !!isPrivate,
    is_private: !!isPrivate,
    passcode: passcode || "",
  };
};

const DEFAULT_ROOMS = [
  {
    id: "general-campus",
    name: "🏛️ General Campus Lounge",
    description: "Main college community chat for all students and faculty.",
    created_at: new Date().toISOString(),
    admins: { system: true },
    category: "Announcements",
    isPrivate: false,
    is_dm: false,
  },
  {
    id: "cs-dept",
    name: "💻 Computer Science & IT Hub",
    description: "Discussions on coding, algorithms, projects, and hackathons.",
    created_at: new Date().toISOString(),
    admins: { system: true },
    category: "Department",
    isPrivate: false,
    is_dm: false,
  },
  {
    id: "study-circle",
    name: "📚 Exam Prep & Study Circle",
    description: "Share notes, ask questions, and collaborate on assignments.",
    created_at: new Date().toISOString(),
    admins: { system: true },
    category: "Study Group",
    isPrivate: false,
    is_dm: false,
  },
  {
    id: "campus-placements",
    name: "🚀 Placements & Internships",
    description: "Career guidance, interview experiences, and job openings.",
    created_at: new Date().toISOString(),
    admins: { system: true },
    category: "Department",
    isPrivate: false,
    is_dm: false,
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

  const unlockRoom = useCallback((roomId) => {
    setUnlockedRooms((prev) => {
      const updated = { ...prev, [roomId]: true };
      try {
        sessionStorage.setItem("unlocked_rooms", JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  }, []);

  const mergeWithLocalRooms = useCallback((dbRooms) => {
    let localRooms = [];
    try {
      const raw = localStorage.getItem("campus_created_rooms");
      if (raw) localRooms = JSON.parse(raw);
    } catch (e) {
      // ignore
    }

    const map = new Map();
    // 1. Add default rooms first
    DEFAULT_ROOMS.forEach((r) => map.set(r.id, parseRoom(r)));
    // 2. Add local rooms
    localRooms.forEach((r) => map.set(r.id, parseRoom(r)));
    // 3. Add database rooms (latest override)
    (dbRooms || []).forEach((r) => map.set(r.id, parseRoom(r)));

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0)
    );
  }, []);

  const addRoomOptimistic = useCallback((newRoom) => {
    const parsed = parseRoom(newRoom);
    // Save to local cache
    try {
      const raw = localStorage.getItem("campus_created_rooms");
      const list = raw ? JSON.parse(raw) : [];
      const updated = [parsed, ...list.filter((r) => r.id !== parsed.id)];
      localStorage.setItem("campus_created_rooms", JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    setRooms((prev) => {
      const filtered = (prev || []).filter((r) => r.id !== parsed.id);
      return [parsed, ...filtered];
    });
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });

      const merged = mergeWithLocalRooms(data || []);
      setRooms(merged);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setRooms(mergeWithLocalRooms([]));
    }
  }, [mergeWithLocalRooms]);

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
  }, [fetchRooms]);

  return (
    <RoomsContext.Provider
      value={{
        rooms,
        unlockedRooms,
        unlockRoom,
        fetchRooms,
        addRoomOptimistic,
      }}
    >
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const val = useContext(RoomsContext);
  return val ? val.rooms : undefined;
};

export const useRoomsContext = () => useContext(RoomsContext);
