import { appConfig, eventConfig } from "@/lib/config";

// Inline-styled HTML emails (email clients ignore stylesheets).
// Every template shares the Attendly header and footer.

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td style="padding:24px 32px;border-bottom:1px solid #e2e8f0;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr><td style="font-size:24px;font-weight:bold;color:#1e293b;letter-spacing:-0.5px;">Attendly</td></tr>
                  <tr><td align="right" style="font-size:10px;color:#64748b;padding-top:2px;">${appConfig.tagline}</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#334155;font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
                ${escapeHtml(eventConfig.eventName)} &middot; Attendly &middot; ${appConfig.tagline}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;">
    <tr>
      <td style="background-color:#4f46e5;border-radius:8px;">
        <a href="${href}" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;white-space:nowrap;">${label}</td>
    <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:bold;">${escapeHtml(value)}</td>
  </tr>`;
}

interface ReservationEmailArgs {
  fullName: string;
  batch: string;
  reference: string;
  portalUrl: string;
}

export function reservationEmail({ fullName, batch, reference, portalUrl }: ReservationEmailArgs) {
  const { bank, ticketPrice, eventName } = eventConfig;
  const body = `
    <p style="margin:0 0 16px;">Hi <strong>${escapeHtml(fullName)}</strong>,</p>
    <p style="margin:0 0 16px;">Your ticket reservation for <strong>${escapeHtml(eventName)}</strong> has been received. Here are your reservation details:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      ${detailRow("Reservation ref", reference)}
      ${detailRow("Name", fullName)}
      ${detailRow("Batch", `Class of ${batch}`)}
      ${ticketPrice ? detailRow("Ticket price", ticketPrice) : ""}
    </table>
    <p style="margin:0 0 8px;font-weight:bold;color:#1e293b;">How to complete your payment</p>
    <p style="margin:0 0 12px;">Transfer the ticket amount to the account below, then upload your payment slip on your personal page. Once we verify it, your ticket with a QR code will be emailed to you.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px 16px;margin:0 0 8px;width:100%;">
      ${bank.name ? detailRow("Bank", bank.name) : ""}
      ${bank.accountName ? detailRow("Account name", bank.accountName) : ""}
      ${bank.accountNumber ? detailRow("Account number", bank.accountNumber) : ""}
      ${bank.branch ? detailRow("Branch", bank.branch) : ""}
    </table>
    ${button(portalUrl, "Upload payment slip")}
    <p style="margin:0;color:#64748b;font-size:13px;">Keep this email — the link above is your personal page for tracking your reservation and ticket.</p>
  `;
  return {
    subject: `Reservation received — ${eventName}`,
    html: layout(body),
  };
}

interface TicketEmailArgs {
  fullName: string;
  batch: string;
  ticketNumber: string;
  portalUrl: string;
}

export function ticketEmail({ fullName, batch, ticketNumber, portalUrl }: TicketEmailArgs) {
  const { eventName } = eventConfig;
  const body = `
    <p style="margin:0 0 16px;">Hi <strong>${escapeHtml(fullName)}</strong>,</p>
    <p style="margin:0 0 16px;">Your payment has been verified — your ticket for <strong>${escapeHtml(eventName)}</strong> is confirmed! 🎉</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      ${detailRow("Ticket number", ticketNumber)}
      ${detailRow("Name", fullName)}
      ${detailRow("Batch", `Class of ${batch}`)}
    </table>
    <p style="margin:0 0 12px;">Your QR code is attached to this email, and is also available on your ticket page. <strong>Show the QR code at the entrance</strong> — it will be scanned to check you in.</p>
    ${button(portalUrl, "View my ticket & QR code")}
    <p style="margin:0;color:#64748b;font-size:13px;">Tip: save the attached QR image to your phone, or keep this page handy for quick entry at the gate.</p>
  `;
  return {
    subject: `Your ticket ${ticketNumber} — ${eventName}`,
    html: layout(body),
  };
}

interface RejectionEmailArgs {
  fullName: string;
  portalUrl: string;
}

export function rejectionEmail({ fullName, portalUrl }: RejectionEmailArgs) {
  const { eventName } = eventConfig;
  const body = `
    <p style="margin:0 0 16px;">Hi <strong>${escapeHtml(fullName)}</strong>,</p>
    <p style="margin:0 0 16px;">We couldn't verify the payment slip you uploaded for <strong>${escapeHtml(eventName)}</strong>. This usually happens when the image is unclear or the details don't match the transfer.</p>
    <p style="margin:0 0 12px;">Please upload a clear photo or PDF of your payment slip again:</p>
    ${button(portalUrl, "Re-upload payment slip")}
    <p style="margin:0;color:#64748b;font-size:13px;">If you believe this is a mistake, reply to this email and the organizing team will help you out.</p>
  `;
  return {
    subject: `Action needed: payment slip — ${eventName}`,
    html: layout(body),
  };
}
