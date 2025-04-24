
import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Home,
  FileUp,
  Settings,
  Menu,
  X,
  Database,
  LineChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive?: boolean;
};

const NavItem = ({ icon: Icon, label, path, isActive }: NavItemProps) => {
  return (
    <Link to={path} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 p-2 font-normal",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-finance-secondary hover:text-finance-primary hover:bg-gray-100"
        )}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

interface AppLayoutProps {
  children: ReactNode;
  activePath?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activePath = "/",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-4 bg-white border-b border-gray-200">
        <Button
          variant="outline"
          size="icon"
          className="ml-auto"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:sticky top-0 z-30 h-screen w-64 bg-white border-r border-gray-200 shadow-sm transition-all transform md:transform-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Close Button (Mobile) */}
          <div className="md:hidden flex justify-end mb-6">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X size={20} />
            </Button>
          </div>

          {/* Logo/Brand */}
          <div className="flex items-center gap-2 px-2 py-4">
            <div className="bg-finance-accent rounded-md p-1">
              <BarChart size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-finance-primary">
              FinancialSage
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2 mt-8">
            <NavItem
              icon={Home}
              label="Dashboard"
              path="/"
              isActive={activePath === "/"}
            />
            <NavItem
              icon={FileUp}
              label="Upload"
              path="/upload"
              isActive={activePath === "/upload"}
            />
            <NavItem
              icon={Database}
              label="Data"
              path="/data"
              isActive={activePath === "/data"}
            />
            <NavItem
              icon={LineChart}
              label="Analytics"
              path="/analytics"
              isActive={activePath === "/analytics"}
            />
            <NavItem
              icon={Settings}
              label="Settings"
              path="/settings"
              isActive={activePath === "/settings"}
            />
          </div>

          <div className="mt-auto">
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-gray-50 text-sm">
              <p className="font-medium">Data insights available</p>
              <p className="text-gray-500">Upload financial data to begin analysis</p>
              <Link to="/upload">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <FileUp size={14} className="mr-2" />
                  Upload Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        {children}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AppLayout;
