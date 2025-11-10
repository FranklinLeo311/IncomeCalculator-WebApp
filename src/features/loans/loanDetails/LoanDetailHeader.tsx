import React from "react";
import { Button, Tag, Input } from "antd";
import { LeftOutlined, MoreOutlined, CloseOutlined } from "@ant-design/icons";
import AiAssistantButton from "../../../shared/accessories/AiAssistantButton";

interface Props {
  ui: any;
  updateUI: (changes: any) => void;
}

export default function LoanDetailHeader({ ui, updateUI }: Props) {
  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* First Row */}
      <div className="flex items-center justify-between px-4 py-1 border-b border-gray-300 dark:border-gray-600">
        {/* Left Section - Back Button */}
        <button
          onClick={() => updateUI({ showLoanDrawer: false })}
          className="flex items-center gap-2 h-8 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <LeftOutlined className="text-blue-500 text-base" />
          <span className="text-gray-700 dark:text-gray-200 text-sm font-normal">
            Back to Loans
          </span>
        </button>

        {/* Center Section - Loan Details */}
        <div className="flex-1 flex items-center gap-6 px-4 border-l border-gray-300 dark:border-gray-600 ml-4">
          <span className="text-gray-700 dark:text-gray-200 text-base font-normal">
            Loan ID {ui.selectedLoanId ?? "123456"}
          </span>
          <span className="text-gray-700 dark:text-gray-200 text-base font-normal">
            Alt Loan 6452
          </span>
          <Tag 
            className="border border-teal-400 text-gray-700 text-sm font-normal pt-1 pb-6 py-1 h-6 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            In Progress
          </Tag>
        </div>

        {/* Right Section - Last Saved & More Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
              Last saved:
            </span>
            <span className="text-blue-700 dark:text-blue-400 text-xs font-normal">
              July 23, 2025 1:00 pm EST
            </span>
          </div>
          
          <button 
          onClick={() => updateUI({ showLoanDrawer: false })}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {/* <MoreOutlined className="text-gray-700 dark:text-gray-200 text-lg" /> */}
            <CloseOutlined className="text-gray-700 dark:text-gray-200 text-lg"/>
          </button>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex mb-3 items-center justify-between px-4 py-2 border-b border-gray-300 dark:border-gray-600">
        {/* Left Section - Navigation Tabs */}
        <div className="flex items-center h-10 overflow-hidden rounded-lg border border-gray-400 dark:border-gray-500">
          <button className="h-full px-4 bg-white dark:bg-gray-800 border-r border-gray-400 dark:border-gray-500 text-gray-500 dark:text-gray-400 text-sm font-normal hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Loan Summary
          </button>
          <button className="h-full px-4 bg-blue-100 dark:bg-blue-900 border-r border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-200 text-sm font-normal">
            Details
          </button>
          <button className="h-full px-4 bg-white dark:bg-gray-800 border-r border-gray-400 dark:border-gray-500 text-gray-500 dark:text-gray-400 text-sm font-normal hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            Documents
            <span className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-medium px-1 rounded-full min-w-6 h-5 flex items-center justify-center">
              12
            </span>
          </button>
          <button className="h-full px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm font-normal hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            History
          </button>
        </div>

        {/* Center Section - Search */}
        <AiAssistantButton />

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            className="h-10 px-4 border border-blue-500 dark:border-blue-400 text-gray-700 dark:text-gray-200 text-base font-normal rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            style={{
              outline: '1px #24A1DD solid',
              outlineOffset: '-1px'
            }}
          >
            Discard changes
          </Button>
          <Button 
            type="primary"
            className="h-10 px-4 bg-blue-500 dark:bg-blue-600 border-blue-500 dark:border-blue-600 text-white text-base font-normal rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Save Loan
          </Button>
        </div>
      </div>
    </div>
  );
}