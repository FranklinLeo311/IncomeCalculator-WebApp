import { SearchOutlined } from "@ant-design/icons";

const AiAssistantButton = () => {
  return (
    <div 
        className="h-9 px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full border border-blue-500 dark:border-blue-400 flex items-center gap-2 mx-2 flex-shrink-0"
        style={{
          boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.10) inset',
        }}
      >
        <SearchOutlined className="text-blue-500 dark:text-blue-400 text-base" />
        <span className="text-gray-700 dark:text-gray-200 text-xs font-medium whitespace-nowrap">
          How can I help you?
        </span>
      </div>
  )
};

export default AiAssistantButton;