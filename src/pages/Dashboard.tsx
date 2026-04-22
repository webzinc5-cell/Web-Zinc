import { ReactNode, useEffect, useState, FormEvent } from "react";
import { LayoutDashboard, FolderKanban, Settings, LogOut, ArrowLeft, Plus, Mail, User, Briefcase, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { handleFirestoreError } from "../lib/handleFirestoreError";

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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'settings'>('overview');

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email || "");
        unsubscribe = onSnapshot(doc(db, "users", user.uid), (userDoc) => {
          if (userDoc.exists()) {
            const data = userDoc.data();
            const fullName = data.fullName || data.full_name;
            if (fullName) {
              setUserName(fullName);
              setInitials(fullName.substring(0, 2).toUpperCase());
            } else if (data.businessName) {
              setUserName(data.businessName);
              setInitials(data.businessName.substring(0, 2).toUpperCase());
            } else if (user.displayName) {
              setUserName(user.displayName);
              setInitials(user.displayName.substring(0, 2).toUpperCase());
            } else if (user.email) {
              const emailName = user.email.split('@')[0];
              setUserName(emailName);
              setInitials(emailName.substring(0, 2).toUpperCase());
            }
          } else {
            // Fallback if doc doesn't exist yet
            if (user.displayName) {
               setUserName(user.displayName);
               setInitials(user.displayName.substring(0, 2).toUpperCase());
            } else if (user.email) {
               const emailName = user.email.split('@')[0];
               setUserName(emailName);
               setInitials(emailName.substring(0, 2).toUpperCase());
            }
          }
        }, (error) => {
          console.error("Error fetching user data:", error);
        });
      }
    };
    
    fetchUserData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <NavItem icon={<LogOut size={18} />} label="Sign Out" onClick={() => setShowLogoutConfirm(true)} />
        </nav>
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
              {activeTab === 'settings' && <SettingsView userName={userName} userEmail={userEmail} fadeUp={fadeUp} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#050505]/90 backdrop-blur-xl border-t border-[#222] z-50 flex items-center justify-around p-3 pb-6">
        <MobileNavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <MobileNavItem icon={<FolderKanban size={20} />} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
        <MobileNavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        <MobileNavItem icon={<LogOut size={20} />} label="Sign Out" onClick={() => setShowLogoutConfirm(true)} />
      </nav>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex w-full max-w-sm flex-col items-center text-center rounded-2xl border border-primary bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(34,211,238,0.5)]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/30 mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <LogOut className="text-primary" size={28} />
              </div>
              <h3 className="text-[24px] font-extrabold text-white mb-3">Confirm Logout</h3>
              <p className="text-[14px] text-zinc-400 leading-relaxed mb-8">
                Do you really want to logout from your account?
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-black transition-all hover:bg-white shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] uppercase tracking-widest text-[13px]"
                >
                  Confirm Logout
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-transparent px-6 py-4 font-bold text-zinc-400 transition-all hover:bg-zinc-900 hover:text-white uppercase tracking-widest text-[13px]"
                >
                  Back
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

function ProjectCard({ title, category, goal, about, instructions, contactNumber, date }: any) {
  return (
    <div className="flex flex-col rounded-[12px] border border-[#222] bg-[#0a0a0a] p-6 hover:border-primary/30 shadow-none hover:shadow-[0_0_30px_rgba(34,211,238,0.05)] transition-all duration-300">
      <div className="mb-6 border-b border-[#222] pb-6">
        <h3 className="text-[20px] font-[800] tracking-tight text-white">{title}</h3>
        <p className="text-[12px] text-zinc-500 mt-2">Started: {date}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Category</span>
          <span className="text-sm font-medium text-primary">{category || "N/A"}</span>
        </div>
        
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Primary Goal</span>
          <span className="text-sm text-white">{goal || "N/A"}</span>
        </div>
        
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Contact Number</span>
          <span className="text-sm text-white">{contactNumber || "N/A"}</span>
        </div>
        
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Business Description</span>
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{about || "N/A"}</p>
        </div>
        
        {instructions && (
          <div className="pt-2">
             <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Special Instructions</span>
             <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{instructions}</p>
          </div>
        )}
      </div>
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

function SettingsView({ userName, userEmail, fadeUp }: any) {
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState("");
  const [bName, setBName] = useState(userName);
  const [about, setAbout] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const unsubscribe = onSnapshot(doc(db, "users", user.uid), (userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data();
          const pName = data.fullName || data.full_name;
          if (pName) setName(pName);
          if (data.phoneNumber) {
             // ensure phone starts with +91
             setPhone(data.phoneNumber.startsWith("+91") ? data.phoneNumber : `+91 ${data.phoneNumber}`);
          }
          if (data.businessName) setBName(data.businessName);
          if (data.aboutBusiness) setAbout(data.aboutBusiness);
        }
      }, (error) => {
        console.error("Error fetching user config:", error);
        setErrorMsg("Welcome! Fill out your profile below.");
      });

      return () => unsubscribe();
    }
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    
    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await setDoc(doc(db, "users", user.uid), {
        fullName: name,
        phoneNumber: phone,
        businessName: bName,
        aboutBusiness: about
      }, { merge: true });
      
      setSuccessMsg("Profile Updated Successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrorMsg("Unable to save profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div variants={fadeUp} className="pb-12 w-full max-w-5xl">
      <div className="mb-10">
        <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-[-1px] leading-tight flex flex-wrap max-w-full">Account Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">Safely update your business details and security credentials.</p>
      </div>
      
      <form onSubmit={handleSave} className="space-y-8">
        {successMsg && (
          <div className="mb-6 rounded-md bg-primary/20 p-4 border border-primary/50 text-primary text-center font-bold tracking-wide">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 rounded-md bg-red-900/20 p-4 border border-red-500/50 text-red-500 text-center font-bold tracking-wide">
            {errorMsg}
          </div>
        )}

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
                <input 
                  type="tel" 
                  value={phone ? (phone.startsWith("+91 ") ? phone : `+91 `) : "+91 "} 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.startsWith("+91 ")) {
                      const digits = val.substring(4).replace(/\D/g, '').substring(0, 10);
                      setPhone(`+91 ${digits}`);
                    } else if (val === "+91") {
                      setPhone("+91 ");
                    }
                  }} 
                  className="w-full rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                  placeholder="+91 0000000000" 
                />
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
        <ProjectCard 
          key={p.id} 
          title={p.title || p.name || "Untitled Project"} 
          category={p.category} 
          goal={p.goal} 
          about={p.about} 
          instructions={p.instructions} 
          contactNumber={p.contactNumber} 
          date={p.date || "Just started"} 
        />
      ))}
    </div>
  )
}
