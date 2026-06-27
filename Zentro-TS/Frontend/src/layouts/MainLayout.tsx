import { Outlet } from "react-router-dom";

/**
 * Main Layout Component
 * Layout for main application pages (feed, explore, posts, profile, etc.)
 * Includes header, sidebar, and main content area
 * TODO: Implement header and sidebar components
 */
export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* TODO: Add Sidebar Component */}
      {/* <Sidebar /> */}

      <div className="flex-1 flex flex-col">
        {/* TODO: Add Header Component */}
        {/* <Header /> */}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* TODO: Add Right Sidebar for recommendations, trending, etc. */}
    </div>
  );
};
