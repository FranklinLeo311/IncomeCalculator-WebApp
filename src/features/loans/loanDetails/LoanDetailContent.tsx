// import IncomeSourcesTab from "../sections/IncomeSourcesTab";
import BankStatementGrid from "./incomeSourceComponent/bankStatement/BankStatementGrid";
import RealEstateGrid from "./incomeSourceComponent/realEstate/RealEstateGrid";
// import DocumentsTab from "../sections/DocumentsTab";
// import HistoryTab from "../sections/HistoryTab";

export default function LoanDetailContent({ section }: { section: string }) {
  const screens: any = {
    // income: <IncomeSourcesTab />,
    bank: <BankStatementGrid />,
    realEstate: <RealEstateGrid />,
    // documents: <DocumentsTab />,
    // history: <HistoryTab />
  };

  return <div className="p-6">{screens[section]}</div>;
}
