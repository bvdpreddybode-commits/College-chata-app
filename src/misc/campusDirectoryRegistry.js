import { supabase } from "./supabaseClient";

export const DEFAULT_CAMPUS_DIRECTORY = [
  {
    uid: "peer-priya-01",
    id: "peer-priya-01",
    name: "Priya Sharma",
    email: "priya.s@vnrvjiet.in",
    department: "Computer Science & Engineering",
    rollNo: "21241A0545",
    roll_no: "21241A0545",
    batch: "3rd Year",
    role: "Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    status: "online",
    bio: "AI & Fullstack enthusiast. 3rd year CSE.",
  },
  {
    uid: "peer-ravi-02",
    id: "peer-ravi-02",
    name: "Ravi Kumar",
    email: "ravi.k@vnrvjiet.in",
    department: "Information Technology",
    rollNo: "21241A1208",
    roll_no: "21241A1208",
    batch: "3rd Year",
    role: "Teaching Assistant",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi",
    status: "online",
    bio: "Teaching Assistant for Cloud & Operating Systems.",
  },
  {
    uid: "peer-rao-03",
    id: "peer-rao-03",
    name: "Dr. K. V. Rao",
    email: "kv_rao@vnrvjiet.in",
    department: "Computer Science & Engineering",
    rollNo: "FAC-CSE-012",
    roll_no: "FAC-CSE-012",
    batch: "Faculty",
    role: "Faculty",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrRao",
    status: "online",
    bio: "Associate Professor, Department of Computer Science.",
  },
  {
    uid: "peer-sneha-04",
    id: "peer-sneha-04",
    name: "Sneha Reddy",
    email: "sneha.r@vnrvjiet.in",
    department: "Electronics & Communication",
    rollNo: "22241A0419",
    roll_no: "22241A0419",
    batch: "2nd Year",
    role: "Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    status: "online",
    bio: "ECE student exploring IoT, embedded systems, and robotics.",
  },
  {
    uid: "peer-arjun-05",
    id: "peer-arjun-05",
    name: "Arjun Patel",
    email: "arjun.p@vnrvjiet.in",
    department: "Computer Science & Engineering",
    rollNo: "21241A0512",
    roll_no: "21241A0512",
    batch: "3rd Year",
    role: "Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    status: "online",
    bio: "Competitive programmer & Open Source contributor.",
  },
  {
    uid: "peer-meera-06",
    id: "peer-meera-06",
    name: "Meera Joshi",
    email: "meera.j@vnrvjiet.in",
    department: "Mechanical Engineering",
    rollNo: "22241A0318",
    roll_no: "22241A0318",
    batch: "2nd Year",
    role: "Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
    status: "away",
    bio: "Mechanical engineering student interested in CAD & Robotics.",
  },
  {
    uid: "peer-vikram-07",
    id: "peer-vikram-07",
    name: "Vikram Singh",
    email: "vikram.s@vnrvjiet.in",
    department: "Information Technology",
    rollNo: "21241A1245",
    roll_no: "21241A1245",
    batch: "3rd Year",
    role: "Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    status: "online",
    bio: "DevOps & Cloud architecture learner.",
  },
  {
    uid: "peer-ananya-08",
    id: "peer-ananya-08",
    name: "Ananya Rao",
    email: "ananya.r@vnrvjiet.in",
    department: "Computer Science & Engineering",
    rollNo: "22241A0501",
    roll_no: "22241A0501",
    batch: "2nd Year",
    role: "Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    status: "online",
    bio: "Web developer & UI/UX designer.",
  },
];

/**
 * Registers / upserts any entering student or faculty member into both:
 * 1. Supabase `profiles` database table
 * 2. Local storage campus registry cache
 */
export async function registerCampusStudent(student) {
  if (!student) return;

  const uid = student.uid || student.id;
  if (!uid) return;

  const formatted = {
    id: uid,
    name: student.name || student.full_name || "Campus Student",
    email: student.email || `${uid}@vnrvjiet.in`,
    roll_no: student.rollNo || student.roll_no || `STU-${uid.slice(0, 5).toUpperCase()}`,
    department: student.department || "Computer Science",
    batch: student.batch || "3rd Year",
    role: student.role || "Student",
    avatar:
      student.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.name || uid)}`,
    status: "online",
    bio: student.bio || `${student.role || "Student"} • ${student.department || "Campus"}`,
    created_at: student.created_at || new Date().toISOString(),
    last_seen: new Date().toISOString(),
  };

  // 1. Sync to local storage registered registry
  try {
    const raw = localStorage.getItem("campus_registered_students");
    let list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];

    const existingIdx = list.findIndex((u) => u.id === uid || u.uid === uid || (u.email && u.email === formatted.email));
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...formatted, status: "online" };
    } else {
      list.unshift(formatted);
    }
    localStorage.setItem("campus_registered_students", JSON.stringify(list));
  } catch (e) {
    // ignore
  }

  // 2. Sync to Supabase `profiles` table
  try {
    await supabase.from("profiles").upsert(formatted);
  } catch (e) {
    console.warn("Supabase directory upsert notice:", e);
  }
}

/**
 * Loads all registered campus students combining:
 * - Supabase `profiles`
 * - Locally cached registered students
 * - Default campus directory peers
 */
export async function fetchAllCampusMembers(currentUid) {
  const memberMap = new Map();

  // 1. Seed with default directory
  DEFAULT_CAMPUS_DIRECTORY.forEach((u) => {
    memberMap.set(u.uid || u.id, {
      ...u,
      uid: u.uid || u.id,
      rollNo: u.rollNo || u.roll_no,
    });
  });

  // 2. Merge with localStorage registered students
  try {
    const raw = localStorage.getItem("campus_registered_students");
    if (raw) {
      const localList = JSON.parse(raw);
      if (Array.isArray(localList)) {
        localList.forEach((u) => {
          const id = u.uid || u.id;
          if (id) {
            memberMap.set(id, {
              ...u,
              uid: id,
              rollNo: u.rollNo || u.roll_no,
            });
          }
        });
      }
    }
  } catch (e) {
    // ignore
  }

  // 3. Merge with live Supabase database profiles
  try {
    const { data } = await supabase.from("profiles").select("*").limit(100);
    if (data && Array.isArray(data)) {
      data.forEach((u) => {
        if (u.id) {
          memberMap.set(u.id, {
            uid: u.id,
            id: u.id,
            name: u.name || "Student",
            email: u.email,
            avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name || u.id)}`,
            rollNo: u.roll_no || "",
            roll_no: u.roll_no || "",
            department: u.department || "General",
            batch: u.batch || "",
            role: u.role || "Student",
            status: u.status || "online",
            bio: u.bio || "",
          });
        }
      });
    }
  } catch (e) {
    console.warn("Supabase fetch profiles notice:", e);
  }

  // 4. Exclude current logged in user
  const allMembers = Array.from(memberMap.values()).filter((u) => u.uid !== currentUid && u.id !== currentUid);

  // 5. Sort: Online members & students first
  allMembers.sort((a, b) => {
    if (a.status === "online" && b.status !== "online") return -1;
    if (a.status !== "online" && b.status === "online") return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  return allMembers;
}
