import { Layout, Menu, Avatar, Dropdown, Badge, Space, Switch } from "antd";
import { BellOutlined, UserOutlined, SearchOutlined, BulbOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../shared/contexts/TheameContext"; // Fixed typo in TheameContext
import AiAssistantButton from "../../shared/accessories/AiAssistantButton";
// Import all images directly
import logo from "../../assets/ldna-icon.svg";
import dashboardIcon from "../../assets/dashboardIcon.svg";
import loansIcon from "../../assets/loansIcon.svg";
import documentsIcon from "../../assets/documentsIcon.svg";
import faqIcon from "../../assets/faqIcon.svg";
import contactIcon from "../../assets/contactIcon.svg";

const { Header } = Layout;

// Create an icons object for easier access
const icons = {
  logo,
  dashboard: dashboardIcon,
  loans: loansIcon,
  documents: documentsIcon,
  faq: faqIcon,
  contact: contactIcon,
};

// Custom icon component with error handling
const NavIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img 
    src={src} 
    alt={alt} 
    className="w-5 h-5 flex-shrink-0" 
    onError={(e) => {
      // Fallback if image fails to load
      (e.target as HTMLImageElement).style.display = 'none';
    }}
  />
);

export function TopNavBar() {
  const location = useLocation();
  const { mode, toggleTheme } = useTheme();

  // Navigation items with reduced spacing
  const navItems = [
    { 
      key: "/dashboard", 
      label: (
        <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 mb-[16px]">
          <NavIcon src={icons.dashboard} alt="Dashboard" />
          <span className="text-gray-700 dark:text-gray-200 text-sm font-normal">Dashboard</span>
        </Link>
      ) 
    },
    { 
      key: "/loans", 
      label: (
        <Link to="/loans" className="flex items-center gap-2 px-3 py-2 mb-[16px]">
          <NavIcon src={icons.loans} alt="Loans" />
          <span className="text-gray-700 dark:text-gray-200 text-sm font-normal">Loans</span>
        </Link>
      ) 
    },
    { 
      key: "/documents", 
      label: (
        <Link to="/documents" className="flex items-center gap-2 px-3 py-2 mb-[16px]">
          <NavIcon src={icons.documents} alt="Documents" />
          <span className="text-gray-700 dark:text-gray-200 text-sm font-normal">Documents</span>
        </Link>
      ) 
    },
    { 
      key: "/faq", 
      label: (
        <Link to="/faq" className="flex items-center gap-2 px-3 py-2 mb-[16px]">
          <NavIcon src={icons.faq} alt="FAQ" />
          <span className="text-gray-700 dark:text-gray-200 text-sm font-normal">FAQ</span>
        </Link>
      ) 
    },
    { 
      key: "/contact", 
      label: (
        <Link to="/contact" className="flex items-center gap-2 px-3 py-2 mb-[16px]">
          <NavIcon src={icons.contact} alt="Contact" />
          <span className="text-gray-700 dark:text-gray-200 text-sm font-normal">Contact</span>
        </Link>
      ) 
    }
  ];

  const userMenuItems = [
    { key: "profile", label: "Profile" },
    { key: "logout", label: "Logout", danger: true }
  ];

  return (
    <Header 
      className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm h-16 px-0"
      style={{ 
        boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Left Section - Logo and Navigation */}
      <div className="flex flex-1 items-center min-w-0">
        {/* Logo Section */}
        <div className="flex items-center gap-2 py-4 px-3 border-r border-gray-300 dark:border-gray-600 flex-shrink-0">
          <img 
            src={icons.logo} 
            alt="INCOMECALC Logo" 
            className="w-6 h-6 flex-shrink-0" 
          />
          <span className="font-bold text-base text-gray-900 dark:text-white whitespace-nowrap">
            INCOME<span className="text-blue-500 dark:text-blue-400">CALC</span>
          </span>
        </div>

        {/* Navigation Menu - Always visible, no overflow */}
        {/* <div className="flex-1 flex justify-center"> */}
          <div className="flex items-center h-16 flex-1 min-w-0">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={navItems}
              className="bg-transparent border-0 h-16 flex-1 px-2"
              style={{ 
                border: 'none', 
                background: 'transparent',
                lineHeight: '64px',
                minWidth: 0,
                // marginBottom: "10px",
              }}
              overflowedIndicator={null} // Prevent the 3-dot overflow menu
              disabledOverflow={true} // Disable auto-collapse
            />
          </div>
        </div>

      {/* Center Section - Search */}
      <AiAssistantButton />

      {/* Right Actions Section */}
      <div className="flex items-center gap-2 px-3 border-l border-gray-300 dark:border-gray-600 h-16 flex-shrink-0">
        {/* Theme Toggle */}
        <div className="flex items-center gap-1">
          <Switch 
            checked={mode === "dark"} 
            onChange={toggleTheme}
            size="small"
            checkedChildren="🌙"
            unCheckedChildren="☀️"
            className="bg-gray-300 dark:bg-gray-600"
          />
        </div>

        {/* Notifications with Badge */}
        <div className="p-1 relative flex justify-center items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <BellOutlined className="text-gray-700 dark:text-gray-200 text-base" />
          <div 
            className="absolute left-4 top-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"
          ></div>
        </div>

        {/* User Avatar */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Space className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1 py-1 transition-colors">
            <Avatar 
              size={28}
              icon={<UserOutlined />} 
              className="border border-gray-300 dark:border-gray-600"
            />
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
}