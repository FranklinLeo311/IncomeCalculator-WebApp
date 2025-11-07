import React from "react";
import { Card } from "antd";

interface Wage {
  borrowerwageid: string;
  employer_name: string;
  DateOfHire: string;
  Totalincome: string;
}

interface SelfEmployed {
  selfemployed_id: string;
  business_name: string;
  employedfrom: string;
  Totalincome: string;
}

interface Borrower {
  id: string;
  name: string;
}

interface Props {
  borrower: Borrower | null;
  wages: Wage[];
  selfemployed: SelfEmployed[];
}

export default function LoanDetailContent({ borrower, wages, selfemployed }: Props) {
  if (!borrower) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300">
        Select a borrower from the sidebar
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Borrower Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Borrower: {borrower.name}
        </h2>
        <span className="text-sm text-gray-500">ID: {borrower.id}</span>
      </div>

      {/* Wage Earner Section */}
      <Card
        title="Wage Earner Details"
        bordered={false}
        className="shadow-sm dark:bg-gray-800 dark:text-gray-100"
      >
        {wages.length > 0 ? (
          <div className="space-y-3">
            {wages.map((wage) => (
              <div
                key={wage.borrowerwageid}
                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {decodeURIComponent(wage.employer_name)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Date of Hire: {wage.DateOfHire}
                  </div>
                </div>
                <div className="font-semibold text-gray-700 dark:text-gray-200">
                  ${wage.Totalincome}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">No wage data available</div>
        )}
      </Card>

      {/* Self Employed Section */}
      <Card
        title="Self-Employed Details"
        bordered={false}
        className="shadow-sm dark:bg-gray-800 dark:text-gray-100"
      >
        {selfemployed.length > 0 ? (
          <div className="space-y-3">
            {selfemployed.map((self) => (
              <div
                key={self.selfemployed_id}
                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {decodeURIComponent(self.business_name)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Employed from: {self.employedfrom}
                  </div>
                </div>
                <div className="font-semibold text-gray-700 dark:text-gray-200">
                  ${self.Totalincome}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">
            No self-employed data available
          </div>
        )}
      </Card>
    </div>
  );
}
