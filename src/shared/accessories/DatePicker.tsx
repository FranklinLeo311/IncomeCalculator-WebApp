// how to use
{
  /* <DatePickerField
              label="Effective Date"
              value={inputDetails["effectiveDate"]}
              name="effectiveDate"
              onChange={handleChange}
              minDate={new Date()}
              timeIntervals={1}
              placement="left-start"
            /> */
}

import React, { useMemo } from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { formatDate } from "../utils/formatFunctions";

dayjs.extend(customParseFormat);

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
const getAntdPlacement = (placement: string) => {
  switch (placement) {
    case "top":
      return "topLeft";
    case "left":
    case "left-start":
      return "bottomLeft";
    case "left-end":
      return "bottomRight";
    case "bottom":
    default:
      return "bottomLeft";
  }
};
  const selectedDate = value ? dayjs(value) : null;

  // Disable past times logic (similar to filterPassedTime)
const disabledDateTime = (current: dayjs.Dayjs | null) => {
  const now = dayjs();

  if (!current) return {};

  const isBeforeToday = current.isBefore(now, "day");
  const isToday = current.isSame(now, "day");

  if (isBeforeToday) {
    // For past dates, just disable all times
    return {
      disabledHours: () => Array.from({ length: 24 }, (_, i) => i),
      disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i),
    };
  }

  if (isToday) {
    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i <= now.hour(); i++) hours.push(i);
        return hours;
      },
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === now.hour()) {
          const mins = [];
          for (let i = 0; i <= now.minute(); i++) mins.push(i);
          return mins;
        }
        return [];
      },
    };
  }

  return {}; // for future days, allow all times
};


  return (
    <div className="cds--list-box__wrapper">
      <label className="cds--label" htmlFor={id}>
        {label}
      </label>
      <Space direction="vertical" className="w-full">
        <DatePicker
          id={id}
          value={selectedDate}
          showTime={{
            format: "hh:mm A",
            minuteStep: Number(timeIntervals) as any, // fallback, but less strict
          }}
          format="MM/DD/YYYY hh:mm A"
          placeholder="Select date and time"
          disabled={disabled}
          disabledDate={(current) =>
            minDate && current && current < dayjs(minDate, "MM/DD/YYYY")
              ? true
              : maxDate && current && current > dayjs(maxDate, "MM/DD/YYYY")
              ? true
              : false
          }
          disabledTime={(date) => disabledDateTime(date)}
          placement={getAntdPlacement(placement)}
          onChange={(date) =>
            onChange({
              name,
              value: date
                ? formatDate(date.toDate(), "MM/DD/YYYY hh:mm A")
                : "",
            })
          }
          className={`!h-[32px] ${disabled ? "opacity-50" : ""}`}
          style={{ width: "295px" }}
        />
      </Space>
    </div>
  );
};

export default DatePickerField;
