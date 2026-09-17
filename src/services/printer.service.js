import qz from "qz-tray";

export const connectPrinter = async () => {
  try {
    if (!qz.websocket.isActive()) {
      await qz.websocket.connect();
    }

    console.log(" QZ Tray connected");

    return true;
  } catch (error) {
    console.error(" QZ Tray connection error:", error);

  }
};

export const disconnectPrinter = async () => {
  try {
    if (qz.websocket.isActive()) {
      await qz.websocket.disconnect();
    }

    console.log(" QZ Tray disconnected");
  } catch (error) {
    console.error("Disconnect printer error:", error);
  }
};

export const getPrinters = async () => {
  try {
    await connectPrinter();

    const printers = await qz.printers.find();

    console.log("🖨️ Available printers:", printers);

    return printers;
  } catch (error) {
    console.error("Get printers error:", error);

    throw error;
  }
};

export const getDefaultPrinter = async () => {
  try {
    await connectPrinter();

    const printer = await qz.printers.getDefault();

    console.log("🖨️ Default printer:", printer);

    return printer;
  } catch (error) {
    console.error("Get default printer error:", error);

    throw error;
  }
};

export const checkPrinter = async (printerName) => {
  try {
    await connectPrinter();

    const printers = await qz.printers.find();

    const exists = printers.includes(printerName);

    console.log("🖨️ Printer:", printerName);
    console.log(" Printer exists:", exists);

    return exists;
  } catch (error) {
    console.error("Check printer error:", error);

    return false;
  }
};

export const printBarcode = async ({
  printerName,
  imageUrl,
  copies = 1,
}) => {
  try {
    if (!printerName) {
      throw new Error("Printer name is required");
    }

    if (!imageUrl) {
      throw new Error("Barcode image URL is required");
    }

    await connectPrinter();

    console.log("🖨️ Starting print...");
    console.log("Printer:", printerName);
    console.log("Copies:", copies);
    console.log("Image:", imageUrl);


    const config = qz.configs.create(printerName, {
      colorType: "blackwhite",
      copies: Number(copies),
      density: 203,
      units: "mm",
      size: {
        width: 58,
        height: 30,
      },
      margins: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });


    const data = [
      {
        type: "pixel",
        format: "image",
        flavor: "base64",
        data: imageUrl,
      },
    ];

    await qz.print(config, data);

    console.log("✅ Print completed");

    return true;
  } catch (error) {
    console.error(" Print error:", error);

    throw error;
  }
};
