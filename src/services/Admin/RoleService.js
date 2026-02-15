import api from "../api";

const RoleService = {
  listRoles: async ({ search = "", page = 1 } = {}) => {
    try {
      const res = await api.get(
        "/systemuser/roleandperm/roles/list",
        {
          params: {
            search_name: search,
            page,
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
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },

  createRole: async (roleData) => {
    try {
      const formData = new URLSearchParams();
      formData.append("name", roleData.name);
      formData.append("details", roleData.details || "");

      await api.post(
        "/systemuser/roleandperm/role/create",
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
    } catch (error) {
      throw error;
    }
  },

  deleteRole: async (role_uuid) => {
    try {
      await api.post("/systemuser/roleandperm/role/delete", { role_uuid });
    } catch (error) {
      throw error;
    }
  },

  editRole: async (roleData) => {
    try {
      const formData = new URLSearchParams();
      formData.append("role_uuid", roleData.role_uuid);
      formData.append("name", roleData.name);
      formData.append("details", roleData.details || "");

      await api.post(
        "/systemuser/roleandperm/role/edit",
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
    } catch (error) {
      throw error;
    }
  },
  getRoleLogs: async ({ page = 1, role_uuid = "", user_uuid = "", from_date = "", to_date = "", date_created = "", } = {}) => {
    try {
      const res = await api.get(
        "/systemuser/roleandperm/roles/logs",
        { headers: {
           "Content-Type": "application/json",
           } },
        {
          params: { page, role_uuid, user_uuid, from_date, to_date,date_created, },
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
    } catch (error) {
      console.error("Error fetching role logs:", error);
      throw error;
    }
  },
  
  
};

export default RoleService;
