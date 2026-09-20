import * as Yup from "yup";

export const purchaseSchema = (t) =>
  Yup.object({
    supplier: Yup.string().required(
      t?.("validation.supplierRequired") ||
        "supplier is required"
    ),

    invoiceNumber: Yup.string().required(
      t?.("validation.invoiceNumberRequired") ||
        "invoice Number is required"
    ),

    purchaseDate: Yup.string().required(
      t?.("validation.purchaseDateRequired") ||
        "purchase Date is required"
    ),

    items: Yup.array()
      .of(
        Yup.object().shape({
          medicine: Yup.string().required(
            t?.("validation.medicineRequired") ||
              "medicine is required"
          ),

          expiryDate: Yup.string().required(
            t?.("validation.expiryDateRequired") ||
              "expiry Date is required"
          ),

          quantity: Yup.string().required(
            t?.("validation.quantityRequired") ||
              "quantity is required"
          ),

          batchNumber: Yup.string().required(
            t?.("validation.batchNumberRequired") ||
              "batch Number is required"
          ),

          purchasePrice: Yup.string().required(
            t?.("validation.purchasePriceRequired") ||
              "purchase Price is required"
          ),

          sellingPrice: Yup.string().required(
            t?.("validation.sellingPriceRequired") ||
              "selling Price is required"
          ),
        })
      )
      .min(
        1,
        t?.("validation.oneMedicineRequired") ||
          "the one medicine or more than "
      ),
  });
