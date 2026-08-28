import { supabase } from "./supabaseClient";

// No hardcoded dummy members — only real registered campus students and faculty
export const DEFAULT_CAMPUS_DIRECTORY = [];

/**
 * Registers / upserts any entering student or faculty member into both:
 * 1. Supabase `profiles` database table
 * 2. Local storage campus registry cache
 */
export async function registerCampusStudent(student) {
  if (!student) return;

  const uid = student.uid || student.id;
  if (!uid) return;

  // Do not register generic demo accounts as real campus students
  if (uid.startsWith("demo-")) return;

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

    // Filter out any past dummy peers
    list = list.filter(
      (u) =>
        !u.id?.startsWith("peer-") &&
        !u.uid?.startsWith("peer-") &&
        !u.id?.startsWith("demo-")
    );

    const existingIdx = list.findIndex(
      (u) => u.id === uid || u.uid === uid || (u.email && u.email === formatted.email)
    );
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
 * Loads all real registered campus students from:
 * - Supabase `profiles` database
 * - Locally cached registered students
 */
export async function fetchAllCampusMembers(currentUid) {
  const memberMap = new Map();

  // 1. Fetch live Supabase database profiles (real registered students)
  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (data && Array.isArray(data)) {
      data.forEach((u) => {
        if (u.id && !u.id.startsWith("peer-") && !u.id.startsWith("demo-")) {
          memberMap.set(u.id, {
            uid: u.id,
            id: u.id,
            name: u.name || "Student",
            email: u.email,
            avatar:
              u.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name || u.id)}`,
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

  // 2. Merge with localStorage registered students
  try {
    const raw = localStorage.getItem("campus_registered_students");
    if (raw) {
      const localList = JSON.parse(raw);
      if (Array.isArray(localList)) {
        localList.forEach((u) => {
          const id = u.uid || u.id;
          if (id && !id.startsWith("peer-") && !id.startsWith("demo-")) {
            if (!memberMap.has(id)) {
              memberMap.set(id, {
                ...u,
                uid: id,
                id: id,
                rollNo: u.rollNo || u.roll_no,
              });
            }
          }
        });
      }
    }
  } catch (e) {
    // ignore
  }

  // 3. Exclude current logged in user
  const allMembers = Array.from(memberMap.values()).filter(
    (u) => u.uid !== currentUid && u.id !== currentUid
  );

  // 4. Sort: Online members & students first
  allMembers.sort((a, b) => {
    if (a.status === "online" && b.status !== "online") return -1;
    if (a.status !== "online" && b.status === "online") return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  return allMembers;
}
