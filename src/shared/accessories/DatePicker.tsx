// how to use
{/* <DatePickerField
              label="Effective Date"
              value={inputDetails["effectiveDate"]}
              name="effectiveDate"
              onChange={handleChange}
              minDate={new Date()}
              timeIntervals={1}
              placement="left-start"
            /> */}

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "../utils/formatFunctions";
import { useMemo } from "react";

interface DatePickerFieldProps {
  value: string | Date;
  onChange: ({ name, value }: { name: string; value: any }) => void;
  disabled?: boolean;
  label?: string;
  name?: string;
  defaultValue?: Date | string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  timeIntervals?: number;
  placement?: "bottom" | "top" | "left-start" | "left" | "left-end";
}
const DatePickerField = ({
  value = "",
  name = "",
  onChange,
  minDate,
  maxDate,
  disabled = false,
  label = "Date",
  timeIntervals = 15,
  placement = "bottom",
}: DatePickerFieldProps) => {
  const id = useMemo(
    () => `date-picker-${Math.floor(100 + Math.random() * 900)}`,
    []
  );

  const selectedDate = new Date(value);

  const filterPassedTime = (time: Date) => {
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

  if (selectedDay < today) {
    return false;
  }

  if (selectedDay.getTime() === today.getTime()) {
    return time.getTime() > now.getTime();
  }

  return true;
};
  return (
    <div className="cds--list-box__wrapper">
      <label className="cds--label" dir="auto" htmlFor={id}>
        {label}
      </label>
      <div className="">
        <DatePicker
          id={id}
          selected={selectedDate}
          onChange={(value) =>
            onChange({ name, value: formatDate(value, "MM/DD/YYYY hh:mm A") })
          }
          // withPortal
          popperPlacement={placement}
          showTimeSelect
          timeFormat="hh:mm aa"
          timeIntervals={timeIntervals}
          filterTime={filterPassedTime}
          dateFormat="MM/dd/yyyy hh:mm aa"
          placeholderText="Select date and time"
          className="cds--text-input !h-[32px]"
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
    </div>
  );
};

export default DatePickerField;
