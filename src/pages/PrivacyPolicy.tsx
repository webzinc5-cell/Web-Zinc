import { motion } from "motion/react";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export function PrivacyPolicyPage({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const isLight = theme === 'light';

  const sections = [
    {
      title: "Information We Collect",
      icon: Eye,
      content: "We collect basic identifying information such as your name, email address, and business name when you register an account. This information is necessary to provide our architectural web services."
    },
    {
      title: "How We Use Data",
      icon: FileText,
      content: "Your data is used strictly for account management, project tracking within your dashboard, and communication regarding your web infrastructure deployments. We do not sell your data to third parties."
    },
    {
      title: "Data Security",
      icon: Lock,
      content: "WebZinc utilizes Firebase (Google Cloud) for secure data storage and authentication. We implement industry-standard encryption to protect your sensitive information from unauthorized access."
    }
  ];

  return (
    <div className={`min-h-screen pt-12 md:pt-20 pb-12 transition-colors duration-300 ${isLight ? 'bg-[#F8FAFC]' : 'bg-[#000000] text-white'}`}>
      <div className="mx-auto w-full max-w-[92%] md:max-w-4xl px-4">
        
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Shield size={16} className="text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[3px] text-primary">Legal Compliance</span>
          </div>
          <h1 className={`text-2xl md:text-4xl font-black tracking-tight uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>Privacy Policy</h1>
        </div>

        <div className="space-y-8">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.section 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-6 md:p-8 rounded-2xl border transition-all ${
                  isLight 
                    ? 'bg-white border-[#E2E8F0] shadow-sm' 
                    : 'bg-zinc-950/50 border-white/5 shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon size={18} className="text-primary" />
                  <h2 className="text-lg font-black uppercase tracking-tight text-primary">{section.title}</h2>
                </div>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>
                  {section.content}
                </p>
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
