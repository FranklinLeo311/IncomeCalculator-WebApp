import { Modal, Button, Divider, Grid } from "antd";
import InputField from "../../shared/accessories/InputField";
import MultiSelectDropdown from "../../shared/accessories/MultiSelectDropdown";
import SingleDropdown from "../../shared/accessories/SingleDropdown";
import ToggleComponent from "../../shared/accessories/Toggle";
import { validateEmail } from "../../shared/utils/validationFunctions";
import { CloseOutlined } from "@ant-design/icons";
import { useState, useEffect, useLayoutEffect } from "react";
import { handleGetApi } from "../../shared/utils/api";

const { useBreakpoint } = Grid;

const AddUserModal = ({
  userDetails: inputDetails,
  onClose,
  onSubmit,
  handleChange,
  validation,
  modalDetails,
}: {
  handleChange: (e: any) => void;
  onClose: () => void;
  onSubmit: (data: any) => void;
  userDetails?: any;
  validation: Record<string, any>;
  modalDetails: any;
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;
  // const [selectedRole, setSelectedRole] = useState(inputDetails.role);
  const [options, setOptions] = useState({
    roles: [],
    permissions: [],
  });

  // Fetch roles on component mount
  useLayoutEffect(() => {
    if (options.roles.length > 0) return;
    const fetchRoles = async () => {
      try {
        const response = await handleGetApi("api/GetRoles", {
          user_id: 67,
          role_id: 3,
        });
        const rolesData = response?.Roles || [];

        const rolesOptions = rolesData.map((role: any) => ({
          value: role.RoleId,
          label: role.Role,
          // Optionally include other data
          isTenantAdmin: role.IsTenantAdmin,
        }));

        setOptions((prev) => ({
          ...prev,
          roles: rolesOptions,
        }));
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();

    if (inputDetails.role) {
      fetchPermissions(inputDetails.role);
    }
  }, []);

  const fetchPermissions = async (role_id = inputDetails.role) => {
    if (!role_id) return;

    try {
      const { defaultrolepermission: permissions } =
        (await handleGetApi("api/GetPermissions", {
          user_id: 67,
          role_id: role_id,
        })) || {};

      let permissionsArray = [];

      if (Array.isArray(permissions)) {
        permissionsArray = permissions;
      } else if (permissions && typeof permissions === "object") {
        permissionsArray = [permissions];
      } else {
        // Invalid response
        console.error("Invalid permissions response:", permissions);
        setOptions((prev) => ({
          ...prev,
          permissions: [],
        }));
        return;
      }

      if (permissions.length === 0) return;
      const permissionOptions = permissionsArray.map((permission: any) => ({
        value: permission.PermissionId,
        label: permission.Permission,
      }));

      // permissionOptions.unshift({
      //   value: "__all__",
      //   label: "Select all",
      //   defaultPermission: permissionOptions[0]?.defaultPermission,
      // });
      setOptions((prev) => ({
        ...prev,
        permissions: permissionOptions as any,
      }));
      const defaultPermissionStr = permissionsArray[0]?.defaultPermission || "";

      const defaultPermissionValues = defaultPermissionStr
        .split(",")
        .map((v: any) => v.trim())
        .filter(Boolean);

      const commaSeparatedValue = defaultPermissionValues.join(",");

      handleChange({ name: "permissions", value: commaSeparatedValue });
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const handleRoleChange = (value: any) => {
    const roleId = value?.value || value;
    fetchPermissions(roleId);
    setOptions((prev) => ({
      ...prev,
      permissions: [],
    }));

    handleChange({ name: "role", value: roleId });
    // Clear selected permissions when role changes
    handleChange({ name: "permissions", value: [] });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[100] p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-2 pb-0">
          <h3 className="text-xl font-semibold ml-2">{modalDetails.title}</h3>
          <Button
            onClick={onClose}
            type="text"
            className="p-2"
            aria-label="Close"
          >
            <CloseOutlined />
          </Button>
        </div>

        <Divider className="my-2" />

        {/* Form Content */}
        <div className="flex-1 overflow-auto px-4">
          <div
            className={`
            grid gap-6
            ${isMobile ? "grid-cols-1" : "grid-cols-2"}
          `}
          >
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
              placeholder="Select role"
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
              placeholder="Select permissions"
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
        </div>

        <div className="p-2 pt-0">
          <Divider className="my-4" />
          <div className="flex justify-end gap-3">
            <Button
              onClick={onClose}
              className="min-w-[100px] h-10"
              size="large"
            >
              <span className=" text-[14px]">Cancel</span>
            </Button>
            <Button
              type="primary"
              onClick={onSubmit}
              className="min-w-[100px] h-10"
              size="large"
            >
              <span className="text-[14px]">Save</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
