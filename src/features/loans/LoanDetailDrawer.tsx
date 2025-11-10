import { AnimatePresence, motion } from "framer-motion";
import { lazy } from "react";
const LoanDetailHeader = lazy(() => import("./loanDetails/LoanDetailHeader"));
const LoanDetailSideBar = lazy(() => import("./loanDetails/LoanDetailSideBar"));
const LoanDetailContent = lazy(() => import("./loanDetails/LoanDetailContent"));
import { BORROWERS, WAGE_DATA, SELFEMPLOYED } from "./loanDetails/data";

interface UIState {
  showLoanDrawer: boolean;
  sidebarState: {
    section: "borrowers" | "banks" | "realEstate";
    selectedBorrowerId: string | null;
    mode: "view" | "edit" | "add";
  };
  selectedLoanId?: number | null;
  activeTab?: string;
  loanStatus?: string;
  lastSaved?: string;
}

interface Props {
  ui: UIState;
  updateUI: (changes: Partial<UIState>) => void;
}

// Hardcoded data structure matching your requirements
const loanData = {
  borrowerDetails: {
    "Marvin McKinney": {
      "Wage Earner": [
        {
          employerName: "J.G. Wentworth and Associates, LLC",
          borrowerId: "b_1",
          borrowerWageid: "6995",
          totalIncome: "234.60"
        },
        {
          employerName: "employee2",
          borrowerId: "b_1", 
          borrowerWageid: "6996",
          totalIncome: "234.60"
        },
      ],
      "Self Employed": [
        {
          business_name: "Business 1",
          borrowerId: "b_1",
          selfemployedId: "1149"
        },
      ]
    },
    "Martha McKinney": {
      "Wage Earner": [
        {
          employerName: "Acme Corp LLC",
          borrowerId: "b_2",
          borrowerWageid: "6997",
          totalIncome: "234.60"
        },
        {
          employerName: "employee2", 
          borrowerId: "b_2",
          borrowerWageid: "6998",
          totalIncome: "234.60"
        },
      ],
      "Self Employed": [
        {
          business_name: "Business 1",
          borrowerId: "b_2",
          selfemployedId: "1150"
        },
      ]
    },
  },
  "Bank Statement": [
    {
      incomeSource: "Acme Company",
      borrowerId: "13706",
      borrowertypeId: "1",
      totalIncome: "4201.86",
      bankName: "Indian%20Bank"
    },
    {
      incomeSource: "123 Tool Company",
      borrowerId: "13706",
      borrowertypeId: "1", 
      totalIncome: "4201.86",
      bankName: "Indian%20Bank"
    }
  ],
  "Real Estate": [
    {
      reoID: "2554",
      borrowerId: "13706",
      borrowertypeId: "3",
      totalIncome: "4201.86",
      borrowerName: "Test new name",
      Property_Address: "123 Anystreet",
      Adjusted_Monthly_Rental_Income: 3548.58,
      Net_Rental_Value: 3548.58
    },
    {
      reoID: "2555",
      borrowerId: "13706",
      borrowertypeId: "3",
      totalIncome: "4201.86",
      borrowerName: "Test new name",
      Property_Address: "456 Bento St",
      Adjusted_Monthly_Rental_Income: 3548.58,
      Net_Rental_Value: 3548.58
    }
  ]
};

export default function LoanDetailDrawer({ ui, updateUI }: Props) {
  const sidebarState = ui.sidebarState;

  // Find selected borrower
  const selectedBorrower =
    BORROWERS.find((b) => b.id === sidebarState.selectedBorrowerId) ?? null;

  // Hardcoded wage & self-employed data (linked to borrower)
  const wages = WAGE_DATA.filter(
    (w) => w.borrowerId === sidebarState.selectedBorrowerId
  );
  const selfemployed = SELFEMPLOYED.filter(
    (s) => s.borrowerId === sidebarState.selectedBorrowerId
  );

  // Handler for when a borrower is selected in the sidebar
  const handleBorrowerSelect = (borrowerName: string) => {
    // Find the borrower ID from the name
    const borrower = Object.entries(loanData.borrowerDetails).find(
      ([name]) => name === borrowerName
    );
    
    if (borrower) {
      // Extract borrower ID from the first wage earner entry
      const borrowerId = borrower[1]["Wage Earner"][0]?.borrowerId;
      if (borrowerId) {
        updateUI({
          sidebarState: { 
            ...sidebarState, 
            selectedBorrowerId: borrowerId 
          },
        });
      }
    }
  };

  // Handler for add new actions
  const handleAddNew = () => {
    updateUI({
      sidebarState: {
        ...sidebarState,
        mode: "add"
      }
    });
  };

  return (
    <AnimatePresence>
      {ui.showLoanDrawer && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => updateUI({ showLoanDrawer: false })}
          />

          {/* Drawer Content */}
          <motion.div
            key="loan-drawer"
            className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-gray-900 shadow-2xl"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {/* Full-width Header */}
            <LoanDetailHeader ui={ui} updateUI={updateUI} />

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className=" ml-3 bg-white border border-gray-200 rounded-lg shadow-sm w-80 shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                <LoanDetailSideBar
                  loanData={loanData}
                  selectedBorrower={selectedBorrower?.name || null}
                  onBorrowerSelect={handleBorrowerSelect}
                  onAddNew={handleAddNew}
                />
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <LoanDetailContent
                  borrower={selectedBorrower}
                  wages={wages}
                  selfemployed={selfemployed}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}