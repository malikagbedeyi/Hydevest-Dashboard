export const PERMISSIONS = {
    USERS: [
      "view_users",        // see list of users
      "create_users",      // add new users
      "edit_users",        // edit user info
      "delete_users",      // remove users
      "invite_users",      // send invites
      "revoke_users",      // revoke access
    ],
  
    ROLES: [
      "view_roles",        // see all roles
      "create_roles",      // add new role
      "edit_roles",        // modify role permissions
      "delete_roles",      // remove role
    ],
  
    INVENTORY: [
      "view_inventory",    // see stock of cow skins
      "add_inventory",     // add new cow skins
      "edit_inventory",    // edit stock details
      "remove_inventory",  // remove stock
      "approve_inventory", // approve stock received
    ],
  
    SALES: [
      "view_sales",        // see all sales
      "create_sales",      // record new sale
      "approve_sales",     // approve sales transactions
      "edit_sales",        // edit sales info
      "delete_sales",      // remove a sale
    ],
  
    FINANCE: [
      "view_finance",      // see financial records
      "create_payment",    // record payment received
      "approve_payment",   // approve payments
      "edit_finance",      // edit financial records
    ],
  
    REPORTS: [
      "view_reports",      // see all reports
      "export_reports",    // export reports
      "generate_reports",  // generate custom reports
    ],
  
    LOGISTICS: [
      "view_shipments",    // see shipment status
      "update_shipments",  // mark shipment as delivered/received
    ],
  
    QUALITY: [
      "inspect_stock",     // inspect quality of cow skins
      "approve_quality",   // approve stock quality
      "reject_quality",    // reject bad stock
    ]
  };
  