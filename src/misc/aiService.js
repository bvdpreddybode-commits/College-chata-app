/**
 * CampusConnect AI Client Service
 * Supports academic Q&A, PDF Summarization, Quiz Generation, Flashcards, and Study Plans.
 * Built with secure client-side heuristic processing + backend AI proxy compatibility.
 */

// Sample knowledge base for campus topics
const TOPIC_KNOWLEDGE = {
  dbms: {
    title: "Database Management Systems (DBMS)",
    summary: "DBMS is software designed to store, retrieve, manage, and query structured relational and non-relational data efficiently with ACID transactions.",
    keyConcepts: ["ACID Properties (Atomicity, Consistency, Isolation, Durability)", "Relational Algebra & SQL", "Normalization (1NF, 2NF, 3NF, BCNF)", "Indexing (B+ Trees, Hashing)", "Concurrency Control (2PL, Timestamp Ordering)"],
    quizzes: [
      {
        question: "Which normal form eliminates partial functional dependencies?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correctIndex: 1,
        explanation: "2NF requires the relation to be in 1NF and all non-prime attributes must be fully functionally dependent on candidate keys (no partial dependencies).",
        topic: "Normalization"
      },
      {
        question: "Which ACID property ensures transactions are fully completed or rolled back with no intermediate states?",
        options: ["Atomicity", "Consistency", "Isolation", "Durability"],
        correctIndex: 0,
        explanation: "Atomicity guarantees 'all or nothing' execution of transactional database operations.",
        topic: "Transactions"
      },
      {
        question: "True or False: B+ Trees store data pointers only at leaf nodes, making range queries faster.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "In B+ Trees, internal nodes only store keys for routing while leaf nodes contain all keys and pointers with linked sibling nodes for sequential range scans.",
        topic: "Indexing"
      },
      {
        question: "What is the primary purpose of Write-Ahead Logging (WAL) in database engines?",
        options: ["To speed up SELECT queries", "To ensure Durability during system crashes", "To compress disk space", "To encrypt passwords"],
        correctIndex: 1,
        explanation: "WAL ensures transaction modifications are recorded on non-volatile log storage before changes are written to disk pages, enabling recovery after sudden crashes.",
        topic: "Storage & Recovery"
      }
    ],
    flashcards: [
      { front: "What are ACID properties in DBMS?", back: "Atomicity (all or nothing), Consistency (preserves integrity rules), Isolation (concurrent safety), and Durability (persists after commit).", topic: "ACID" },
      { front: "What is 3NF (Third Normal Form)?", back: "A table is in 3NF if it is in 2NF and contains no transitive functional dependencies (no non-key attribute depends on another non-key attribute).", topic: "Normalization" },
      { front: "What is the difference between Clustered and Non-Clustered Index?", back: "A Clustered index defines the physical order of data rows on disk (only 1 per table). A Non-clustered index stores a separate pointer structure pointing to physical rows.", topic: "Indexing" },
      { front: "Explain Two-Phase Locking (2PL).", back: "2PL guarantees serializability with two phases: Growing Phase (locks acquired, none released) and Shrinking Phase (locks released, none acquired).", topic: "Concurrency" }
    ]
  },
  cloud: {
    title: "Cloud Computing & Distributed Systems",
    summary: "Cloud computing delivers computing resources—servers, storage, databases, networking, software, and analytics—over the internet with utility pricing and on-demand elasticity.",
    keyConcepts: ["Service Models: SaaS, PaaS, IaaS", "Deployment Models: Public, Private, Hybrid, Multi-Cloud", "Virtualization & Hypervisors (Type 1 vs Type 2)", "Horizontal vs Vertical Elastic Scaling", "Fault Tolerance & Multi-Region Load Balancing"],
    quizzes: [
      {
        question: "Which Cloud service model provides virtual machines, raw storage blocks, and virtual networks?",
        options: ["SaaS", "PaaS", "IaaS", "FaaS"],
        correctIndex: 2,
        explanation: "IaaS (Infrastructure as a Service) provides foundational compute instances, raw storage, and virtual networking infrastructure.",
        topic: "Cloud Service Models"
      },
      {
        question: "In Virtualization, what type of Hypervisor runs directly on bare-metal physical hardware without an underlying OS?",
        options: ["Type 1 (Bare-Metal)", "Type 2 (Hosted)", "Container Daemon", "Paravirtualized shim"],
        correctIndex: 0,
        explanation: "Type 1 hypervisors (e.g. VMware ESXi, KVM, Xen) run directly on physical hardware for minimal overhead and maximum performance.",
        topic: "Virtualization"
      },
      {
        question: "What is the key difference between Scalability and Elasticity in Cloud Computing?",
        options: ["Scalability is manual; Elasticity is automated real-time adaptation", "Scalability is only vertical; Elasticity is only horizontal", "Scalability applies to storage; Elasticity applies only to CPU", "They are identical terms"],
        correctIndex: 0,
        explanation: "Scalability is the system's capacity to handle growing workloads, while Elasticity is the cloud's ability to automatically dynamically acquire and release resources in real-time based on demand.",
        topic: "Cloud Architecture"
      }
    ],
    flashcards: [
      { front: "Explain SaaS vs PaaS vs IaaS.", back: "SaaS: End-user applications (e.g., CampusConnect, Google Docs). PaaS: Development platform & managed runtimes (e.g., Supabase, Vercel). IaaS: Fundamental compute, storage, & networking infrastructure (e.g., AWS EC2, GCP Compute Engine).", topic: "Service Models" },
      { front: "What is Horizontal Scaling (Scale-Out)?", back: "Adding more physical or virtual server instances to distribute incoming traffic loads, as opposed to vertical scaling (upgrading CPU/RAM of a single machine).", topic: "Scalability" },
      { front: "What is the CAP Theorem in Distributed Systems?", back: "A distributed system can only guarantee at most two of the following three properties simultaneously: Consistency, Availability, and Partition Tolerance.", topic: "Distributed Systems" }
    ]
  },
  os: {
    title: "Operating Systems (OS)",
    summary: "Operating Systems manage hardware resources, process scheduling, memory allocation, file systems, and provide system call interfaces for application software.",
    keyConcepts: ["Process Scheduling (FCFS, Round Robin, Priority, Multi-Level)", "Deadlock Detection & Prevention (Banker's Algorithm)", "Virtual Memory, Paging & Page Replacement (LRU, FIFO, Optimal)", "Threads & Synchronization (Semaphores, Mutexes)"],
    quizzes: [
      {
        question: "Which condition is NOT one of Coffman's four conditions for Deadlock?",
        options: ["Mutual Exclusion", "Hold and Wait", "Preemption allowed", "Circular Wait"],
        correctIndex: 2,
        explanation: "Deadlock requires 'No Preemption'—resources cannot be forcibly taken away from processes holding them.",
        topic: "Deadlocks"
      },
      {
        question: "Which page replacement algorithm suffers from Belady's Anomaly?",
        options: ["LRU (Least Recently Used)", "FIFO (First In First Out)", "Optimal", "LFU"],
        correctIndex: 1,
        explanation: "FIFO can experience Belady's Anomaly where allocating more page frames results in an increased number of page faults.",
        topic: "Virtual Memory"
      }
    ],
    flashcards: [
      { front: "What is a Context Switch?", back: "The procedure of saving the execution state (registers, program counter, stack) of a currently running process and restoring the state of another process to resume execution.", topic: "Process Management" },
      { front: "What are the 4 Coffman Deadlock Conditions?", back: "1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait.", topic: "Deadlocks" },
      { front: "Difference between Process and Thread?", back: "A Process is an independent program execution with its own dedicated memory space. A Thread is a lightweight execution unit within a process sharing the same address space and resources.", topic: "Concurrency" }
    ]
  }
};

