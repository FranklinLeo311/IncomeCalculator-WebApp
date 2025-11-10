import React from "react";
import borrowerIcon from "../../../assets/borrowerIcon.svg";
import bankIcon from "../../../assets/bankIcon.svg";
import realEstateIcon from "../../../assets/realEstateIcon.svg";
// import { PlusOutlined } from '@ant-design/icons';
import { PlusButton } from "../../../shared/accessories/PlusButton";
import { UpArrowButton } from "../../../shared/accessories/UpArrowButton";

// Types (you might want to move these to a shared types file)
type IncomeType = "Wage Earner" | "Self Employed";

interface WageEarner {
  employerName: string;
  borrowerId: string;
  borrowerWageid: string;
  totalIncome: string;
}

interface SelfEmployed {
  business_name: string;
  borrowerId: string;
  selfemployedId: string;
}

interface BankStatement {
  incomeSource: string;
  borrowerId: string;
  borrowertypeId: string;
  totalIncome: string;
  bankName: string;
}

interface RealEstate {
  reoID: string;
  borrowerId: string;
  borrowertypeId: string;
  totalIncome: string;
  borrowerName: string;
  Property_Address: string;
  Adjusted_Monthly_Rental_Income: number;
  Net_Rental_Value: number;
}

interface BorrowerDetails {
  [borrowerName: string]: {
    "Wage Earner": WageEarner[];
    "Self Employed": SelfEmployed[];
  };
}

interface LoanData {
  borrowerDetails: BorrowerDetails;
  "Bank Statement": BankStatement[];
  "Real Estate": RealEstate[];
}

interface LoanDetailSideBarProps {
  loanData: LoanData;
  selectedBorrower: string | null;
  onBorrowerSelect?: (borrowerName: string) => void;
  onAddNew?: () => void;
}

