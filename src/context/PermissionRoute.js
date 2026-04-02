import React from 'react';
import PageNotFound from '../component/Dashboard/PageNotFound'; 

const PermissionRoute = ({ children, permission }) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const isSuperuser = userData?.is_superuser === 1;
  const userPermissions = userData?.permissions?.map(p => p.name) || [];

  if (isSuperuser) return children;

  const hasPermission = userPermissions.includes(permission);

  if (!hasPermission) {
    return <PageNotFound />;
  }

  return children;
};

export default PermissionRoute;