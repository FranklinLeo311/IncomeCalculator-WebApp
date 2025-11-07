import { useState } from "react";
import WageEarnerNew from "./WagerEarnerNew";
import Summary from "./Summary";
import PayStub from "./payStud";
import VOE from "./VOE";
import W2 from "./W2";

const WageEarnerTabContent = () => {
  const [activeTab, setActiveTab] = useState({ Tab: "summary" });

  return (
    <div className="font-[Creato_Display] text-[#303030]">
      {/* Income Forms Heading */}
      <div className="font-[Jura] font-normal text-[28px] leading-[28px] text-[#222222] pb-[17px]">
        Income Forms
      </div>

      {/* Tabs */}
      <div className="flex flex-row border border-[#e0e0e0] w-[90%]">
        {/* Summary Tab */}
        <div
          className={`flex items-center justify-between w-[120px] h-[48px] px-[16px] border border-[#e0e0e0] border-b-0 text-[14px] cursor-pointer 
            ${
              activeTab.Tab === "summary"
                ? "border-b-[4px] border-b-[#24a1dd] text-[#303030]"
                : "text-[#4d4d4d] hover:bg-[#f5f5f5]"
            }`}
          onClick={() =>
            setActiveTab((prev) => ({
              ...prev,
              Tab: "summary",
            }))
          }
        >
          <span className="mr-[8px] flex items-center">📋</span>
          <span className="flex-1">Summary</span>
        </div>
        {/* Pay Stub Tab */}
        <div
          className={`flex items-center justify-between w-[120px] h-[48px] px-[16px] border border-[#e0e0e0] border-b-0 text-[14px] cursor-pointer 
            ${
              activeTab.Tab === "paystub"
                ? "border-b-[4px] border-b-[#24a1dd] text-[#303030]"
                : "text-[#4d4d4d] hover:bg-[#f5f5f5]"
            }`}
          onClick={() =>
            setActiveTab((prev) => ({
              ...prev,
              Tab: "paystub",
            }))
          }
        >
          <span className="flex-1">Pay Stub</span>
          <span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.99998 8.66675C8.36817 8.66675 8.66665 8.36827 8.66665 8.00008C8.66665 7.63189 8.36817 7.33341 7.99998 7.33341C7.63179 7.33341 7.33331 7.63189 7.33331 8.00008C7.33331 8.36827 7.63179 8.66675 7.99998 8.66675Z"
                stroke="#969696"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.99998 4.00008C8.36817 4.00008 8.66665 3.7016 8.66665 3.33341C8.66665 2.96522 8.36817 2.66675 7.99998 2.66675C7.63179 2.66675 7.33331 2.96522 7.33331 3.33341C7.33331 3.7016 7.63179 4.00008 7.99998 4.00008Z"
                stroke="#969696"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.99998 13.3334C8.36817 13.3334 8.66665 13.0349 8.66665 12.6667C8.66665 12.2986 8.36817 12.0001 7.99998 12.0001C7.63179 12.0001 7.33331 12.2986 7.33331 12.6667C7.33331 13.0349 7.63179 13.3334 7.99998 13.3334Z"
                stroke="#969696"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
        {/* VOE Tab */}
        <div
          className={`flex items-center justify-between w-[120px] h-[48px] px-[16px] border border-[#e0e0e0] border-b-0 text-[14px] cursor-pointer 
            ${
              activeTab.Tab === "voe"
                ? "border-b-[4px] border-b-[#24a1dd] text-[#303030]"
                : "text-[#4d4d4d] hover:bg-[#f5f5f5]"
            }`}
          onClick={() =>
            setActiveTab((prev) => ({
              ...prev,
              Tab: "voe",
            }))
          }
        >
          <span className="flex-1">VOE</span>
          <span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.99998 8.66675C8.36817 8.66675 8.66665 8.36827 8.66665 8.00008C8.66665 7.63189 8.36817 7.33341 7.99998 7.33341C7.63179 7.33341 7.33331 7.63189 7.33331 8.00008C7.33331 8.36827 7.63179 8.66675 7.99998 8.66675Z"
                stroke="#969696"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.99998 4.00008C8.36817 4.00008 8.66665 3.7016 8.66665 3.33341C8.66665 2.96522 8.36817 2.66675 7.99998 2.66675C7.63179 2.66675 7.33331 2.96522 7.33331 3.33341C7.33331 3.7016 7.63179 4.00008 7.99998 4.00008Z"
                stroke="#969696"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.99998 13.3334C8.36817 13.3334 8.66665 13.0349 8.66665 12.6667C8.66665 12.2986 8.36817 12.0001 7.99998 12.0001C7.63179 12.0001 7.33331 12.2986 7.33331 12.6667C7.33331 13.0349 7.63179 13.3334 7.99998 13.3334Z"
                stroke="#969696"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
        {/* W2 Tab */}
        <div
          className={`flex items-center justify-between w-[120px] h-[48px] px-[16px] border border-[#e0e0e0] border-b-0 text-[14px] cursor-pointer 
            ${
              activeTab.Tab === "w2"
                ? "border-b-[4px] border-b-[#24a1dd] text-[#303030]"
                : "text-[#4d4d4d] hover:bg-[#f5f5f5]"
            }`}
          onClick={() =>
            setActiveTab((prev) => ({
              ...prev,
              Tab: "w2",
            }))
          }
        >
          <span className="flex-1">W2</span>
          <span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.99998 8.66675C8.36817 8.66675 8.66665 8.36827 8.66665 8.00008C8.66665 7.63189 8.36817 7.33341 7.99998 7.33341C7.63179 7.33341 7.33331 7.63189 7.33331 8.00008C7.33331 8.36827 7.63179 8.66675 7.99998 8.66675Z"
                stroke="#969696"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.99998 4.00008C8.36817 4.00008 8.66665 3.7016 8.66665 3.33341C8.66665 2.96522 8.36817 2.66675 7.99998 2.66675C7.63179 2.66675 7.33331 2.96522 7.33331 3.33341C7.33331 3.7016 7.63179 4.00008 7.99998 4.00008Z"
                stroke="#969696"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.99998 13.3334C8.36817 13.3334 8.66665 13.0349 8.66665 12.6667C8.66665 12.2986 8.36817 12.0001 7.99998 12.0001C7.63179 12.0001 7.33331 12.2986 7.33331 12.6667C7.33331 13.0349 7.63179 13.3334 7.99998 13.3334Z"
                stroke="#969696"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
        {/* Add New Wage Earner */}
        <div
          className="flex justify-center items-center w-[48px] h-[48px] p-0 border border-[#e0e0e0] cursor-pointer hover:bg-[#f5f5f5]"
          onClick={() =>
            setActiveTab((prev) => ({
              ...prev,
              Tab: "new",
            }))
          }
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.1665 10.0001H15.8332M9.99984 4.16675V15.8334"
              stroke="#303030"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* Exit */}
        <div className="ml-auto w-[44px] h-[48px] flex items-center justify-center border-0 cursor-pointer hover:bg-[#f5f5f5]">
          {" "}
          <svg
            width="44"
            height="48"
            viewBox="0 0 44 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {" "}
            <rect
              x="0.5"
              y="0.5"
              width="43"
              height="47"
              stroke="#E0E0E0"
            />{" "}
            <path
              d="M24.5 16.5V31.5M20.3333 26.5L17.8333 24L20.3333 21.5M16.1667 16.5H27.8333C28.7538 16.5 29.5 17.2462 29.5 18.1667V29.8333C29.5 30.7538 28.7538 31.5 27.8333 31.5H16.1667C15.2462 31.5 14.5 30.7538 14.5 29.8333V18.1667C14.5 17.2462 15.2462 16.5 16.1667 16.5Z"
              stroke="#4D4D4D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />{" "}
          </svg>{" "}
        </div>{" "}
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-center p-6 gap-6 w-[90%] h-[auto] bg-white self-stretch rounded-[3px] shadow-[0_2px_6px_rgba(0,0,0,0.05)] border border-[#e0e0e0]">
        {activeTab.Tab === "summary" && <Summary />}
        {activeTab.Tab === "paystub" && <PayStub />}
        {activeTab.Tab === "voe" && <VOE />}
        {activeTab.Tab === "w2" && <W2 />}
        {activeTab.Tab === "new" && <WageEarnerNew />}
      </div>
    </div>
  );
};

export default WageEarnerTabContent;
