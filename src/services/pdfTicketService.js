import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

export async function generateTicketPDF(ticket, event, user) {
  return new Promise(async (resolve, reject) => {
    try {
      const pdfPath = path.resolve(`uploads/tickets/ticket-${ticket.id}.pdf`);

      // Ensure folder exists
      fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      // EVENT LOGO
      if (event.logoPath && fs.existsSync(event.logoPath.replace("/", path.sep))) {
        doc.image(event.logoPath.replace("/", path.sep), 50, 40, { width: 120 });
      }

      doc.fontSize(24).text("Event Ticket", 380, 50);
      doc.moveDown(2);

      doc.fontSize(16).text(`Event: ${event.title}`);
      doc.text(`Description: ${event.description}`);
      doc.text(`Date: ${new Date(event.date).toLocaleString()}`);
      doc.text(`Issued to: ${user.email}`);

      doc.moveDown(1);

      // QR CODE (data URL to buffer)
      const qrData = `http://localhost:3000/tickets/validate/${ticket.id}`;
      const qrImage = await QRCode.toDataURL(qrData);

      const qrBase64 = qrImage.replace(/^data:image\/png;base64,/, "");
      const qrBuffer = Buffer.from(qrBase64, "base64");

      doc.image(qrBuffer, 400, 250, { width: 150 });

      doc.end();

      stream.on("finish", () => {
        resolve(pdfPath);
      });
    } catch (err) {
      reject(err);
    }
  });
}
