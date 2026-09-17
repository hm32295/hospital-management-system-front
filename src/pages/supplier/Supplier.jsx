import { useEffect, useState } from "react";
import AdminDataPage from "../../components/table/AdminDataPage";
import { deleteSupplier, getSuppliers } from "../../services/supplier.service";


const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] =useState(false);
  const [pagination ,setPagination] = useState({limit: 10 , page:1, total : 0})

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const response = await getSuppliers({page:pagination.page, limit:pagination.limit})
      setSuppliers(response.suppliers)
      setPagination((prev)=>({...prev, ...response.pagination}))
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false)
    }
  }

  const fetchDeactivatedSupplier = async (id) => {
    setLoading(true)
    try {
      const response = await deleteSupplier(id)
      console.log(response);
      fetchSuppliers()
      
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [pagination.page]);



  const columns = [
    {
      key: "name",
      label: "name",
    },
    {
      key: "email",
      label: "email",
    },
    {
      key: "phone",
      label: "phone",
    },
    {
      key: "address",
      label: "address",
    },
    {
    key: "isActive",
    label: "status",
        render: (supplier) => {
        return (
        <span className={`badge ${supplier.isActive ? "text-bg-success" : "text-bg-danger" }`}>
            {supplier.isActive  ? "Active"  : "Inactive"}
        </span>
        )
    }
    },

  ];

  const actions = [
    {
      type: "show",
      label: "Show",
      link: (supplier) => `/suppliers/${supplier._id}`,
     
    },

    {
      type: "edit",
      label: "Edit",
      link: (supplier) => `/suppliers/edit/${supplier._id}`
    },

    {
      type: "delete",
      label: "Delete",
      onClick: (supplier) =>  fetchDeactivatedSupplier(supplier._id)
    }
  ]

 return (
    
    <AdminDataPage
      title="supplier"
      subtitle="Manage your supplier and inventory"
      loading={loading}
      columns={columns}
      type="add"
      addLink="/add-suppliers"
      data={suppliers}
     actions={actions}
      pagination={pagination}
      onPageChange={(page) => {
        setPagination((prev) => ({
          ...prev,
          page,
        }));
      }}
     
    />
  )
};

export default Suppliers;