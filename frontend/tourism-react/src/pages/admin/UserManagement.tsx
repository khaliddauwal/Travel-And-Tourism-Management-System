import React, { useState, useEffect, useCallback } from "react";
import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";
import FormBuilder from "../../components/common/FormBuilder";
import { User, TableColumn, FormField } from "../../types/management";
import { useToast } from "../../components/Toast";
import { apiService } from "../../services/api";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { showToast } = useToast();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getUsers({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchTerm || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      setUsers(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (error) {
      console.error("Failed to load users:", error);
      showToast("Failed to load users. Please try again.", "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.current,
    pagination.pageSize,
    searchTerm,
    statusFilter,
    roleFilter,
    showToast,
  ]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (userData: Record<string, any>) => {
    try {
      await apiService.createUser({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        mobileNumber: userData.mobileNumber,
        role: userData.role,
      });

      setShowCreateModal(false);
      showToast("User created successfully", "success");
      loadUsers(); // Reload the list
    } catch (error: any) {
      console.error("Failed to create user:", error);
      showToast(error.message || "Failed to create user", "error");
    }
  };

  const handleEditUser = async (userData: Record<string, any>) => {
    if (!editingUser) return;

    try {
      await apiService.updateUser(editingUser.id as number, {
        fullName: userData.fullName,
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        role: userData.role,
        status: userData.status,
      });

      setShowEditModal(false);
      setEditingUser(null);
      showToast("User updated successfully", "success");
      loadUsers(); // Reload the list
    } catch (error: any) {
      console.error("Failed to update user:", error);
      showToast(error.message || "Failed to update user", "error");
    }
  };

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      // Delete each selected user
      await Promise.all(
        selectedUsers.map((id) => apiService.deleteUser(id as number)),
      );

      setSelectedUsers([]);
      showToast(
        `${selectedUsers.length} user(s) deleted successfully`,
        "success",
      );
      loadUsers(); // Reload the list
    } catch (error: any) {
      console.error("Failed to delete users:", error);
      showToast(error.message || "Failed to delete users", "error");
    }
  };

  const columns: TableColumn<User>[] = [
    {
      key: "fullName",
      title: "Name",
      sortable: true,
      render: (value, record) => (
        <div className="user-info">
          <div className="user-avatar">
            {record.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <div className="user-name">{record.fullName}</div>
            <div className="user-email">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "mobileNumber",
      title: "Mobile",
      sortable: true,
    },
    {
      key: "role",
      title: "Role",
      sortable: true,
      render: (value) => (
        <span className={`role-badge role-${value}`}>
          {value === "tourist" && "🧳"}
          {value === "admin" && "👑"}
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value) => <StatusBadge status={value} variant="user" />,
    },
    {
      key: "registrationDate",
      title: "Registered",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "lastLogin",
      title: "Last Login",
      sortable: true,
      render: (value) =>
        value ? new Date(value).toLocaleDateString() : "Never",
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, record) => (
        <div className="table-actions">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => {
              setEditingUser(record);
              setShowEditModal(true);
            }}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  const createUserFields: FormField[] = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter full name",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      placeholder: "Enter email address",
    },
    {
      name: "mobileNumber",
      label: "Mobile Number",
      type: "text",
      required: true,
      placeholder: "+234-XXX-XXXX",
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      options: [
        { value: "tourist", label: "🧳 Tourist" },
        { value: "admin", label: "👑 Administrator" },
      ],
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Enter password",
      validation: { min: 6 },
    },
  ];

  const editUserFields: FormField[] = [
    ...createUserFields.filter((field) => field.name !== "password"),
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "active", label: "✅ Active" },
        { value: "inactive", label: "⏸️ Inactive" },
        { value: "suspended", label: "🚫 Suspended" },
      ],
    },
  ];

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="page-title">
          <h1>👥 User Management</h1>
          <p>Manage system users, roles, and permissions</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Add User
          </button>
        </div>
      </div>

      <div className="page-content">
        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                <option value="tourist">Tourist</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="bulk-actions">
              <span>{selectedUsers.length} user(s) selected</span>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDeleteUsers}
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Users Table */}
        <DataTable
          data={users}
          columns={columns}
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedUsers,
            onChange: setSelectedUsers,
          }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) =>
              setPagination((prev) => ({ ...prev, current: page, pageSize })),
          }}
        />
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
        size="medium"
      >
        <FormBuilder
          fields={createUserFields}
          onSubmit={handleCreateUser}
          submitText="Create User"
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        title="Edit User"
        size="medium"
      >
        {editingUser && (
          <FormBuilder
            fields={editUserFields}
            initialValues={editingUser}
            onSubmit={handleEditUser}
            submitText="Update User"
            onCancel={() => {
              setShowEditModal(false);
              setEditingUser(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
