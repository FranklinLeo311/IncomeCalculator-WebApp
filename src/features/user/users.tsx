import React, { useEffect, useMemo, useState } from "react";
import { Button } from "antd";
import AddUserModal from "./addUserModal";
import { handleGetApi, handlePostApi } from "../../shared/utils/api";
import Search from "antd/es/input/Search";
import { DataTable } from "../../shared/accessories/DataTable";
import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";

const Users: React.FC = () => {
  interface initialInputDetails {
    userid?: string | number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    permissions: string;
    status: boolean;
  }

  const initialInputDetails: initialInputDetails = {
    userid: "0",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    permissions: "",
    status: false,
  };

  const [rowData, setRowData] = useState<any[]>([]);
  const [inputDetails, setInputDetails] = useState(initialInputDetails),
   [inputValidation, setInputValidation] = useState<{
      [key: string]: string;
    }>({});
  const [processingStatus, setProcessingStatus] = useState("pageOnLoad");
  const [options, setOptions] = useState({
    roles: [],
    permissions: [],
  });
  const [selectedRole, setSelectedRole] = useState(null);

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await handleGetApi("api/GetRoles", {
          user_id: 67,
          role_id: 3,
        });
        const rolesData = response?.data.Roles || [];

        const rolesOptions = rolesData.map((role: any) => ({
          value: role.RoleId,
          label: role.Role,
          // Optionally include other data
          isTenantAdmin: role.IsTenantAdmin,
        }));
        console.log("API roles:", rolesOptions);

        setOptions((prev) => ({
          ...prev,
          roles: rolesOptions,
        }));
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!selectedRole) return;

      try {
        const response = await handleGetApi("api/GetPermissions", {
          user_id: 67,
          role_id: selectedRole,
        });
        const { defaultrolepermission: permissions } = response?.data || {};

        const permissionOptions = permissions.map((permission: any) => ({
          value: permission.PermissionId,
          label: permission.Permission,
          // Optionally include other data
          defaultPermission: permission.defaultPermission,
        }));

        setOptions((prev) => ({
          ...prev,
          permissions: permissionOptions || [],
        }));
        console.log("Options:", options);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    fetchPermissions();
  }, [selectedRole]);

  const handleRoleChange = (e: any) => {
    debugger
    const roleId = e.target?.value || e.value || e;
    setSelectedRole(roleId);
    handleChange(e);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setProcessingStatus("pageOnLoad");
        const response = await handleGetApi("api/ReadUsers", {
          tenantid: 7,
          userid: 67,
        });

        const data = JSON.parse(response?.data);
        console.log("API Response:", data);

        const rowData = userData(data);
        setRowData(rowData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setRowData([]);
      } finally {
        setProcessingStatus("");
      }
    };
    fetchUsers();
  }, []);

  const userData = (response: any): any[] => {
    if (!response?.user || !Array.isArray(response.user)) return [];

    return response.user.map((u: any) => ({
      userId: u.user_id,
      tenantId: u.TenantId,
      userName: u.UserName,
      firstName: u.first_name,
      lastName: u.Last_Name,
      email: u.email,
      status: u.status === "1" ? "Active" : "Inactive",
      role: u.Role,
      mobileNumber: u.mobilenumber || "—",
      permissions: u.permissionname,
    }));
  };

  const [modalDetails, setModalDetails] = useState({
    showAddUserModel: false,
    data: [],
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target || e;
    if (name === "status") {
      setInputDetails((prev) => ({
        ...prev,
        [name]: value ? 1 : 0,
      }));
      return;
    }
    setInputDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columnDef = useMemo(() => {
    return [
      {
        headerName: "First Name",
        field: "firstName",
        minWidth: 78,
      },

      {
        headerName: "Last Name",
        field: "lastName",
        minWidth: 140,
      },

      {
        headerName: "Email",
        field: "email",
        minWidth: 120,
      },
      {
        headerName: "Phone",
        field: "phone",
        minWidth: 120,
      },
      {
        headerName: "Role",
        field: "role",
        minWidth: 120,
      },
      {
        headerName: "Permissions",
        field: "permissions",
        minWidth: 120,
        cellRenderer: ({ value }: any) => <span>{value}</span>,
      },

      {
        headerName: "Status",
        field: "status",
        minWidth: 100,
        cellRenderer: ({ value }: any) => <span>{value}</span>,
      },
      {
        field: "action",
        headerName: "Action",
        minWidth: 100,
        cellRenderer: (params) => {
          return (
            <EditOutlined
              className={`cursor-pointer text-[var(--rl-blue)]`}
              onClick={() => {
                setModalDetails({
                  ...modalDetails,
                  showAddUserModel: true,
                });
              }}
            />
          );
        },
      },
    ];
  }, []);

  interface ApiResponse {
    status: string;
    message: string;
  }

  const createOrUpdateUser = async (
    userData: initialInputDetails,
    tenantId: string | number,
    userId: string | number
  ): Promise<ApiResponse> => {
    try {
      const isNewUser = !userData.userid || userData.userid === "0";
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const endpoint = isNewUser
        ? `${API_BASE_URL}api/CreateUser`
        : `${API_BASE_URL}api/UpdateUser`;

      // "http://localhost:23107/api/CreateUser"

      // Convert boolean status to "0" or "1" string
      const statusValue = userData.status === true ? "1" : "0";

      // Prepare XML payload without extra whitespace
      let xmlPayload = "";

      if (isNewUser) {
        xmlPayload = `<user><tenantid>${tenantId}</tenantid><firstname>${userData.firstName}</firstname><lastname>${userData.lastName}</lastname><mobileno>${userData.phone}</mobileno><email>${userData.email}</email><status>${statusValue}</status><access>${userData.role}</access><permission>${userData.permissions}</permission><clerkid>${userId}</clerkid><flag>newuser</flag></user>`;
      } else {
        // xmlPayload = `<user><tenantid>${tenantId}</tenantid><user_id>${
        //   userData.id
        // }</user_id><firstname>${userData.firstName}</firstname><lastname>${
        //   userData.lastName
        // }</lastname><mobileno>${userData.phone}</mobileno><email>${
        //   userData.email
        // }</email><oldStatus>${
        //   userData.oldStatus
        // }</oldStatus><status>${statusValue}</status><access>${
        //   userData.role
        // }</access><permission>${userData.permissions}</permission><password>${
        //   userData.password || ""
        // }</password><clerkid>${userId}</clerkid><acknowledgment>${
        //   userData.acknowledgment || ""
        // }</acknowledgment><flag>newuser</flag></user>`;
      }

      console.log("XML:", xmlPayload);

      // Send the XML string directly as plain text
      const response = await handlePostApi(
        "/api/CreateUser",
        xmlPayload,
        "application/xml"
      );

      console.log("response", response);

      return {
        status: response.data.status || "1",
        message: response.data.message || "Operation successful",
      };
    } catch (error: any) {
      console.error("Error updating user:", error);
      console.error("Response data:", error.response?.data);

      if (error.response) {
        return {
          status: error.response.data?.status || "0",
          message:
            error.response.data?.message ||
            error.response.data?.detail ||
            "An error occurred",
        };
      }
      return {
        status: "0",
        message: `Error: ${error.message}`,
      };
    }
  };
  function handleFormValidation(iInputDetails: any) {
    let requiredFields = [
      "firstName",
      "email",
      "lastName",
      "phone",
      "role",
      "permissions",
    ];
    const errorsTemp: { [key: string]: string } = {};

    requiredFields.forEach((field) => {
      if (!iInputDetails[field]) {
        errorsTemp[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });
    setInputValidation(errorsTemp);
    return Object.keys(errorsTemp).length != 0;
  }

  const handleSubmit = async () => {
    if (handleFormValidation(inputDetails)) return;
    setModalDetails((prev) => ({ ...prev, showAddUserModel: false }));

    console.log("Form submitted:", inputDetails);
    try {
      const tenantId = sessionStorage.getItem("TenantId") || 7;
      const userId = sessionStorage.getItem("UserId") || 0;

      const result = await createOrUpdateUser(inputDetails, tenantId, userId);

      if (result.status === "1" || result.status === "200") {
        // Success
        console.log("Success:", result.message);
        // Close modal, refresh data, etc.
      } else {
        // Error
        console.error("Error:", result.message);
        // Show error message to user
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <main className="">
      <div className="flex justify-between">
        <span className="flex">
          <h2 className="font-semibold flex items-center text-2xl pb-5 mr-5 text-gray-800 dark:text-white">
            Manage Users
          </h2>
          <Search
            placeholder=" Search"
            prefix={<SearchOutlined />}
            suffix={null}
            allowClear
            enterButton="Search"
            size="middle"
            onSearch={() => {}}
            className="w-60 "
          />
        </span>
        <Button
          type="primary"
          onClick={() => {
            setModalDetails((prev) => ({ ...prev, showAddUserModel: true }));
          }}
        >
          <PlusOutlined />
          New User
        </Button>
      </div>
      <div className="p-3 pr-1 shadow-md bg-white dark:bg-gray-700 rounded-lg">
        <div className="w-full flex justify-end"></div>

        <div className="container">
          <DataTable
            domLayout="autoHeight"
            data={rowData}
            column={columnDef}
            loading={processingStatus === "pageOnLoad"}
            pagination
            className=""
            defaultColDef={{
              wrapText: true,
              autoHeight: true,
              suppressMovable: false,
            }}
            defaultPageSize={10}
          />
        </div>

        <AddUserModal
          openModal={modalDetails.showAddUserModel}
          onCancel={() => {
            setModalDetails((prev) => ({ ...prev, showAddUserModel: false }));
          }}
          onSubmit={() => {
            handleSubmit();
          }}
          handleChange={handleChange}
          validation={inputValidation}
          handleRoleChange={handleRoleChange}
          userDetails={inputDetails}
          options={options}
        />
      </div>
    </main>
  );
};

export default Users;
