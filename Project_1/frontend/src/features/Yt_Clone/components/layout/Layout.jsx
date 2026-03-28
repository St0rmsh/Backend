import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";

const Layout = () => {
  const [open, setOpen] = useState(false);      // mobile
  const [collapsed, setCollapsed] = useState(false); // desktop

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 text-black dark:text-white">

      <Sidebar
        open={open}
        setOpen={setOpen}
        collapsed={collapsed}
      />

      <div className="flex-1 flex flex-col">

        <Topbar
          setSidebarOpen={setOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
