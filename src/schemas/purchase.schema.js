import * as Yup from "yup";

export const purchaseSchema = Yup.object({
  supplier: Yup.string()
    .required("supplier is required"),
  invoiceNumber: Yup.string()
    .required("invoice Number is required"),
  purchaseDate: Yup.string()
        .required("purchase Date is required"),
  
        // medicine:Yup.string()
        //     .required("medicine is required"),
    items: Yup.array().of(
        Yup.object().shape({
            medicine:Yup.string()
                .required("medicine is required"),
            expiryDate:Yup.string()
                .required("expiry Date is required"),
            quantity:Yup.string()
                .required("quantity is required"),
            batchNumber:Yup.string()
                .required("batch Number is required"),
            purchasePrice:Yup.string()
                .required("purchase Price is required"),
            sellingPrice:Yup.string()
                .required("selling Price is required"),
      })
  ).min(1,'the one medicine or more than ')
  

});
 