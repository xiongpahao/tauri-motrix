import { ReactNode } from "react";
import { createRoot } from "react-dom/client";

interface InnerProps {
  type: string;
  duration?: number;
  message: ReactNode;
  isDark?: boolean;
  onClose: () => void;
}

const NoticeInner = (props: InnerProps) => {
  return <></>;
};

interface NoticeInstance {
  (props: Omit<InnerProps, "onClose">): void;

  info(message: ReactNode, duration?: number, isDark?: boolean): void;
  error(message: ReactNode, duration?: number, isDark?: boolean): void;
  success(message: ReactNode, duration?: number, isDark?: boolean): void;
}

let parent: HTMLDivElement = null!;

// code from clash verge
export const Notice: NoticeInstance = (props) => {
  const { type, message, duration } = props;

  if (!message) {
    return;
  }

  if (!parent) {
    parent = document.createElement("div");
    parent.setAttribute("id", "notice-container");
    document.body.appendChild(parent);
  }

  const container = document.createElement("div");
  parent.appendChild(container);

  const root = createRoot(container);

  const onUnmount = () => {
    root.unmount();
    if (parent && container.parentNode === parent) {
      setTimeout(() => {
        parent.removeChild(container);
      }, 500);
    }
  };

  root.render(
    <NoticeInner
      type={type}
      message={message}
      duration={duration || 1500}
      onClose={onUnmount}
    />,
  );
};

const createNoticeTypeFactory =
  (type: keyof NoticeInstance) => (message: ReactNode, duration?: number) => {
    if (!message) {
      return;
    }

    Notice({
      type,
      message,
      duration: type === "error" ? 8000 : duration || 1500,
    });
  };

Notice.info = createNoticeTypeFactory("info");
Notice.error = createNoticeTypeFactory("error");
Notice.success = createNoticeTypeFactory("success");
