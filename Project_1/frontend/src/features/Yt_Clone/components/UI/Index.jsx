import { motion } from "framer-motion";

export const Card = ({ children, className = "" }) => (
  <div className={`glass rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 md:p-8 ${className}`}>{children}</div>
);

export const Button = ({ children, className = "", variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-main text-black dark:text-white dark:bg-white hover:bg-gray-200 dark:hover:bg-gray-100",
    brand: "bg-brand-indigo text-white shadow-lg shadow-brand-indigo/20 hover:scale-105 active:scale-95",
    ghost: "bg-transparent border border-main text-main hover:bg-white/5",
    danger: "bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20 hover:bg-brand-crimson/20"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`px-6 py-2.5 rounded-2xl font-bold text-sm tracking-tight transition-all duration-300 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Input = ({ label, icon: Icon, className = "", ...props }) => (
  <div className="space-y-2 w-full">
    {label && (
      <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">
        {label}
      </label>
    )}
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-indigo transition-colors">
          <Icon size={18} />
        </div>
      )}
      <input
        className={`w-full ${Icon ? 'pl-12' : 'px-5'} pr-5 py-3 rounded-2xl bg-surface-low border border-main text-main placeholder:text-muted/50 focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo/50 outline-none transition-all duration-300 ${className}`}
        {...props}
      />
    </div>
  </div>
);
