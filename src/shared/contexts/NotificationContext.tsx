import { createContext, useContext, useState, ReactNode } from "react";

type Notification = {
  from: string;
  message: string;
};

type NotificationContextType = {
  notification: Notification;
  setNotification: (notification: Notification) => void;
  clearNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification>({
    from: "",
    message: "",
  });

  const clearNotification = () => setNotification({ from: "", message: "" });

  return (
    <NotificationContext.Provider
      value={{ notification, setNotification, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