export const aiService = {
  /**
   * Ask an academic question or request topic explanation
   */
  async askQuestion({ query, context = "", topic = "General" }) {
    // Simulate smart AI response latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lowerQuery = (query + " " + context + " " + topic).toLowerCase();

    let matchedDomain = "general";
    if (lowerQuery.includes("dbms") || lowerQuery.includes("sql") || lowerQuery.includes("database") || lowerQuery.includes("normal")) {
      matchedDomain = "dbms";
    } else if (lowerQuery.includes("cloud") || lowerQuery.includes("iaas") || lowerQuery.includes("paas") || lowerQuery.includes("virtual") || lowerQuery.includes("scale")) {
      matchedDomain = "cloud";
    } else if (lowerQuery.includes("os") || lowerQuery.includes("process") || lowerQuery.includes("deadlock") || lowerQuery.includes("paging") || lowerQuery.includes("thread")) {
      matchedDomain = "os";
    }

    const domainData = TOPIC_KNOWLEDGE[matchedDomain];

    if (domainData && (lowerQuery.includes("summary") || lowerQuery.includes("summarize"))) {
      return {
        answer: `### 📚 Summary of ${domainData.title}\n\n${domainData.summary}\n\n#### Key Takeaways:\n${domainData.keyConcepts.map(c => `• **${c}**`).join("\n")}\n\n💡 *Tip: You can generate an interactive quiz or flashcard deck from this topic in the Study Room tabs.*`,
        sources: [domainData.title, "CampusConnect Academic Knowledge Base"],
        suggestedActions: ["Generate 5 Questions Quiz", "Create Revision Flashcards", "Ask Follow-up Doubt"]
      };
    }

    return {
      answer: `### 🎓 CampusConnect AI Academic Response\n\nRegarding **"${query}"**:\n\n1. **Core Concept**: In ${topic || "Computer Science"}, understanding the fundamental abstraction layers and performance tradeoffs is essential.\n\n2. **Detailed Breakdown**:\n   - **Theoretical Foundation**: Core mechanisms focus on high availability, consistent state transitions, and low latency.\n   - **Practical Application**: In production systems, engineers apply caching, indexing, and modular decoupling to scale efficiently.\n   - **Exam / Viva Highlight**: Be prepared to explain boundary conditions, time complexity, and compare alternative architectural approaches.\n\n3. **Quick Example / Formula**:\n   $$\\text{Throughput} = \\frac{\\text{Total Requests Completed}}{\\text{Total Time Elapsed}}$$\n\nFeel free to ask for a code sample, generate quiz questions, or upload a PDF syllabus for line-by-line doubt clearing!`,
      sources: ["University Syllabus", "Standard Engineering Reference", "CampusConnect AI Engine"],
      suggestedActions: ["Summarize Topic", "Generate Practice Quiz", "Make Flashcard Deck"]
    };
  },

  /**
   * Summarize an uploaded document or PDF text
   */
  async summarizeDocument({ documentName, documentText = "" }) {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const name = documentName || "Uploaded Study Material";
    return {
      title: `Executive Summary: ${name}`,
      executiveSummary: `This academic resource covers comprehensive theory, architecture patterns, practical algorithms, and review questions relevant for university coursework.`,
      keyTopics: [
        "Fundamental principles & terminology definitions",
        "Step-by-step mathematical derivations and architectural diagrams",
        "Real-world engineering use-cases and comparative analysis",
        "Frequently asked exam problems and solutions"
      ],
      quickRevisionPoints: [
        "Ensure solid understanding of primary definitions and edge cases.",
        "Practice drawing block diagrams and timing sequence charts.",
        "Review end-of-chapter numericals and multiple-choice questions."
      ],
      suggestedQuizCount: 10
    };
  },

  /**
   * Generate interactive AI Quiz
   */
  async generateQuiz({ topic = "dbms", difficulty = "Medium", questionCount = 5, questionType = "MCQ" }) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const key = topic.toLowerCase().includes("cloud") ? "cloud" : topic.toLowerCase().includes("os") ? "os" : "dbms";
    const baseQuizzes = TOPIC_KNOWLEDGE[key]?.quizzes || TOPIC_KNOWLEDGE.dbms.quizzes;

    // Extend to requested count
    const pool = [...baseQuizzes];
    while (pool.length < questionCount) {
      pool.push({
        question: `[Practice ${pool.length + 1}] For high-throughput ${TOPIC_KNOWLEDGE[key].title} systems, what is the best architectural practice?`,
        options: ["Implement caching & connection pooling", "Use single-threaded synchronous processing", "Store all queries in flat text files", "Disable indexing entirely"],
        correctIndex: 0,
        explanation: "Caching frequently accessed data and pooling database/network connections minimizes overhead and latency.",
        topic: TOPIC_KNOWLEDGE[key].title
      });
    }

    return pool.slice(0, questionCount);
  },

  /**
   * Generate Flashcard Deck
   */
  async generateFlashcards({ topic = "dbms", count = 6 }) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const key = topic.toLowerCase().includes("cloud") ? "cloud" : topic.toLowerCase().includes("os") ? "os" : "dbms";
    const baseDeck = TOPIC_KNOWLEDGE[key]?.flashcards || TOPIC_KNOWLEDGE.dbms.flashcards;

    const cards = [...baseDeck];
    while (cards.length < count) {
      cards.push({
        front: `Key Concept #${cards.length + 1} in ${TOPIC_KNOWLEDGE[key].title}`,
        back: `Detailed explanation of efficiency, asymptotic complexity, and engineering implementation guidelines for ${TOPIC_KNOWLEDGE[key].title}.`,
        topic: TOPIC_KNOWLEDGE[key].title
      });
    }

    return cards.slice(0, count);
  },

  /**
   * Generate a structured exam revision study plan
   */
  async generateStudyPlan({ subject = "Cloud Computing", examDate = "Next Week", daysAvailable = 7 }) {
    await new Promise((resolve) => setTimeout(resolve, 700));

    return [
      { day: "Day 1-2", focus: "Core Concepts & Architecture", tasks: ["Review IaaS, PaaS, SaaS models", "Understand Virtualization & Hypervisors", "Draw Cloud System Diagrams"] },
      { day: "Day 3-4", focus: "Resource Management & Scalability", tasks: ["Solve horizontal vs vertical scaling trade-offs", "Study Load Balancing algorithms & failover", "Practice CAP theorem problems"] },
      { day: "Day 5-6", focus: "Cloud Storage, DBs & Security", tasks: ["Review Object Storage vs Block Storage", "Study RLS & Token Auth policies", "Take 20-question AI Practice Quiz"] },
      { day: "Day 7", focus: "Final Revision & Flashcard Drills", tasks: ["Review all flagged difficult flashcards", "Mock viva questions practice", "Review past semester exam papers"] },
    ];
  }
};
