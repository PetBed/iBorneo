const inquiryRecipient = "info@iborneo.net";

export function createInquiryMailto({ name, email, phone, service, message }) {
  const subject = `iBorneo website inquiry — ${name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    ...(phone?.trim() ? [`Phone: ${phone.trim()}`] : []),
    `Service: ${service}`,
    "",
    "Message:",
    message,
  ].join("\n");
  const params = new URLSearchParams({ subject, body });

  return `mailto:${inquiryRecipient}?${params.toString()}`;
}
