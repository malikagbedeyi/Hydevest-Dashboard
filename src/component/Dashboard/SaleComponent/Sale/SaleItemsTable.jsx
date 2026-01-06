import { Trash2, Edit3 } from "lucide-react";

const SaleItemsTable = ({ items = [], onDelete, onEdit }) => {
  if (items.length === 0) return null;

  const formatDateTime = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };
  
  return (
    <div className="userTable mt-3">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Container</th>
              <th>Pieces</th>
              <th>No. of Pallets</th>
              <th>Pallet Option</th>
              <th>Sale Amount</th>
              <th>Action</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {items.map((row, idx) => (
              <tr key={row.palletId}>
                <td>{idx + 1}</td>
                <td>{row.containerName}</td>
                <td>{row.pieces}</td>
                <td>{row.saleAmount}</td>
                <td>{row.palletOption}</td>
                <td>{row.total}</td>
                <td>
                <button
                    className="edit-btn"
                    onClick={() => onEdit(row)}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(row)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
                <td>{formatDateTime(row.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaleItemsTable;

