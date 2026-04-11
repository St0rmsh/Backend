import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";

const Layout = () => {
  const [open, setOpen] = useState(false);      // mobile
  const [collapsed, setCollapsed] = useState(false); // desktop

  return (
    <div className="flex h-screen bg-main text-main selection:bg-brand-indigo/30 overflow-hidden">

      <Sidebar
        open={open}
        setOpen={setOpen}
        collapsed={collapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">

        <Topbar
          setSidebarOpen={setOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
