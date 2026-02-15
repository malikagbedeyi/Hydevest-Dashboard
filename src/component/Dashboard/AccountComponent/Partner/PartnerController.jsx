import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import CreatePartner from "./CreatePartner";
import PartnerTable from "./PartnerTable";
import { PartnerService } from "../../../../services/Account/PartnerService";
import "../../../../assets/Styles/dashboard/controller.scss";

const PartnerController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const [view, setView] = useState("table");
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [selectedPartner, setSelectedPartner] = useState(null);

  const fetchPartners = async (pageNum = page) => {
    try {
      setLoading(true);
      const res = await PartnerService.list({
        search_email: search,
        page: pageNum,
      });
      setPartners(res.data?.record?.data || []);
      setPagination(res.data?.record || {});

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* Debounced search */
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchPartners(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    fetchPartners(page);
  }, [page]);

  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate]);

  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">
          {(view === "empty" || view === "table") && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />

                <div className="right-wrapper">
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input
                      type="text"
                      placeholder="Search with Email"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="select-input">
                    <div className="filter">
                      <span>Add Filter</span>
                      <Filter />
                    </div>
                  </div>

                  <div className="select-input">
                    <div className="select-input-field">
                      <span>All Field</span>
                      <ChevronDown />
                    </div>
                  </div>

                  <button onClick={() => setView("create")}>
                    Create Partner
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="main-content">
            {view === "table" && (
              <PartnerTable
                data={partners}
                loading={loading}
                page={page}
                setPage={setPage}
                pagination={pagination}
                onEdit={(partner) => {
                  setSelectedPartner(partner);
                  setView("edit");
                }}
              />
            )}

            {view === "create" || view === "edit" ? (
              <CreatePartner
                mode={view === "edit" ? "edit" : "submenu"}
                data={selectedPartner}
                setView={setView}
                openSubmenu={openSubmenu}
                onSuccess={fetchPartners}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerController;