export default function LoanDetailSideBar({ 
  loanData, 
  selectedBorrower, 
  onBorrowerSelect, 
  onAddNew 
}: LoanDetailSideBarProps) {
  const [expandedSections, setExpandedSections] = React.useState({
    borrowers: true,
    bankStatement: true,
    realEstate: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBorrowerSelect = (borrowerName: string) => {
    onBorrowerSelect?.(borrowerName);
  };

  return (
    <div className="w-80 overflow-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Borrowers Section */}
      <div className=" rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Section Header */}
        <div 
          className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
          onClick={() => toggleSection('borrowers')}
        >
          <div className="flex items-center gap-2">
            {/* <div className="w-6 h-6 bg-[#1C2431] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 border border-[#EAEBEC] rounded-sm"></div>
            </div> */}
            <img src={borrowerIcon} alt="borrower icon" className="w-6 h-6 rounded-xl bg-[#1C2431]" />
            <span className="text-gray-600 dark:text-gray-300 font-jura text-base font-normal">
              Borrowers
            </span>
          </div>
          <div className="w-5 h-5">
            <div className={`transform transition-transform ${expandedSections.borrowers ? 'rotate-180' : ''}`}>
              <UpArrowButton />
            </div>
          </div>
        </div>

        {/* Section Content */}
        {expandedSections.borrowers && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4">
            {Object.entries(loanData.borrowerDetails).map(([borrowerName, details]) => (
              <div key={borrowerName} className="mb-3 last:mb-0">
                {/* Borrower Header */}
                <div 
                  className={`p-2 rounded cursor-pointer ${
                    selectedBorrower === borrowerName 
                      ? 'bg-[#9AD4EF] border-b border-gray-300 dark:border-gray-600' 
                      : 'border-b border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => handleBorrowerSelect(borrowerName)}
                >
                  <div className="text-gray-900 dark:text-gray-100 font-creato text-base font-normal">
                    {borrowerName}
                  </div>
                </div>

                {/* Income Sources */}
                <div className="pl-3 mt-2">
                  {/* Wage Earner */}
                  {details["Wage Earner"].length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 font-creato uppercase tracking-wider mb-1">
                        Wage Earner
                      </div>
                      {details["Wage Earner"].map((wage, index) => (
                        <div key={index} className="px-1 py-0.5 mb-1">
                          <div className="text-gray-900 dark:text-gray-100 font-creato text-sm">
                            {wage.employerName}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Self Employed */}
                  {details["Self Employed"].length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 font-creato uppercase tracking-wider mb-1">
                        Self Employed
                      </div>
                      {details["Self Employed"].map((selfEmp, index) => (
                        <div key={index} className="px-1 py-0.5">
                          <div className="text-gray-900 dark:text-gray-100 font-creato text-sm">
                            {selfEmp.business_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Income Source Button */}
                  <div className="mt-2">
                    <button 
                      className="flex items-center gap-2 p-1 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={onAddNew}
                    >
                      <PlusButton />
                      {/* <div className="w-4 h-4 border-2 border-blue-500 rounded-sm"></div> */}
                      <span className="font-creato text-xs">Add income source</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bank Statement Section */}
      <div className=" rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div 
          className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
          onClick={() => toggleSection('bankStatement')}
        >
          <div className="flex items-center gap-2">
            <img src={bankIcon} alt="bank icon" className="w-6 h-6 rounded-md bg-[#1C2431]" />
            <span className="text-gray-600 dark:text-gray-300 font-jura text-base font-normal">
              Bank Statement
            </span>
          </div>
          <div className="w-5 h-5">
            <div className={`transform transition-transform ${expandedSections.bankStatement ? 'rotate-180' : ''}`}>
              <UpArrowButton />
            </div>
          </div>
        </div>

        {expandedSections.bankStatement && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4">
            <div className="mb-4">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-creato uppercase tracking-wider mb-2">
                Income Source
              </div>
              {loanData["Bank Statement"].map((bank, index) => (
                <div key={index} className="px-1 py-0.5 mb-1">
                  <div className="text-gray-900 dark:text-gray-100 font-creato text-sm">
                    {bank.incomeSource}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <div className="px-1 py-0.5">
                <div className="text-gray-900 dark:text-gray-100 font-creato text-sm">
                  All Bank Accounts
                </div>
              </div>
            </div>

            <div className="mt-2">
              <button 
                className="flex items-center gap-2 p-1 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={onAddNew}
              >
                <PlusButton />
                <span className="font-creato text-xs">Add bank account</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Real Estate Section */}
      <div className=" rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div 
          className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
          onClick={() => toggleSection('realEstate')}
        >
          <div className="flex items-center gap-2">
            <img src={realEstateIcon} alt="real estate icon" className="w-6 h-6 rounded-md bg-[#1C2431]" />
            <span className="text-gray-600 dark:text-gray-300 font-jura text-base font-normal">
              Real Estate
            </span>
          </div>
          <div className="w-5 h-5">
            <div className={`transform transition-transform ${expandedSections.realEstate ? 'rotate-180' : ''}`}>
              <UpArrowButton />
            </div>
          </div>
        </div>

        {expandedSections.realEstate && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4">
            <div className="mb-4">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-creato uppercase tracking-wider mb-2">
                Properties
              </div>
              {loanData["Real Estate"].map((property, index) => (
                <div key={index} className="px-1 py-0.5 mb-1">
                  <div className="text-gray-900 dark:text-gray-100 font-creato text-sm">
                    {property.Property_Address}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <button 
                className="flex items-center gap-2 p-1 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={onAddNew}
              >
                <PlusButton />
                <span className="font-creato text-xs">Add property</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Button */}
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div 
          className="flex items-center justify-between bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer"
          onClick={onAddNew}
        >
          <div className="flex items-center gap-2 p-2 flex-1">
            <PlusButton />
            <span className="text-gray-900 dark:text-gray-100 font-creato text-sm">
              Add new
            </span>
          </div>
          <div className="w-10 h-10 border-l border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <div className="w-5 h-5">▼</div>
          </div>
        </div>
      </div>
    </div>
  );
}