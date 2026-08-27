import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../misc/supabaseClient";

export const isOfflineForDatabase = {
  state: "offline",
  last_changed: new Date().toISOString(),
};

export const DEMO_PROFILES = {
  student: {
    id: "demo-student-001",
    uid: "demo-student-001",
    name: "Alex Johnson",
    email: "alex.johnson@vnrvjiet.in",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    department: "Computer Science & Engineering",
    roll_no: "21241A0501",
    rollNo: "21241A0501",
    batch: "3rd Year",
    role: "Student",
    isAdmin: false,
    bio: "Passionate CS student exploring Full-Stack, AI/ML, and Cloud Systems.",
    hidePresence: false,
    hide_presence: false,
    status: "online",
  },
  faculty: {
    id: "demo-faculty-001",
    uid: "demo-faculty-001",
    name: "Dr. Anand Rao",
    email: "anand_rao@vnrvjiet.in",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ProfRao",
    department: "Computer Science & Engineering",
    roll_no: "FAC-CSE-042",
    rollNo: "FAC-CSE-042",
    batch: "Faculty / Staff",
    role: "Faculty",
    isAdmin: true,
    bio: "Professor & HOD, Department of Computer Science. Research: Distributed Systems & Cloud.",
    hidePresence: false,
    hide_presence: false,
    status: "online",
  },
  admin: {
    id: "demo-admin-001",
    uid: "demo-admin-001",
    name: "Prathap Reddy",
    email: "bvdpreddybode@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PrathapAdmin",
    department: "System Administration",
    roll_no: "ADMIN-001",
    rollNo: "ADMIN-001",
    batch: "Administration",
    role: "Admin",
    isAdmin: true,
    bio: "Platform Super Administrator & Lead Infrastructure Engineer.",
    hidePresence: false,
    hide_presence: false,
    status: "online",
  },
};

const SUPER_ADMIN_EMAILS = ["bvdpreddybode@gmail.com"];

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginAsDemo = useCallback((demoKey = "student") => {
    const demoData = DEMO_PROFILES[demoKey] || DEMO_PROFILES.student;
    try {
      sessionStorage.setItem("campus_demo_profile", JSON.stringify(demoData));
    } catch (e) {
      // ignore
    }
    setProfile(demoData);
    setIsLoading(false);
    return demoData;
  }, []);

  const signOut = useCallback(async () => {
    try {
      sessionStorage.removeItem("campus_demo_profile");
      localStorage.removeItem("campus_demo_profile");
    } catch (e) {
      // ignore
    }
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase sign out error:", e);
    }
    setProfile(null);
    setIsLoading(false);
  }, []);

  const fetchProfile = useCallback(async (user) => {
    // 1. Check if demo session exists in sessionStorage first
    try {
      const savedDemo = sessionStorage.getItem("campus_demo_profile");
      if (savedDemo) {
        const parsed = JSON.parse(savedDemo);
        setProfile(parsed);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      // ignore
    }

    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const userEmail = (user.email || "").toLowerCase().trim();
    const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(userEmail);

    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        const role = isSuperAdmin ? "Admin" : (data.role || "Student");
        setProfile({
          ...data,
          uid: data.id,
          name: data.name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Student",
          email: data.email || user.email,
          avatar: data.avatar || user.user_metadata?.avatar_url || null,
          department: data.department || (isSuperAdmin ? "System Administration" : "Computer Science"),
          rollNo: data.roll_no || (isSuperAdmin ? "ADMIN-001" : "STU-" + user.id.slice(0, 5).toUpperCase()),
          batch: data.batch || (isSuperAdmin ? "Administration" : "3rd Year"),
          role: role,
          isAdmin: isSuperAdmin || role === "Admin" || data.is_admin === true,
          bio: data.bio || (isSuperAdmin ? "Platform Super Administrator" : "Campus Member"),
          hidePresence: data.hide_presence || false,
        });
      } else {
        // Create fallback profile if not found
        const fallbackProfile = {
          id: user.id,
          uid: user.id,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || (isSuperAdmin ? "Super Admin" : "Student"),
          email: user.email,
          avatar: user.user_metadata?.avatar_url || null,
          department: isSuperAdmin ? "System Administration" : "Computer Science",
          roll_no: isSuperAdmin ? "ADMIN-001" : "STU-" + user.id.slice(0, 5).toUpperCase(),
          batch: isSuperAdmin ? "Administration" : "3rd Year",
          role: isSuperAdmin ? "Admin" : "Student",
          isAdmin: isSuperAdmin,
          bio: isSuperAdmin ? "Platform Super Administrator" : "Campus Member",
          hide_presence: false,
          status: "online",
        };

        // Attempt to insert profile in background
        supabase.from("profiles").upsert(fallbackProfile).then(() => {});
        setProfile({
          ...fallbackProfile,
          rollNo: fallbackProfile.roll_no,
          hidePresence: false,
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      // Ensure user can still access
      setProfile({
        id: user.id,
        uid: user.id,
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || (isSuperAdmin ? "Super Admin" : "Student"),
        email: user.email,
        avatar: user.user_metadata?.avatar_url || null,
        department: isSuperAdmin ? "System Administration" : "Computer Science",
        rollNo: isSuperAdmin ? "ADMIN-001" : "STU-" + user.id.slice(0, 5).toUpperCase(),
        batch: isSuperAdmin ? "Administration" : "3rd Year",
        role: isSuperAdmin ? "Admin" : "Student",
        isAdmin: isSuperAdmin,
        bio: isSuperAdmin ? "Platform Super Administrator" : "Campus Member",
        hidePresence: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Check if demo session exists first
    try {
      const savedDemo = sessionStorage.getItem("campus_demo_profile");
      if (savedDemo) {
        setProfile(JSON.parse(savedDemo));
        setIsLoading(false);
        return;
      }
    } catch (e) {
      // ignore
    }

    // 2. Get initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session?.user || null);
    });

    // 3. Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, isLoading, loginAsDemo, signOut }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

