import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/create.scss";
import "../../../../assets/Styles/dashboard/table.scss";

const CreateBonus = ({ data, setData, setView }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    salary: "",
  });

  const [bonuses, setBonuses] = useState([]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addBonus = () => {
    setBonuses((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description: "", amount: "" },
    ]);
  };

  const updateBonus = (id, field, value) => {
    setBonuses((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, [field]: value } : b
      )
    );
  };

  const removeBonus = (id) => {
    setBonuses((prev) => prev.filter((b) => b.id !== id));
  };

  const totalBonus = bonuses.reduce(
    (sum, b) => sum + Number(b.amount || 0),
    0
  );

  const handleCreate = () => {
    const newBonus = {
      id: crypto.randomUUID(),
      ...form,
      salary: Number(form.salary),
      bonuses,
      totalBonus,
      createdAt: new Date().toISOString(),
    };

    setData((prev) => [newBonus, ...prev]);
    setView("table");
  };

  /* ================= UI ================= */
  return (
    <div className="trip-modal">
    <div className="create-container-modal">
      <div className="create-container-card">
        <div className="header">
          <h2>Create Bonus</h2>
        </div>

        {/* BASIC INFO */}
        <div className="grid-2">
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Salary</label>
            <input
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              placeholder="Enter salary"
            />
          </div>
        </div>

        {/* BONUS SECTION */}
        <div style={{ marginTop: 20 }}>
          <button className="create" onClick={addBonus}>
            + Add Bonus
          </button>
        </div>

        {bonuses.map((bonus, index) => (
          <div key={bonus.id} className="grid-flex-3" style={{ marginTop: "10",display:"grid",gridTemplateColumns:"2fr 2fr 1fr",gap:"10px" }}>
            <div className="form-group mb-4" >
              <label>Description</label>
              <input
                value={bonus.description}
                onChange={(e) =>
                  updateBonus(bonus.id, "description", e.target.value)
                }
                placeholder="Bonus description"
              />
            </div>
            <div className="form-group mb-4">
              <label>Amount</label>
              <input
                type="number"
                value={bonus.amount}
                onChange={(e) =>
                  updateBonus(bonus.id, "amount", e.target.value)
                }
                placeholder="Bonus amount"
              />
            </div>

            <div className="" style={{ display: "flex", alignItems: "center" }}>
              <button className="create" onClick={() => removeBonus(bonus.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* BONUS PREVIEW TABLE */}
        {bonuses.length > 0 && (
         <div className="userTable">
          <div className="table-wrap">
          <table className="table" style={{ width:"100%",maxWidth:"100%",minWidth:"100%" }}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {bonuses.map((b) => (
                <tr key={b.id}>
                  <td>{b.description}</td>
                  <td>₦{Number(b.amount || 0).toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>₦{totalBonus.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
          </div>
         </div>
        )}

        {/* ACTIONS */}
        <div className="btn-row">
          <button className="cancel" onClick={() => setView("table")}>
            Cancel
          </button>
          <button className="create" onClick={handleCreate}>
            Save Bonus
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateBonus;
