import { useState } from "react";
import { handleGetApi } from "../../../../../shared/utils/api";

const WageEarnerNew = () => {
  return (
    <div className="font-[Creato_Display] text-[#303030] flex flex-col items-center p-6 gap-6 w-[100%] h-[188px]">
      <div className="font-[Jura] font-normal text-[20px] text-[#969696]">
        Choose an income form
      </div>
      <div className="flex gap-2 self-stretch">
        {["Pay Stub", "VOE", "W2", "Import"].map((label) => (
          <div
            key={label}
            className="flex flex-1 max-w-[25%] flex-row justify-center items-center p-[12px_16px] gap-[8px] h-[48px] bg-white border border-[#e0e0e0] shadow-[0_2px_8px_rgba(99,99,99,0.2)] rounded-lg cursor-pointer transition-all hover:bg-[#f5f5f5]"
          >
            {label === "Import" ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3V15M12 15L8 11M12 15L16 11M8 5H4C3.46957 5 2.96086 5.21071 2.58579 5.58579C2.21071 5.96086 2 6.46957 2 7V17C2 17.5304 2.21071 18.0391 2.58579 18.4142C2.96086 18.7893 3.46957 19 4 19H20C20.5304 19 21.0391 18.7893 21.4142 18.4142C21.7893 18.0391 22 17.5304 22 17V7C22 6.46957 21.7893 5.96086 21.4142 5.58579C21.0391 5.21071 20.5304 5 20 5H16"
                  stroke="#24A1DD"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M8 13H10M14 13H16M8 17H10M14 17H16M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
                  stroke="#24A1DD"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WageEarnerNew;
