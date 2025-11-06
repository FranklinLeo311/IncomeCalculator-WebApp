import React from "react";
import { Button, Tag, Input } from "antd";
import { LeftOutlined } from "@ant-design/icons";

interface Props {
  ui: any;
  updateUI: (changes: any) => void;
}

export default function LoanDetailHeader({ ui, updateUI }: Props) {
  return (
    <header className="w-full sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left side: back & details */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => updateUI({ showLoanDrawer: false })}
            className="flex items-center space-x-1 text-blue-600 hover:underline"
          >
            <LeftOutlined />
            <span>Back to Loans</span>
          </button>

          <div className="flex items-center space-x-4 text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Loan ID {ui.selectedLoanId ?? "—"}</span>
            <span className="text-gray-500">Alt Loan 6452</span>
            <Tag color="blue">{ui.loanStatus ?? "In Progress"}</Tag>

            <span className="text-xs text-gray-400">
              Last saved:{" "}
              <span className="text-gray-600 dark:text-gray-200">
                {ui.lastSaved ?? "—"}
              </span>
            </span>
          </div>
        </div>

        {/* Right side: search & actions */}
        <div className="flex items-center space-x-3">
          <Input.Search
            placeholder="How can I help you?"
            allowClear
            className="w-64"
          />

          <Button onClick={() => console.log("discard")} className="hidden sm:inline-flex">
            Discard changes
          </Button>
          <Button type="primary" onClick={() => console.log("save")}>
            Save Loan
          </Button>
        </div>
      </div>
    </header>
  );
}
