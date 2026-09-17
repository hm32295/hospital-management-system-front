
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Package,
  X,
  Loader2,
} from "lucide-react";

import { getBatches } from "../../services/batches.service";

import "./medicineManualSelector.css";

const MedicineManualSelector = ({ onAdd }) => {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const value = search.trim();

    if (!value || value.length < 2) {
      setOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await getBatches({
          search: value,
          isActive: true,
          expiryStatus: "valid",
          quantity: "available",
          page: 1,
          limit: 20,
        });

        const batches = response.batches || [];

        setOptions(batches);
      } catch (error) {
        console.error(
          "Failed to search medicine batches:",
          error
        );

        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSelectBatch = (batch) => {
    if (!batch) return;

    setSelectedBatch(batch);
    setSearch("");
    setOptions([]);
  };

  const handleAdd = () => {
    if (!selectedBatch) return;

    if (!selectedBatch.medicine?._id) {
      console.error("Medicine not found");
      return;
    }

    if (!selectedBatch.isActive) {
      console.error("This batch is inactive");
      return;
    }

    if (
      new Date(selectedBatch.expiryDate) <
      new Date()
    ) {
      console.error(
        "This medicine batch has expired"
      );
      return;
    }

    if (Number(selectedBatch.quantity) <= 0) {
      console.error(
        "This batch is out of stock"
      );
      return;
    }

    const unitPrice =
      Number(selectedBatch.sellingPrice) || 0;

    const medicine = {
      medicine: selectedBatch.medicine._id,

      batch: selectedBatch._id,

      name:
        selectedBatch.medicine.name ||
        `Medicine-${selectedBatch.medicine._id.slice(-6)}`,

      genericName:
        selectedBatch.medicine.genericName || "",

      batchNumber:
        selectedBatch.batchNumber || "-",

      expiryDate:
        selectedBatch.expiryDate,

      unitPrice,

      availableQuantity:
        Number(selectedBatch.quantity) || 0,

      quantity: 1,

      total: unitPrice,
    };

    onAdd(medicine);

    setSelectedBatch(null);
    setSearch("");
    setOptions([]);
  };

  const handleClear = () => {
    setSearch("");
    setSelectedBatch(null);
    setOptions([]);
  };

  return (
    <div className="manual-medicine-selector">
      <div className="manual-selector-header">
        <div className="manual-selector-title">
          <Package size={20} />

          <div>
            <h5>
              Add Medicine Manually
            </h5>

            <span>
              Search medicine or batch number
            </span>
          </div>
        </div>
      </div>

      <div className="manual-search-wrapper">
        <Search
          size={19}
          className="manual-search-icon"
        />

        <input
          type="text"
          className="form-control manual-search-input"
          placeholder="Search by medicine name, generic name or batch..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedBatch(null);
          }}
        />

        {loading && (
          <Loader2
            size={18}
            className="manual-search-loading"
          />
        )}

        {(search || selectedBatch) && !loading && (
          <button
            type="button"
            className="manual-clear-btn"
            onClick={handleClear}
            title="Clear"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {search.trim().length > 0 &&
        search.trim().length < 2 && (
          <div className="manual-search-hint">
            Type at least 2 characters
          </div>
        )}

      {search.trim().length >= 2 &&
        !selectedBatch && (
          <div className="manual-search-results">
            {loading ? (
              <div className="manual-no-results">
                <Loader2
                  size={28}
                  className="manual-loading-icon"
                />

                <span>
                  Searching...
                </span>
              </div>
            ) : options.length === 0 ? (
              <div className="manual-no-results">
                <Package size={32} />

                <span>
                  No available medicine found
                </span>
              </div>
            ) : (
              options.map((batch) => (
                <button
                  type="button"
                  className="manual-result-item"
                  key={batch._id}
                  onClick={() =>
                    handleSelectBatch(batch)
                  }
                >
                  <div className="manual-result-info">
                    <strong>
                      {batch.medicine?.name ||
                        `Medicine-${batch.medicine?._id?.slice(-6)}`}
                    </strong>

                    {batch.medicine?.genericName && (
                      <span>
                        {batch.medicine.genericName}
                      </span>
                    )}
                  </div>

                  <div className="manual-result-meta">
                    <span>
                      Batch:{" "}
                      {batch.batchNumber || "-"}
                    </span>

                    <span>
                      Price:{" "}
                      {Number(
                        batch.sellingPrice
                      ).toFixed(2)}{" "}
                      EGP
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

      {selectedBatch && (
        <div className="manual-selected-medicine">
          <div className="manual-selected-info">
            <div className="manual-selected-icon">
              <Package size={20} />
            </div>

            <div>
              <strong>
                {selectedBatch.medicine?.name ||
                  `Medicine-${selectedBatch.medicine?._id?.slice(-6)}`}
              </strong>

              {selectedBatch.medicine
                ?.genericName && (
                <span>
                  {
                    selectedBatch.medicine
                      .genericName
                  }
                </span>
              )}

              <span>
                Batch:{" "}
                {selectedBatch.batchNumber || "-"}
              </span>
            </div>
          </div>

          <div className="manual-selected-price">
            <span>
              Selling Price
            </span>

            <strong>
              {Number(
                selectedBatch.sellingPrice
              ).toFixed(2)}{" "}
              EGP
            </strong>
          </div>

          <button
            type="button"
            className="btn btn-primary manual-add-btn"
            onClick={handleAdd}
          >
            <Plus size={18} />
            Add
          </button>

          <button
            type="button"
            className="manual-clear-btn"
            onClick={handleClear}
            title="Clear selection"
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicineManualSelector;