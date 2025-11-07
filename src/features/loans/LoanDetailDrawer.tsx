import { Drawer } from "antd";
import LoanDetailHeader from "./loanDetails/LoanDetailHeader";
import LoanDetailSideBar from "./loanDetails/LoanDetailSideBar";
import LoanDetailContent from "./loanDetails/LoanDetailContent";
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

export default function LoanDetailDrawer({ ui, updateUI }: Props) {
  const sidebarState = ui.sidebarState;

  // Find selected borrower
  const selectedBorrower =
    BORROWERS.find((b) => b.id === sidebarState.selectedBorrowerId) ?? null;

  // Hardcoded example: get wage & self-employed related to selected borrower
  const wages = WAGE_DATA.filter(
    (w) => w.borrowerId === sidebarState.selectedBorrowerId
  );
  const selfemployed = SELFEMPLOYED.filter(
    (s) => s.borrowerId === sidebarState.selectedBorrowerId
  );

  return (
    <Drawer
      open={ui.showLoanDrawer}
      onClose={() => updateUI({ showLoanDrawer: false })}
      width="100%"
      closable={false}
      bodyStyle={{ padding: 0 }}
      forceRender
      destroyOnClose={false}
      mask={true}
    >
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        {/* 1. Header Full Width */}
        <LoanDetailHeader ui={ui} updateUI={updateUI} />

        <div className="flex flex-1 overflow-hidden">
          {/* 2. Sidebar on the left */}
          <div className="w-72 shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <LoanDetailSideBar
              borrowers={BORROWERS}
              ui={sidebarState}
              updateUI={(changes) =>
                updateUI({
                  sidebarState: { ...sidebarState, ...changes },
                })
              }
            />
          </div>

          {/* 3. Main content on the right */}
          <div className="flex-1 overflow-y-auto p-6">
            <LoanDetailContent
    borrower={selectedBorrower}
    wages={wages}
    selfemployed={selfemployed}
  />
            {/* <div className="text-gray-500 dark:text-gray-300">
              Select a borrower from the sidebar
            </div> */}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
