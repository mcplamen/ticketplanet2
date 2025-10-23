import { GoogleAuth } from "google-auth-library";
import jwt from "jsonwebtoken";
import fs from "fs";

export async function createGooglePass({ name, phone, email, issuerIdOverride=null, classIdOverride=null }) {
  try {
    let serviceAccount = null;
    if (process.env.SERVICE_ACCOUNT_JSON) {
      try {
        serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
      } catch (e) {
        throw new Error("SERVICE_ACCOUNT_JSON is not valid JSON");
      }
    } else if (fs.existsSync("./service-account.json")) {
      serviceAccount = JSON.parse(fs.readFileSync("./service-account.json", "utf8"));
    } else {
      throw new Error("Service account credentials not found. Set SERVICE_ACCOUNT_JSON or place service-account.json in project root.");
    }

    const issuerId = issuerIdOverride || (process.env.GW_ISSUER_ID || "3388000000022991350");
    const classId = classIdOverride || `${issuerId}.demo_ticket_class`;
    const objectId = `${issuerId}.ticket_${Date.now()}`;

    const qrValue = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}`;

    const eventTicketObject = {
      id: objectId,
      classId,
      state: "ACTIVE",
      textModulesData: [
        { header: "Име", body: name },
        { header: "Телефон", body: phone },
        { header: "Имейл", body: email }
      ],
      barcode: {
        type: "QR_CODE",
        value: qrValue,
        alternateText: "Scan for details"
      }
    };

    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: "https://www.googleapis.com/auth/wallet_object.issuer"
    });
    const client = await auth.getClient();

    try {
      await client.request({
        url: "https://walletobjects.googleapis.com/walletobjects/v1/eventTicketObject",
        method: "POST",
        data: eventTicketObject
      });
    } catch (err) {
      if (err.response?.status === 409) {
        // already exists — fine
      } else {
        throw new Error(err.response?.data?.error?.message || err.message);
      }
    }

    const jwtPayload = {
      iss: serviceAccount.client_email,
      aud: "google",
      origins: [],
      typ: "savetowallet",
      payload: {
        eventTicketObjects: [{ id: objectId }]
      }
    };

    const token = jwt.sign(jwtPayload, serviceAccount.private_key, { algorithm: "RS256" });
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

    return { success: true, message: "Ticket created successfully", saveUrl, objectId };
  } catch (error) {
    console.error("Google Wallet error:", error);
    return { success: false, error: error.message };
  }
}
