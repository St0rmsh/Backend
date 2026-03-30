export const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow">
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="p-5">{children}</div>
);

export const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Input = (props) => (
  <input
    className="border px-3 py-2 rounded-lg w-full focus:outline-none"
    {...props}
  />
);
