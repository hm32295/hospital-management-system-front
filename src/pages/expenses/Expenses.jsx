
import { useEffect, useState } from "react";
import { getAllExpenses } from "../../services/expense.service";
import AdminDataPage from "../../components/table/AdminDataPage";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 10});
  const [filtersState, setFiltersState] = useState({});

  const fetchExpenses = async () => {
 try {
setLoading(true); setServerError("");
const response = await getAllExpenses({page: pagination.page,limit: pagination.limit,...filtersState});
setExpenses(response.expenses || []);
setPagination((prev) => ({ ...prev, ...(response.pagination || {}), }));
 }
 catch (error) { setServerError(error.response?.data?.message || "Failed to load expenses"); }
 finally { setLoading(false); }
  };

  useEffect(() => {
 fetchExpenses();
  }, [pagination.page]);

  const handleFilter = (name, value) => {
 setFiltersState((prev) => ({ ...prev, [name]: value || undefined, }));
 setPagination((prev) => ({...prev,page: 1, }));
  };

  const filters = [
    {
      name: "status",
      label: "Status",
      type: "select",
      value: filtersState.status,
      options: [
        { value: undefined, label: "All" },
        { value: "completed",label: "Completed",},
        { value: "cancelled",label: "Cancelled",},
        ],
      col: "col-12 col-md-6 col-lg-3",
    },
      {
      name: "category",
      label: "Category",
      type: "select",
        value: filtersState.category,
      // "supplies", "maintenance", "transportation", "utilities", "salary", "other"
        options: [
          { value: undefined,label: "All"},
          { value: "transportation",label: "transportation",},
          { value: "salary", label: "salary", },
          { value: "utilities", label: "Utilities", },
          { value: "maintenance", label: "Maintenance", },
          { value: "supplies", label: "Supplies", },
          { value: "other", label: "Other", },
              ],
      col: "col-12 col-md-6 col-lg-3",
          },
        {
      name: "fromDate",
      label: "From Date",
      type: "date",
      value: filtersState.fromDate,
      col: "col-12 col-md-6 col-lg-3",
          },
        {
      name: "toDate",
      label: "To Date",
      type: "date",
      value: filtersState.toDate,
      col: "col-12 col-md-6 col-lg-3",
          },
  ];

  const columns = [ {key: "createdAt",label: "Date",render: (expense) =>  expense.createdAt ? new Date(expense.createdAt).toLocaleDateString(  "en-GB") : "-", }, {key: "category",label: "Category",render: (expense) => (  <span className="text-capitalize"> {expense.category || "-"}  </span>), }, {key: "description",label: "Description",render: (expense) =>  expense.description || "-", }, {key: "amount",label: "Amount",render: (expense) => (  <strong> {Number(expense.amount || 0).toFixed(2)} EGP  </strong>), }, {key: "createdBy",label: "Created By",render: (expense) =>  expense.createdBy?.name || "-", }, {key: "status",label: "Status",render: (expense) => (  <span className={`badge ${expense.status === "completed"  ? "text-bg-success"  : "text-bg-secondary" }`}  > {expense.status || "-"}  </span>), },
  ];

  return (
    <AdminDataPage
      title="Expenses"
      subtitle="View pharmacy expenses"
      type="Add" addLink="/expenses/add"
      data={expenses}
      columns={columns}
      loading={loading}
      filters={filters}
      onFilter={handleFilter}
      filtering={fetchExpenses}
      pagination={pagination}
      onPageChange={(page) => setPagination((prev) => ({ ...prev, page, }))}
      emptyMessage={serverError || "No expenses found"}
 />
  );
};

export default Expenses;
