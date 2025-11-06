import { useState } from "react";
import { Button } from "antd";
import LoanDetailDrawer from "./LoanDetailDrawer";

export default function LoansPage() {
  const [ui, setUI] = useState({
    showLoanDrawer: false,
    // will store the sidebar state and selection
    sidebarState: {
      section: "borrowers" as const,
      selectedBorrowerId: "b_1" as string | null,
      mode: "view" as "view" | "edit" | "add",
    },
    // global meta
    selectedLoanId: 60973,
    activeTab: "details",
    loanStatus: "In Progress",
    lastSaved: "July 23, 2025 1:00 PM EST",
  });

  const updateUI = (changes: Partial<typeof ui>) =>
    setUI(prev => ({ ...prev, ...changes }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Loans</h2>

      <Button
        type="primary"
        onClick={() =>
          updateUI({
            showLoanDrawer: true,
            // open with first borrower selected
            sidebarState: { ...ui.sidebarState, section: "borrowers", selectedBorrowerId: "b_1" }
          })
        }
      >
        Open Loan Details
      </Button>

      <LoanDetailDrawer ui={ui} updateUI={updateUI} />
    </div>
  );
}
