import { useEffect, useState } from "react";
import AdminDataPage from "../../components/table/AdminDataPage";
import { deleteMedicine, getMedicines } from "../../services/medicines.service";
import { getCategory } from "../../services/category.service";


const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] =useState(false);
  const [filtersState, setFiltersState] = useState(null);

  const [pagination, setPagination] = useState({page: 1, limit: 10, total: 0,});


  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params = filtersState ? { page: pagination.page, limit: pagination.limit, ...filtersState } :
        {page: pagination.page, limit: pagination.limit}
   
      const response = await getMedicines(params);
      setPagination((prev) => ({...prev,total: response.pagination.total}));
      setMedicines(response.medicines);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    setLoading(true)
    try {
      const response = await getCategory()
      setCategory(response.categories.map(cat => {
        return {value :cat._id ,label:cat.name}
      }))
      
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false)
    }
  }

  const fetchDeactivatedMedicine = async (id) => {
    setLoading(true)
    try {
      const response = await deleteMedicine(id)
      console.log(response);
      fetchMedicines()
      
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicines();
    fetchCategory()
  }, []);
  useEffect(() => {
    const fetchMedicinesPage = async () => {
      setLoading(true);
      try {
        const params = filtersState ? { page: pagination.page, limit: pagination.limit, ...filtersState } :
          {page: pagination.page, limit: pagination.limit}
    
        const response = await getMedicines(params);
        setMedicines(response.medicines);

      } catch (error) {
        console.error(error);

      } finally {
        setLoading(false);
      }
      };
    fetchMedicinesPage()
  }, [pagination]);


  const filters = [
    {
      name: "search",
      label: "Search",
      type: "text",
      placeholder: "Search medicine...",
      value: filtersState?.search,
      col: "col-12 col-md-6 col-lg-4",
    },

    {
      name: "manufacturer",
      label: "Manufacturer",
      type: "text",
      placeholder: "Manufacturer...",
      value:filtersState?.manufacturer,
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "category",
      label: "category",
      type: "select",
      value:filtersState?.category,
      col: "col-12 col-md-6 col-lg-3",
      options: [
        {
          value: 'undefined', 
          label:'All'
        },
        ...category
      ]
    },
    {
      name: "isActive",
      label: "Status",
      type: "select",
      value: filtersState?.isActive,
      options: [
        {
          value: 'undefined',
          label: "All",
        },
        {
          value: "true",
          label: "Active",
        },
        {
          value: "false",
          label: "Inactive",
        },
      ],
      col: "col-12 col-md-6 col-lg-2",
    },
  ];

  
  const handleFilter = (name, value) => {
    value === 'undefined' ? value = undefined : value = value
    setFiltersState((prev) => ({...prev,[name]: value }));
    setPagination((prev) => ({...prev,page: 1,}));
  };


  const columns = [
    {
      key: "name",
      label: "Medicine",
    },

    {
      key: "genericName",
      label: "Generic Name",
    },

    {
      key: "manufacturer",
      label: "Manufacturer",
    },
    {
      key: "category",
      label: "category",
      render: (medicine) => (
        <span >
          {medicine?.category?.name}
        </span>
      ),
    },

    {
      key: "isActive",
      label: "Status",

      render: (medicine) => (
        <span
          className={`badge ${
            medicine.isActive
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {medicine.isActive
            ? "Active"
            : "Inactive"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      type: "show",
      label: "Show",
      link: (medicine) => `/medicines/${medicine._id}`,
      onClick: (medicine,index) =>  console.log("Show:", medicine, index) 
    },

    {
      type: "edit",
      label: "Edit",
      link: (medicine) => `/medicines/edit/${medicine._id}`,
      onClick: (medicine) => console.log( "Edit:", medicine)
    },

    {
      type: "delete",
      label: "Delete",
      onClick: (medicine) =>  fetchDeactivatedMedicine(medicine._id)
    }
  ]

 return (
    
    <AdminDataPage
      title="Medicines"
      subtitle="Manage your medicines and inventory"
      loading={loading}
      filters={filters}
      columns={columns}
      type="add"
      addLink="/add-medicine"
      data={medicines}
      onFilter={handleFilter}
      actions={actions}
      pagination={pagination}
      filtering = {fetchMedicines}
      onPageChange={(page) => {
        setPagination((prev) => ({
          ...prev,
          page,
        }));
      }}
    />
  )
};

export default Medicines;