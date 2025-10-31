import { FC } from "react";
import { InlineNotification, ToastNotification } from "@carbon/react";

type NotificationType = "toast" | "inline";

interface Notification {
  type?: NotificationType;
  kind?: "error" | "info" | "success" | "warning";
  title: string;
  subtitle?: string;
  caption?: string;
  timeout?: number;
  onClose?: () => void;
}

const Notification: FC<Notification> = ({
  type = "toast",
  kind = "info",
  title,
  subtitle,
  caption,
  timeout = 0,
  onClose,
}) => {
  if (type === "toast") {
    return (
      <ToastNotification
        kind={kind}
        title={title}
        subtitle={subtitle}
        caption={caption}
        timeout={timeout}
        onCloseButtonClick={onClose}
      />
    );
  }

  return (
    <InlineNotification
      kind={kind}
      title={title}
      subtitle={subtitle}
      onCloseButtonClick={onClose}
    />
  );
};

export default Notification;
