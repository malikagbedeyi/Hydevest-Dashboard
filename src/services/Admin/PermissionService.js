import api from "../api";

const PermissionService = {
  listPermissions: async ({ search = "", page = 1 } = {}) => {
    const res = await api.get(
      "/systemuser/roleandperm/permissions/list",
      {
        params: {
          search_name: search,
          page,
        },
      }
    );
    console.log(res.data)
    return {
      data: res.data?.record?.data || [],
      meta: {
        current_page: res.data?.record?.current_page,
        last_page: res.data?.record?.last_page,
        total: res.data?.record?.total,
      },
    };
  },
  createPermission: async (data) => {
    const formData = new URLSearchParams();
    formData.append("name", data.name);
    formData.append("details", data.details || "");

    await api.post(
      "/systemuser/roleandperm/permission/create",
      formData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
  },
  editPermission: async (data) => {
    const formData = new URLSearchParams();
  
    formData.append("perm_uuid", data.perm_uuid);
    formData.append("name", data.name);
    formData.append("details", data.details || "");
    formData.append("status", data.status ?? 1); // 🔥 REQUIRED
  
    await api.post(
      "/systemuser/roleandperm/permission/edit",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  },

  getPermissionLogs: async ({
    page = 1,
    perm_uuid = "",
    from_date = "",
    to_date = "",
    date_created = "",
    user_uuid = "",
  } = {}) => {
    const res = await api.get(
      "/systemuser/roleandperm/permissions/logs",
      { headers: {
        "Content-Type": "application/json",
        } },
      {
        params: {
          page,
          perm_uuid,
          from_date,
          to_date,
          date_created,
          user_uuid,
        },
      }
    );
    return {
        
      data: res.data?.record?.data || [],
      meta: {
        current_page: res.data?.record?.current_page,
        last_page: res.data?.record?.last_page,
        total: res.data?.record?.total,
      },
    };

  },
  getAssignList: async ({ role_uuid, search_name = "" }) => {
    const res = await api.get(
      "/systemuser/roleandperm/assign/list",
      {
        params: { role_uuid, search_name },
      }
    );
  
    return res.data?.record || [];
  },
  
  assignPermissions: async ({ role_uuid, perm_uuids }) => {
    const formData = new URLSearchParams();
    formData.append("role_uuid", role_uuid);
    formData.append("perm_uuids", perm_uuids.join(","));
  
    await api.post(
      "/systemuser/roleandperm/assign/permissions",
      formData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
  },
  
  unassignPermissions: async ({ role_uuid, perm_uuids }) => {
    const formData = new URLSearchParams();
    formData.append("role_uuid", role_uuid);
    formData.append("perm_uuids", perm_uuids.join(","));
  
    await api.post(
      "/systemuser/roleandperm/unassign/permissions",
      formData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
  },
  
};

export default PermissionService;
