import { useState } from "react";
import DatePickerField from "../../../../../shared/accessories/DatePicker";
import ReadOnlyInputField from "../../../../../shared/accessories/ReadOnlyInputField";
interface Props {
  wages: any;
//   updateUI: (changes: any) => void;
}
const WageEarnerTopContent = ({wages}:Props) => {
  return (
    <div className="font-[Creato_Display] text-[#303030]">
      <div>
        <ReadOnlyInputField
          label=""
          value={wages.employer_name}
          placeholder="Employer Name"
        />
      </div>
      <div className="flex flex-wrap gap-[25px] py-[18px]">
        <DatePickerField
          label="Hire Date"
          name="hireDate"
          value={wages.DateOfHire}
          onChange={(e: any) => console.log(e.target.value)}
          minDate={new Date()}
          placement="left-start"
          className="w-[365px]"
        />
        <DatePickerField
          label="Verified Date"
          name="verifiedDate"
          value={wages.PaidThruDate}
          onChange={(e: any) => console.log(e.target.value)}
          minDate={new Date()}
          placement="left-start"
          className="w-[365px]"
        />
        <DatePickerField
          label="Termination Date"
          name="terminationDate"
          value={wages.DateOfTermination}
          onChange={(e: any) => console.log(e.target.value)}
          minDate={new Date()}
          placement="left-start"
          className="w-[365px]"
        />
      </div>
    </div>
  );
};

export default WageEarnerTopContent;
