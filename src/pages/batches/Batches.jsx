import { useEffect, useState } from "react";
import AdminDataPage from "../../components/table/AdminDataPage";
import { getBatches } from "../../services/batches.service";
import { deleteBatch } from "../../services/batches.service";
import BarcodeModal from "../../components/barcode/BarcodeModal";
import { Barcode } from "lucide-react";

 // search, medicine, expiryStatus, page = 1, limit = 100
const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [filtersState, setFiltersState] = useState(null);
  const [pagination, setPagination] = useState({page: 1, limit: 10, total: 0});
  // barcode 
  const [showBarcode, setShowBarcode] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const handleShowBarcode = (batch) => {
    setSelectedBatch(batch);
    setShowBarcode(true);
  };

  const handleCloseBarcode = () => {
    setShowBarcode(false);
    setSelectedBatch(null);
  };
  const fetchBatches = async () => {
        const params = filtersState ? { page: pagination.page, limit: pagination.limit, ...filtersState } :
        {page: pagination.page, limit: pagination.limit}

   
    setLoading(true)
    try {
      const response = await getBatches(params)
      setBatches(response.batches)
      setPagination((prev)=> ({...prev ,...response.pagination}))
      
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false)
    }
  }

  const fetchDeactivatedBatches = async (id) => {
    setLoading(true)
    try {
      const response = await deleteBatch(id)
      console.log(response);
      fetchBatches()
      
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBatches()
  }, []);
  useEffect(() => {
      const fetchBatchesPagination = async () => {
        const params = filtersState ? { page: pagination.page, limit: pagination.limit, ...filtersState } :
        {page: pagination.page, limit: pagination.limit}

   
    setLoading(true)
    try {
      const response = await getBatches(params)
      setBatches(response.batches)
      
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false)
    }
    }
    fetchBatchesPagination()
  }, [pagination.page]);


  const filters = [
    {
      name: "search",
      label: "Search",
      type: "text",
      placeholder: "Search batch...",
      value: filtersState?.search,
      col: "col-12 col-md-6 col-lg-4",
    },
    {
      name: "expiryStatus",
      label: "expiry Status",
      type: "select",
      placeholder: "expiry Status...",
      value: filtersState?.expiryStatus,
      col: "col-12 col-md-6 col-lg-4",
      options: [
        {
          value: 'undefined', 
          label:'All'
        },
        {
          value: 'expired', 
          label:'expired'
        },
      
        {
          value: 'valid', 
          label:'valid'
        },
        {
          value: 'near', 
          label:'near'
        },
      
      ]
    },
   
  ];

  
  const handleFilter = (name, value) => {
    value === 'undefined' ? value = undefined : value = value
    setFiltersState((prev) => ({...prev,[name]: value }));
    setPagination((prev) => ({...prev,page: 1}));
  };


  const columns = [
    {
        key: "medicine", label: "M name",
          render: (batch) => {
            return batch.medicine.name
        }
    
    },
    {
        key: "genericName", label: "MGN",
          render: (batch) => {
            return batch.medicine.genericName
        }

    },
    {
        key: "manufacturer", label: "M manufacturer",
          render: (batch) => {
            return batch.medicine.manufacturer
        }
    
    },
    { key: "batchNumber", label: "Batch Number"  },
    { key: "quantity", label: "quantity"  },
    { key: "expiryDate", label: "expiry Date"  },
    { key: "purchasePrice", label: "purchase Price"  },
    { key: "sellingPrice", label: "selling Price"  },
    
  {
    key: "barcodeValue",
    label: "Barcode",
    render: (batch) => (
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => handleShowBarcode(batch)}
        title="View Barcode"
      >
        <Barcode size={20} />
      </button>
    ),
  },

    {
    key: "isActive",
    label: "status",
        render: (Batches) => {
        return (
        <span className={`badge ${Batches.isActive ? "text-bg-success" : "text-bg-danger" }`}>
            {Batches.isActive  ? "Active"  : "Inactive"}
        </span>
        )
    }
    },

  ];

  const actions = [
    {
      type: "show",
      label: "Show",
      link: (batch) => `/batches/${batch._id}`,
     
    },

    {
      type: "edit",
      label: "Edit",
      link: (batch) => `/batches/edit/${batch._id}`
    },

    {
      type: "delete",
      label: "Delete",
      onClick: (batch) =>  fetchDeactivatedBatches(batch._id)
    }
  ]

 return (
    <>
      <AdminDataPage
        title="Batches"
        subtitle="Manage your Batches and inventory"
        loading={loading}
        columns={columns}
        type="add"
        addLink="/add-Batches"
        data={batches}
        actions={actions}
        pagination={pagination}
        filtering={fetchBatches}
        filters={filters}
        onFilter={handleFilter}
        onPageChange={(page) => {
          setPagination((prev) => ({
            ...prev,
            page,
          }));
        }}
      
     />
     
     <BarcodeModal
        show={showBarcode}
        onClose={handleCloseBarcode}
        batch={selectedBatch}
      />
    </>
  )
};

export default Batches;