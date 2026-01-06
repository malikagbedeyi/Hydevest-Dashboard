import React, { useState } from 'react';
import { ChevronDown, Filter, Search } from 'lucide-react';
import '../../../assets/Styles/dashboard/account/accountTable.scss';
import { dataTable } from './AccountDataArray';
import ExportAccount from './ExportAccount';

const AccountTable = () => {
  const [showExport, setExport] = useState(false);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [itemPerPage] = useState(10);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const indexOfLastPage = currentPage3 * itemPerPage;
  const indexOfFirstPage = indexOfLastPage - itemPerPage;
  const currentItem = dataTable.slice(indexOfFirstPage, indexOfLastPage);
  const totalItems = dataTable.length;

  const paginate = (pageNumber) => setCurrentPage3(pageNumber);

  const nextPage = () => {
    if (currentPage3 < Math.ceil(totalItems / itemPerPage)) {
      setCurrentPage3(currentPage3 + 1);
    }
  };

  const prevPage = () => {
    if (currentPage3 > 1) {
      setCurrentPage3(currentPage3 - 1);
    }
  };

  const openAccountDetails = (row) => {
    setSelectedAccount(row);
  };

  return (
    <div className="accountTable">
      {/* Top controls: Search, Filter, Export */}
      {/* Account Table */}
      <div className="trip-table-content">
        <div className="trip-table">
          <div className="left-table">
            <div className="table-header">
              <div className="left-tableheader">
                <ul>
                  <li>S/No</li>
                  <li>Title</li>
                </ul>
              </div>
            </div>
            <div className="table-body">
              {currentItem.map((row, index) => (
                <div
                  key={index}
                  className="table-row"
                  onClick={() => openAccountDetails(row)}
                >
                  <div className="tableRow-left">
                    <div className="ul">
                      <p>{row.sn}</p>
                      <p>{row.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="right-table">
            <div className="table-header">
              <div className="right-tableheader">
                <ul>
                  <li>Description</li>
                  <li>Type</li>
                  <li>Amount</li>
                  <li>Rate</li>
                  <li>AmountNGN</li>
                  <li>Date</li>
                  <li>Status</li>
                </ul>
              </div>
            </div>
            <div className="table-body">
              {currentItem.map((row, index) => (
                <div
                  key={index}
                  className="table-row"
                  onClick={() => openAccountDetails(row)}
                >
                  <div className="tableRow-right">
                    <div className="ul">
                      <p>{row.description}</p>
                      <p>{row.type}</p>
                      <p>{row.amount}</p>
                      <p>{row.rate}</p>
                      <p>{row.amountNGN}</p>
                      <p>{row.date}</p>
                      <p>{row.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            className="double-paginateIcon"
            onClick={prevPage}
            disabled={currentPage3 === 1}
          >
            {/* Left double arrow SVG */}
          </button>
          <button onClick={prevPage} disabled={currentPage3 === 1}>
            {/* Left arrow SVG */}
          </button>
          <p>
            <span>{indexOfFirstPage + 1}</span> -{' '}
            <span>{Math.min(indexOfLastPage, totalItems)}</span>
          </p>
          <button
            onClick={nextPage}
            disabled={currentPage3 === Math.ceil(totalItems / itemPerPage)}
          >
            {/* Right arrow SVG */}
          </button>
          <button
            className="double-paginateIcon-right"
            onClick={nextPage}
            disabled={currentPage3 === Math.ceil(totalItems / itemPerPage)}
          >
            {/* Right double arrow SVG */}
          </button>
          <span>
            Showing {indexOfFirstPage + 1} - {Math.min(indexOfLastPage, totalItems)} of{' '}
            {totalItems}
          </span>
        </div>
      </div>

      {/* Export Modal */}
      {showExport && <ExportAccount onCancel={() => setExport(false)} setExport={setExport} />}
    </div>
  );
};

export default AccountTable;
