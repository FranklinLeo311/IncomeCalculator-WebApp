import { Layout, Menu, Input, Avatar, Dropdown, Badge, Switch } from "antd";
import { BellOutlined, UserOutlined, DownOutlined, BulbOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../shared/contexts/TheameContext";

const { Header } = Layout;

export function TopNavBar() {
  const location = useLocation();
  const { mode, toggleTheme } = useTheme();

  const menuItems = [
    { key: "/dashboard", label: <Link to="/dashboard">Dashboard</Link> },
    { key: "/loans", label: <Link to="/loans">Loans</Link> },
    { key: "/documents", label: <Link to="/documents">Documents</Link> },
    { key: "/faq", label: <Link to="/faq">FAQ</Link> },
    { key: "/contact", label: <Link to="/contact">Contact</Link> }
  ];

  const userMenu = {
    items: [
      { key: "profile", label: "Profile" },
      { key: "logout", label: "Logout" }
    ]
  };

  return (
    <Header className="flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 h-16">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="logo" className="h-7" />

        <span className="font-semibold text-lg tracking-wide text-gray-900 dark:text-white">
          INCOMECALC
        </span>
      </div>

      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="flex-1 ml-6 bg-transparent dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-0"
      />

      <div className="flex items-center gap-4">
        <Input.Search
          placeholder="How can I help you?"
          className="w-64"
          allowClear
        />

        <div className="flex items-center gap-2">
          <SunOutlined className="text-yellow-500" />
          <Switch 
            checked={mode === "dark"} 
            onChange={toggleTheme}
            checkedChildren=" " 
            unCheckedChildren=" "
          />
          <MoonOutlined className="text-blue-400" />
        </div>

        <Badge count={3}>
          <BellOutlined className="text-xl text-gray-700 dark:text-gray-200 cursor-pointer" />
        </Badge>

        <Avatar size={32} icon={<UserOutlined />} className="cursor-pointer" />
      </div>
    </Header>
  );
}