import { useState } from "react";
import { Button } from "antd";
import LoanDetailDrawer from "./LoanDetailDrawer";
import { handlePostApi } from "../../shared/utils/api";

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

 const handleClick = async () => {
    // Remove the curly braces and send as proper XML string
    const xmlData = `<user>
  <tenantid>7</tenantid>
  <firstname>MORIES</firstname>
  <lastname>jade</lastname>
  <mobileno>1234355333</mobileno>
  <email>qc@jquieen2.com</email>
  <status>1</status>
  <access>10</access>
  <permission>3,9</permission>
  <clerkid>67</clerkid>
  <flag>newuser</flag>
</user>`;
    
    const response = await handlePostApi("/api/CreateUser", xmlData, 'application/xml');
    console.log(response);
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Loans List page</h2>

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

      <Button
        type="primary"
        onClick={handleClick}
      >
        Test Api call
      </Button>

      <LoanDetailDrawer ui={ui} updateUI={updateUI} />
    </div>
  );
}
