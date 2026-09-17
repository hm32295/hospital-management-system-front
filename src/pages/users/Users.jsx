import { useEffect, useState } from "react";
import AdminDataPage from "../../components/table/AdminDataPage";
import { deleteUser, getAllUsers } from "../../services/auth.service";
 ///search, isActive
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] =useState(false);
  const [pagination, setPagination] = useState({limit: 10, page: 1, total: 0,});
  const [filtersState, setFiltersState] = useState(null);

  const fetchUsers = async () => {
       const params = filtersState ? { page: pagination.page, limit: pagination.limit, ...filtersState } :
        {page: pagination.page, limit: pagination.limit}


    setLoading(true);
    try {
      const response = await getAllUsers(params);
      setUsers( response.users );
      setPagination((prev) => ({...prev,...(response.pagination || {})}));

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  const fetchDeactivatedUser = async (id) => {
    setLoading(true)
    try {
      const response = await deleteUser(id)
      console.log(response);
      fetchUsers()
      
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers();
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
      name: "role",
      label: "role",
      type: "select",
      value: filtersState?.role,
      col: "col-12 col-md-6 col-lg-4",
      options: [
        { value: 'admin', label: 'admin' },
        { value: 'patient', label: 'Patient' },
        { value: 'doctor', label: 'doctor' },
        { value: 'pharmacy', label: 'pharmacy' },
      ]
    },
    {
      name: "isActive",
      label: "is Active",
      type: "select",
      placeholder: "expiry Status...",
      value: filtersState?.isActive,
      col: "col-12 col-md-6 col-lg-4",
      options: [
        {
          value: 'undefined', 
          label:'All'
        },
        {
          value: true, 
          label:'active'
        },
      
        {
          value: false, 
          label:'no active'
        }
      
      ]
    },


   
  ];

  
  const handleFilter = (name, value) => {
    if(value === 'undefined') value = undefined
    setFiltersState((prev) => ({...prev,[name]: value }));
    setPagination((prev) => ({...prev,page: 1,}));
  };



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
      key: "role",
      label: "role",
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
      link: (users) => `/users/${users._id}`
    },

    {
      type: "edit",
      label: "Edit",
      link: (user) => `/users/edit/${user._id}`,
    },

    {
      type: "delete",
      label: "Delete",
      onClick: (user) =>  fetchDeactivatedUser(user._id)
    }
  ]

 return (
    
    <AdminDataPage
      title="Users"
      subtitle="Manage your Users and inventory"
      loading={loading}
      columns={columns}
      data={users}
      actions={actions}
      filtering={fetchUsers}
      filters={filters}
      onFilter={handleFilter}
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

export default Users;