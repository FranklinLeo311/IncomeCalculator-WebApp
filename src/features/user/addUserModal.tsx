import { Modal, Button, Divider } from "antd";
import InputField from "../../shared/accessories/InputField";
import MultiSelectDropdown from "../../shared/accessories/MultiSelectDropdown";
import SingleDropdown from "../../shared/accessories/SingleDropdown";
import ToggleComponent from "../../shared/accessories/Toggle";
import { validateEmail } from "../../shared/utils/validationFunctions";

const AddUserModal = ({
  userDetails: inputDetails,
  options,
  openModal,
  onCancel,
  onSubmit,
  handleChange,
  handleRoleChange,
  validation,
}: {
  openModal: boolean;
  handleChange: (e: any) => void;
  onCancel: () => void;
  onSubmit: (data: any) => void;
  userDetails?: any;
  handleRoleChange: (e: any) => void;
  options: any;
  validation: Record<string, any>;
}) => {
  const handleSubmit = () => {
    onSubmit(inputDetails);
  };

  return (
    <Modal
      title="Create User"
      closable={{ "aria-label": "Custom Close Button" }}
      open={openModal}
      onCancel={onCancel}
      onOk={handleSubmit}
      className="!w-[70%] dark:text-gray-200"
      footer={[
        <Button key="back" onClick={onCancel} className="w-[120px]">
          <span className="text-white text-[14px]">Cancel</span>
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          className="w-[120px]"
        >
          <span className="text-white text-[14px]">Save</span>
        </Button>,
      ]}
    >
      <Divider />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="First Name"
          name="firstName"
          formatType="name"
          value={inputDetails.firstName}
          onChange={handleChange}
          placeholder="Enter first name"
          size="middle"
          required={true}
          inValid={validation.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          formatType="name"
          value={inputDetails.lastName}
          onChange={handleChange}
          placeholder="Enter last name"
          size="middle"
          required={true}
          inValid={validation.lastName}
        />

        <InputField
          label="Email"
          name="email"
          onBlur={() => {
            if (!validateEmail(inputDetails.email)) {
              handleChange({ name: "email", value: "" });
            }
          }}
          value={inputDetails.email}
          onChange={handleChange}
          placeholder="Enter email"
          size="middle"
          required={true}
          inValid={validation.email}
        />

        <InputField
          label="Phone"
          name="phone"
          value={inputDetails.phone}
          onChange={handleChange}
          formatType="phone"
          placeholder="Enter phone"
          size="middle"
          required={true}
          inValid={validation.phone}
        />

        <SingleDropdown
          label="Role"
          name="role"
          value={inputDetails.role}
          options={options.roles}
          onChange={handleRoleChange}
          placeholder="Enter role"
          size="large"
          virtual={true}
          required={true}
          inValid={validation.role}
        />

        <MultiSelectDropdown
          label="Permissions"
          name="permissions"
          value={inputDetails.permissions}
          onChange={handleChange}
          options={options.permissions}
          placeholder="Enter permissions"
          size="large"
          virtual={false}
          required={true}
          inValid={validation.permissions}
        />

        <ToggleComponent
          label="Status"
          labelA="Active"
          labelB="Inactive"
          checked={inputDetails.status}
          onChange={(checked) =>
            handleChange({ name: "status", value: checked })
          }
          required={true}
        />
      </div>
      <Divider className="mt-24" />
    </Modal>
  );
};
export default AddUserModal;
