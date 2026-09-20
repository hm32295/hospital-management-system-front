
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSelect from "../../components/form/FormSelect";
import {
  getSupplierById,
  updateSupplier,
} from "../../services/supplier.service";
import { supplierSchema } from "../../schemas/supplire.schema";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const supplierResponse =
          await getSupplierById(id);

        setSupplier(supplierResponse.supplier);
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("suppliers.loadFailed")
          )
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: supplier?.name || "",
      email: supplier?.email || "",
      phone: supplier?.phone || "",
      address: supplier?.address || "",
      isActive: supplier?.isActive ?? true,
    },
    validationSchema: supplierSchema(t),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await updateSupplier(id, values);

        showSuccess(t("suppliers.updatedSuccess"));

        navigate("/suppliers");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("suppliers.updateFailed")
          )
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) {
    return (
      <div>
        <Header
          title={t("suppliers.editSupplier")}
          description={t(
            "suppliers.editSupplierDescription"
          )}
          buttonContent={t(
            "suppliers.backToSuppliers"
          )}
          buttonLink="/suppliers"
        />

        <div className="card border-0 shadow-sm">
          <div className="card-body p-5">
            <div className="d-flex justify-content-center">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  {t("common.loading")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={t("suppliers.editSupplier")}
        description={t(
          "suppliers.editSupplierDescription"
        )}
        buttonContent={t(
          "suppliers.backToSuppliers"
        )}
        buttonLink="/suppliers"
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="name"
                  label={t("suppliers.supplierName")}
                  type="text"
                  placeholder={t(
                    "suppliers.namePlaceholder"
                  )}
                  required
                />

                <FormInput
                  formik={formik}
                  name="phone"
                  label={t("suppliers.phone")}
                  type="text"
                  placeholder={t(
                    "suppliers.phonePlaceholder"
                  )}
                  required
                />

                <FormInput
                  formik={formik}
                  name="address"
                  label={t("suppliers.address")}
                  type="text"
                  placeholder={t(
                    "suppliers.addressPlaceholder"
                  )}
                  required
                />

                <FormInput
                  formik={formik}
                  name="email"
                  label={t("suppliers.email")}
                  type="email"
                  placeholder={t(
                    "suppliers.emailPlaceholder"
                  )}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormSelect
                  formik={formik}
                  name="isActive"
                  label={t("suppliers.status")}
                  options={[
                    {
                      value: true,
                      label: t("suppliers.active"),
                    },
                    {
                      value: false,
                      label: t("suppliers.inactive"),
                    },
                  ]}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() =>
                  navigate("/suppliers")
                }
                disabled={formik.isSubmitting}
              >
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  formik.isSubmitting || loading
                }
              >
                {formik.isSubmitting
                  ? t("suppliers.updating")
                  : t("suppliers.updateSupplier")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSupplier;