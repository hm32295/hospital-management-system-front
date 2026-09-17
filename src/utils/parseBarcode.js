const generateMedicineName = (medicineId) => {
  if (!medicineId) {
    return "Unknown Medicine";
  }

  return `Medicine-${medicineId.slice(-6).toUpperCase()}`;
};

const parseBarcode = (barcodeValue) => {
  if (!barcodeValue || typeof barcodeValue !== "string") {
    return null;
  }

  try {
    const parts = barcodeValue.split("|");

    const data = {};

    parts.forEach((part) => {
      const [key, ...valueParts] = part.split("=");

      if (!key || valueParts.length === 0) {
        return;
      }

      data[key.trim()] = valueParts.join("=").trim();
    });

    // Required data
    if (!data.MED || !data.BATCH || !data.EXP || !data.PRICE) {
      return null;
    }

    const price = Number(data.PRICE);

    if (!Number.isFinite(price) || price < 0) {
      return null;
    }

    // Medicine name
    const medicineName =
      data.NAME && data.NAME.trim()
        ? data.NAME.trim()
        : generateMedicineName(data.MED);

    return {
      medicine: data.MED,
      batch: data.BATCH,
      expiryDate: data.EXP,
      unitPrice: price,

      name: medicineName,

      genericName:
        data.GENERIC && data.GENERIC.trim()
          ? data.GENERIC.trim()
          : "",
    };

  } catch (error) {
    console.error("Parse barcode error:", error);

    return null;
  }
};

export default parseBarcode;