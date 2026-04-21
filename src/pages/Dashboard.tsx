import { ReactNode, useEffect, useState, FormEvent } from "react";
import { LayoutDashboard, FolderKanban, CreditCard, Settings, LogOut, ArrowUpRight, ArrowLeft, Plus, Mail, FileText, Download, User, Briefcase, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import { auth, db, rtdb } from "../lib/firebase";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function Dashboard({ userProjects = [], setUserProjects }: any) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [initials, setInitials] = useState("US");
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'payments' | 'settings'>('overview');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email || "");
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.businessName) {
              setUserName(data.businessName);
              setInitials(data.businessName.substring(0, 2).toUpperCase());
            }
          } else if (user.displayName) {
             setUserName(user.displayName);
             setInitials(user.displayName.substring(0, 2).toUpperCase());
          } else if (user.email) {
             const emailName = user.email.split('@')[0];
             setUserName(emailName);
             setInitials(emailName.substring(0, 2).toUpperCase());
          }

        } catch (error) {
          // Graceful fallback to Firebase Auth data
          if (user.displayName) {
             setUserName(user.displayName);
             setInitials(user.displayName.substring(0, 2).toUpperCase());
          } else if (user.email) {
             const emailName = user.email.split('@')[0];
             setUserName(emailName);
             setInitials(emailName.substring(0, 2).toUpperCase());
          }
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      if (setUserProjects) setUserProjects([]);
      await signOut(auth);
      navigate("/");
    } catch (error) {
      alert("Failed to sign out safely. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#000000] text-white">
      {/* Desktop Side Nav */}
      <aside className="w-64 border-r border-[#222] bg-[#050505] p-6 hidden md:flex flex-col fixed h-screen z-20">
        <div className="mb-10 px-2 text-[10px] font-bold uppercase tracking-[2px] text-zinc-500">
          User Controls
        </div>
        <nav className="flex flex-1 flex-col gap-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon={<FolderKanban size={18} />} label="My Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
          <NavItem icon={<CreditCard size={18} />} label="Past Payments" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>
        <div className="mt-auto pt-6 border-t border-[#222] flex flex-col gap-2">
          <a href="mailto:support@webzinc.com" className="flex items-center w-full gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-300 text-zinc-400 hover:bg-zinc-900 border border-transparent hover:text-white">
            <Mail size={18} /> Contact Support
          </a>
          <NavItem icon={<LogOut size={18} />} label="Sign Out" onClick={handleLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 md:ml-64 pb-24 md:pb-12 min-h-screen">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mx-auto max-w-5xl"
        >
          {/* Back Button */}
          <motion.button 
            variants={fadeUp}
            onClick={() => window.location.href = "/"}
            className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[13px] font-bold tracking-widest uppercase cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Home
          </motion.button>

          {/* Dynamic Views Rendering based on Navigation State */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.1 } },
                exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
              }}
              className="w-full"
            >
              {activeTab === 'overview' && <OverviewView userName={userName} initials={initials} projects={userProjects} fadeUp={fadeUp} />}
              {activeTab === 'projects' && <ProjectsView projects={userProjects} fadeUp={fadeUp} />}
              {activeTab === 'payments' && <PaymentsView fadeUp={fadeUp} />}
              {activeTab === 'settings' && <SettingsView userName={userName} userEmail={userEmail} fadeUp={fadeUp} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#050505]/90 backdrop-blur-xl border-t border-[#222] z-50 flex items-center justify-around p-3 pb-6">
        <MobileNavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <MobileNavItem icon={<FolderKanban size={20} />} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
        <MobileNavItem icon={<CreditCard size={20} />} label="Payments" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
        <MobileNavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
          : "text-zinc-400 hover:bg-zinc-900 border border-transparent hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MobileNavItem({ icon, label, active, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`relative flex flex-col items-center gap-1 p-2 transition-colors duration-300 ${active ? "text-primary" : "text-zinc-500 hover:text-white"}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
      {active && <div className="absolute -top-3 w-8 h-[2px] bg-primary shadow-[0_0_10px_rgba(34,211,238,1)] rounded-b-full drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />}
    </button>
  );
}

