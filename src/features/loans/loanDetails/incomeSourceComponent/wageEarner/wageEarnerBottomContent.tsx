import { useState } from "react";
import DatePickerField from "../../../../../shared/accessories/DatePicker";
import ReadOnlyInputField from "../../../../../shared/accessories/ReadOnlyInputField";

const WageEarnerBottomContent = () => {
  const [comment, setcomment] = useState("");

  return (
    <div className="font-[Creato_Display] text-[#303030]">
      {/* Comment Section */}
      <div className="flex flex-col items-start gap-2 w-[553px] py-[5px]">
        <div className="text-[16px] text-[#4d4d4d] pt-4">Comments</div>
        <textarea
          className="w-full h-[42px] p-[8px_16px] font-normal text-[16px] leading-[150%] text-[#303030] bg-[#f7f7f7] border border-[#e0e0e0] shadow-inner rounded-lg resize-y outline-none"
          id="txtcomment"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setcomment(e.target.value)}
        ></textarea>
        <div className="flex justify-end w-[26.2%] ml-[74%]">
          <div className="border border-[#24a1dd] flex justify-center items-center py-2 px-4 rounded-lg cursor-pointer">
            <span className="text-[#24a1dd]">Add Comment</span>
          </div>
        </div>
      </div>

      <div className="mt-2 w-[40%]" id="commentsList"></div>

      {/* Delete Employer Section */}
      <div className="flex flex-col mt-4">
        <div className="flex items-center h-[35px] rounded cursor-pointer">
          <span className="text-[#ca1c1f] font-medium text-[16px] leading-[19px] text-center">
            Delete Employer
          </span>
        </div>
        <div className="text-[#4d4d4d] text-[12px]">
          Permanently delete this employer
        </div>
      </div>
    </div>
  );
};

export default WageEarnerBottomContent;
