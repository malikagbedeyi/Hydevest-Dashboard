import { Edit3, Check } from "lucide-react";
import "../../../../assets/Styles/dashboard/drilldown.scss";

const EditableField = ({
  label,
  value,
  field,
  editingField,
  setEditingField,
  onChange,
  type = "text",
  format,
  readOnly = false,
}) => {
  const isEditing = editingField === field;

  return (
    <div className="form-group editable">
      <label>{label}</label>

      <div className="editable-wrapper">
        {isEditing && !readOnly ? (
          <>
            <input
              type={type}
              value={value ?? ""}
              onChange={(e) => onChange(field, e.target.value)}
              autoFocus
            />
            <Check
              className="action-icon"
              onClick={() => setEditingField(null)}
            />
          </>
        ) : (
          <>
            <input
              readOnly
              value={format ? format(value) : value ?? "-"}
            />
            {!readOnly && (
              <Edit3
                size={16}
                className="action-icon edit"
                onClick={() => setEditingField(field)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EditableField;