function StatWidget({ title, value, primary }: { title: string; value: string; primary?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[12px] border border-[#222] bg-[#0a0a0a] p-6 group hover:border-[#333] transition-colors">
      <h3 className="text-[11px] font-bold uppercase tracking-[2px] text-zinc-500 mb-2">{title}</h3>
      <div className={`text-[28px] font-[800] tracking-[-1px] ${primary ? "text-primary drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "text-white"}`}>
        {value}
      </div>
      {primary && (
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/10 rounded-full blur-[30px]" />
      )}
    </div>
  );
}

function ProjectCard({ id, title, progress, date, status, category }: any) {
  const [liveProgress, setLiveProgress] = useState(progress);

  useEffect(() => {
    if (!id) return;
    const progressRef = ref(rtdb, `projects/${id}/progress`);
    
    // Set up real-time listener
    const unsubscribe = onValue(progressRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        // Ensure the value is a valid number, or fallback to the current liveProgress
        if (typeof val === 'number') {
          setLiveProgress(val);
        }
      }
    }, () => {
      // RTDB fallback to static data
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [id, progress]);

  return (
    <div className="flex flex-col rounded-[12px] border border-[#222] bg-[#0a0a0a] p-6 hover:border-primary/30 shadow-none hover:shadow-[0_0_30px_rgba(34,211,238,0.05)] transition-all duration-300">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="text-[16px] font-[700] tracking-tight">{title}</h3>
            {category && <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{category}</p>}
          </div>
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-medium border ${status === 'Pending Review' ? 'text-primary bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'}`}>
            {status === 'Pending Review' && (
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            )}
            {status || "Pending Review"}
          </span>
        </div>
        <p className="text-[12px] text-zinc-500 mt-2">{date}</p>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-zinc-500">Progress</span>
          <motion.span 
            className="text-[12px] font-[800] text-primary"
          >
            {liveProgress}%
          </motion.span>
        </div>
        <div className="h-[4px] w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: `${progress}%` }}
            animate={{ width: `${liveProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-primary shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
          />
        </div>
      </div>

      <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-[6px] border border-primary/40 bg-transparent py-[10px] text-[13px] font-bold tracking-[0.5px] text-primary transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
        Preview Site <ArrowUpRight size={16} />
      </button>
    </div>
  );
}

// ---- SUB-VIEWS (TABS) ----

function OverviewView({ userName, initials, projects, fadeUp }: any) {
  return (
    <div className="w-full">
      <motion.div variants={fadeUp} className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-[-1px] leading-tight flex flex-wrap max-w-full">
            Welcome back, {userName}!
          </h1>
          <p className="mt-1 text-sm text-zinc-400">Here's your structural overview today.</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(34,211,238,0.3)] text-primary font-bold overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-shadow whitespace-nowrap shrink-0 ml-4">
          {initials}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 mb-12">
        <StatWidget title="Total Websites" value={projects?.length?.toString() || "0"} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Active Projects</h2>
        </div>
        
        {(!projects || projects.length === 0) ? (
           <div className="flex flex-col items-center justify-center p-12 md:p-20 border-2 border-dashed border-zinc-800/80 rounded-2xl bg-[#050505] text-center w-full">
             <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-5 text-zinc-400 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
               <Plus size={28} className="text-primary drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
             </div>
             <h3 className="text-white font-bold tracking-tight text-xl mb-2">Start Your First Project</h3>
             <p className="text-zinc-500 text-sm mb-8 max-w-sm">You don't have any active web builds in your pipeline. Let's fix that.</p>
             <button onClick={() => window.location.href = '/start'} className="bg-white text-black px-8 py-3 rounded hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)] font-bold uppercase text-[11px] tracking-widest cursor-pointer">
               Launch Project
             </button>
           </div>
        ) : (
           <ProjectList projects={projects} />
        )}
      </motion.div>
    </div>
  );
}

function ProjectsView({ projects, fadeUp }: any) {
  return (
    <motion.div variants={fadeUp} className="pb-12 w-full">
      <div className="mb-8">
        <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-[-1px] leading-tight flex flex-wrap max-w-full">My Projects</h1>
        <p className="mt-1 text-sm text-zinc-400">Manage and track your active web builds directly.</p>
      </div>
      
      {(!projects || projects.length === 0) ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl text-center w-full">
          <FolderKanban size={48} className="text-primary mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
          <h2 className="text-2xl font-bold text-white mb-2">No Active Projects</h2>
          <p className="text-zinc-400 text-sm mb-8 max-w-md">You currently have no ongoing builds. Launch a new web project to view its real-time progress here.</p>
          <button onClick={() => window.location.href = '/start'} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-bold text-black transition-all hover:bg-primary/90 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] hover:scale-[1.02]">
            <Plus size={18} /> Launch New Build
          </button>
        </div>
      ) : (
        <ProjectList projects={projects} />
      )}
    </motion.div>
  );
}

function PaymentsView({ fadeUp }: any) {
  const pastPayments: any[] = [];

  return (
    <motion.div variants={fadeUp} className="pb-12 space-y-8 w-full">
      <div className="mb-8">
        <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-[-1px] leading-tight flex flex-wrap max-w-full">Past Payments</h1>
        <p className="mt-1 text-sm text-zinc-400">Review your billing history and download past invoices.</p>
      </div>
      
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0a0a0a]/60 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-zinc-500 bg-black/40">
            <tr>
              <th className="px-6 py-5">Date</th>
              <th className="px-6 py-5">Service</th>
              <th className="px-6 py-5">Amount</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {pastPayments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center">
                    <FileText size={32} className="text-zinc-600 mb-4" />
                    <p>No past payments found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              pastPayments.map(payment => (
                <tr key={payment.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap">{payment.date}</td>
                  <td className="px-6 py-5 font-medium text-white">{payment.service}</td>
                  <td className="px-6 py-5 font-mono">{payment.amount}</td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function SettingsView({ userName, userEmail, fadeUp }: any) {
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState("");
  const [bName, setBName] = useState(userName);
  const [about, setAbout] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); }, 1000);
  }

  return (
    <motion.div variants={fadeUp} className="pb-12 w-full max-w-5xl">
      <div className="mb-10">
        <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-[-1px] leading-tight flex flex-wrap max-w-full">Account Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">Safely update your business details and security credentials.</p>
      </div>
      
      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Account */}
          <div className="space-y-6 bg-[#0a0a0a]/50 border border-zinc-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md">
            <h3 className="text-xs font-bold text-primary tracking-widest uppercase flex items-center gap-2 mb-2">
              <User size={16} /> Personal Information
            </h3>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]" placeholder="John Doe" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          </div>

          {/* Column 2: Business */}
          <div className="space-y-6 bg-[#0a0a0a]/50 border border-zinc-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md">
            <h3 className="text-xs font-bold text-primary tracking-widest uppercase flex items-center gap-2 mb-2">
              <Briefcase size={16} /> Business Details
            </h3>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Business Name</label>
                <input type="text" value={bName} onChange={e => setBName(e.target.value)} className="w-full rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">About Business</label>
                <textarea rows={4} value={about} onChange={e => setAbout(e.target.value)} className="w-full rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] resize-none" placeholder="Briefly describe your services..."></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row / Security */}
        <div className="bg-[#0a0a0a]/50 border border-zinc-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md">
           <h3 className="text-xs font-bold text-primary tracking-widest uppercase flex items-center gap-2 mb-6">
             <Shield size={16} /> Security & Authentication
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Email Address (Read-Only)</label>
               <input type="email" value={userEmail} disabled className="w-full rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-4 text-zinc-500 cursor-not-allowed" />
             </div>
             <div>
               <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Update Password</label>
               <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]" />
             </div>
           </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isLoading} className="w-full md:w-auto md:min-w-[240px] ml-auto flex items-center justify-center rounded-xl bg-primary px-8 py-4 font-bold text-black transition-all hover:bg-white disabled:opacity-50 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:scale-[1.02] uppercase tracking-widest text-sm">
            {isLoading ? "Updating..." : "Save Profile"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function ProjectList({ projects }: { projects: any[] }) {
  if (!projects || projects.length === 0) {
    return (
       <div className="flex flex-col items-center justify-center p-12 md:p-20 border-2 border-dashed border-zinc-800/80 rounded-2xl bg-[#050505] text-center w-full">
         <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-5 text-zinc-400 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
           <Plus size={28} className="text-primary drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
         </div>
         <h3 className="text-white font-bold tracking-tight text-xl mb-2">Start Your First Project</h3>
         <p className="text-zinc-500 text-sm mb-8 max-w-sm">You don't have any active web builds in your pipeline. Let's fix that.</p>
         <button onClick={() => window.location.href = '/start'} className="bg-white text-black px-8 py-3 rounded hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)] font-bold uppercase text-[11px] tracking-widest cursor-pointer">
           Launch Project
         </button>
       </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {projects.map((p) => (
        <ProjectCard key={p.id} id={p.id} title={p.title || "Untitled Project"} progress={p.progress || 0} date={p.date || "Just started"} status={p.status} category={p.category} />
      ))}
    </div>
  )
}
