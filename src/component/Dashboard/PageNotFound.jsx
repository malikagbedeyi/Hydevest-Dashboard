import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import '../../assets/Styles/dashboard/PageNotFound.scss';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page-not-found">
      <div className="not-found-content">
        <div className="icon-wrapper">
          <FileQuestion strokeWidth={1.5} />
          <h1 className="error-code">404</h1>
        </div>
        
        <h2>Oops! Page Not Found</h2>
        <p>
          The page you are looking for might have been removed, 
          had its name changed, or you might not have the 
          required permission to view it.
        </p>

        <div className="btn-row">
          <button className="preview" onClick={() => navigate(-1)}>
            <ArrowLeft />
            <span>Go Back</span>
          </button>
          
          {/* <button className="create" onClick={() => navigate('/dashboard/overview')}>
            <Home />
            <span>Overview</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;