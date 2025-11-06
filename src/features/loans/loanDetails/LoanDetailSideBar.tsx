import React from "react";

type SidebarState = {
  section: "borrowers" | "banks" | "realEstate";
  selectedBorrowerId: string | null;
  mode: "view" | "edit" | "add";
};

interface Borrower {
  id: string;
  name: string;
}

interface Props {
  borrowers: Borrower[];
  ui: SidebarState;
  updateUI: (changes: Partial<SidebarState>) => void;
}

export default function LoanDetailSidebar({ borrowers, ui, updateUI }: Props) {
  return (
    <aside className="w-72 bg-white dark:bg-gray-800 border-r overflow-auto p-3">
      <div className="mb-4 text-xs text-gray-500 uppercase">Borrowers</div>

      {borrowers.map(b => {
        const active = ui.selectedBorrowerId === b.id;
        return (
          <div
            key={b.id}
            onClick={() => updateUI({ selectedBorrowerId: b.id })}
            className={`mb-2 p-2 rounded cursor-pointer ${active ? "bg-blue-50 dark:bg-blue-900 font-semibold" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
          >
            <div className="truncate">{b.name}</div>
            <div className="text-xs text-gray-400">Wage Earner / Self Employed</div>
          </div>
        );
      })}

      <button
        onClick={() => updateUI({ mode: "add" })}
        className="mt-3 text-sm text-blue-600"
      >
        + Add new borrower
      </button>

      {/* Banks + Real Estate placeholders */}
      <div className="mt-6 text-xs text-gray-500 uppercase">Bank Statement</div>
      <div className="text-sm text-gray-400 mb-2">Acme Company</div>
      <div className="text-sm text-gray-400 mb-2">123 Tool Company</div>

      <div className="mt-6 text-xs text-gray-500 uppercase">Real Estate</div>
      <div className="text-sm text-gray-400 mb-2">123 Anystreet</div>
      <div className="text-sm text-gray-400 mb-2">456 Bento St</div>

      <button className="w-full mt-6 border rounded-md py-2 text-sm">+ Add new</button>
    </aside>
  );
}
