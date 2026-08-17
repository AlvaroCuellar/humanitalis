import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 3_500_000;
const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MIN_COMPLETION_MS = 2_000;
const acceptedAttachmentExtensions = new Set([".pdf", ".doc", ".docx", ".xls", ".xlsx", ".odt", ".ods", ".txt", ".csv", ".jpg", ".jpeg", ".png"]);

const fieldLimits = {
  name: 120,
  email: 254,
  organization: 180,
  role: 160,
  projectName: 180,
  description: 6000,
  materials: 2000,
  volume: 500,
  currentState: 2000,
  deliverables: 2000,
  timing: 1000,
  budget: 1000,
  links: 2000,
} as const;

const requestTypeLabels = {
  es: { quote: "Solicitud de presupuesto", consulting: "Consulta o asesoramiento", research: "Proyecto de investigación", infrastructure: "Infraestructura o herramienta digital", other: "Otra consulta" },
  en: { quote: "Quote request", consulting: "Enquiry or consultancy", research: "Research project", infrastructure: "Digital infrastructure or tool", other: "Other enquiry" },
} as const;

const serviceLabels = {
  es: { recognition: "Reconocimiento y transcripción documental", structure: "Estructuración e interoperabilidad", analysis: "Análisis computacional", enrichment: "Enriquecimiento de colecciones", edition: "Edición, visor o difusión digital", consulting: "Consultoría e infraestructuras", other: "Otro servicio o planteamiento" },
  en: { recognition: "Document recognition and transcription", structure: "Structure and interoperability", analysis: "Computational analysis", enrichment: "Collection enrichment", edition: "Digital edition, viewer or access", consulting: "Consultancy and infrastructure", other: "Another service or approach" },
} as const;

type RateLimitState = { count: number; resetAt: number };
const rateLimitBuckets = new Map<string, RateLimitState>();

function clean(value: FormDataEntryValue | null, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function htmlValue(value: string) {
  return escapeHtml(value || "—").replace(/\n/g, "<br>");
}

function safeFilename(value: string) {
  return (value.split(/[\\/]/).pop() || "document").replaceAll("\r", "_").replaceAll("\n", "_").slice(0, 180);
}

function clientAddress(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimitBuckets.get(key);
  const state = current && current.resetAt > now ? current : { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  state.count += 1;
  rateLimitBuckets.set(key, state);

  if (rateLimitBuckets.size > 500) {
    for (const [bucketKey, bucket] of rateLimitBuckets) if (bucket.resetAt <= now) rateLimitBuckets.delete(bucketKey);
  }
  return state.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const declaredSize = Number(request.headers.get("content-length") || 0);
  if (declaredSize > MAX_BODY_BYTES) return NextResponse.json({ ok: false, code: "payload-too-large" }, { status: 413 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid-form" }, { status: 400 });
  }

  if (clean(formData.get("website"), 200)) return NextResponse.json({ ok: true, delivered: false });
  if (isRateLimited(clientAddress(request))) return NextResponse.json({ ok: false, code: "rate-limited" }, { status: 429 });

  const lang = clean(formData.get("lang"), 2) === "en" ? "en" : "es";
  const startedAt = Number(clean(formData.get("startedAt"), 20));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_COMPLETION_MS || startedAt > Date.now()) {
    return NextResponse.json({ ok: false, code: "invalid-timing" }, { status: 400 });
  }

  const values = {
    name: clean(formData.get("name"), fieldLimits.name),
    email: clean(formData.get("email"), fieldLimits.email).toLowerCase(),
    organization: clean(formData.get("organization"), fieldLimits.organization),
    role: clean(formData.get("role"), fieldLimits.role),
    projectName: clean(formData.get("projectName"), fieldLimits.projectName),
    description: clean(formData.get("description"), fieldLimits.description),
    materials: clean(formData.get("materials"), fieldLimits.materials),
    volume: clean(formData.get("volume"), fieldLimits.volume),
    currentState: clean(formData.get("currentState"), fieldLimits.currentState),
    deliverables: clean(formData.get("deliverables"), fieldLimits.deliverables),
    timing: clean(formData.get("timing"), fieldLimits.timing),
    budget: clean(formData.get("budget"), fieldLimits.budget),
    links: clean(formData.get("links"), fieldLimits.links),
  };

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const privacyAccepted = clean(formData.get("privacy"), 20) === "accepted";
  const requestType = clean(formData.get("requestType"), 30) as keyof typeof requestTypeLabels.es;
  if (!values.name || !values.organization || !emailIsValid || values.description.length < 250 || !privacyAccepted || !(requestType in requestTypeLabels.es)) {
    return NextResponse.json({ ok: false, code: "validation-failed" }, { status: 400 });
  }

  const allowedServices = Object.keys(serviceLabels.es) as Array<keyof typeof serviceLabels.es>;
  const selectedServices = formData.getAll("services")
    .map((value) => typeof value === "string" ? value : "")
    .filter((value): value is keyof typeof serviceLabels.es => allowedServices.includes(value as keyof typeof serviceLabels.es));
  const typeLabel = requestTypeLabels[lang][requestType];
  const services = selectedServices.map((service) => serviceLabels[lang][service]);
  const attachments = formData.getAll("attachments").filter((value): value is File => value instanceof File && value.size > 0);
  const totalAttachmentBytes = attachments.reduce((total, file) => total + file.size, 0);
  const attachmentsAreValid = attachments.length <= MAX_ATTACHMENTS
    && totalAttachmentBytes <= MAX_TOTAL_ATTACHMENT_BYTES
    && attachments.every((file) => {
      const extensionIndex = file.name.lastIndexOf(".");
      const extension = extensionIndex >= 0 ? file.name.slice(extensionIndex).toLowerCase() : "";
      return file.size <= MAX_ATTACHMENT_BYTES && acceptedAttachmentExtensions.has(extension);
    });
  if (!attachmentsAreValid) return NextResponse.json({ ok: false, code: "invalid-attachments" }, { status: 400 });
  const attachmentNames = attachments.map((file) => safeFilename(file.name));
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL?.trim();
  const subjectDetail = values.projectName || values.organization;
  const subject = `[HUMANITALIS] ${typeLabel} — ${subjectDetail}`.slice(0, 240);

  const sections = [
    [lang === "es" ? "TIPO DE CONSULTA" : "ENQUIRY TYPE", typeLabel],
    [lang === "es" ? "DATOS DE CONTACTO" : "CONTACT DETAILS", [
      `${lang === "es" ? "Nombre" : "Name"}: ${values.name}`,
      `${lang === "es" ? "Correo" : "Email"}: ${values.email}`,
      `${lang === "es" ? "Institución" : "Institution"}: ${values.organization}`,
      `${lang === "es" ? "Cargo" : "Role"}: ${values.role || "—"}`,
    ].join("\n")],
    [lang === "es" ? "PROYECTO" : "PROJECT", [
      `${lang === "es" ? "Nombre provisional" : "Working title"}: ${values.projectName || "—"}`,
      `${lang === "es" ? "Servicios" : "Services"}: ${services.join(", ") || "—"}`,
    ].join("\n")],
    [lang === "es" ? "DESCRIPCIÓN DETALLADA" : "DETAILED DESCRIPTION", values.description],
    [lang === "es" ? "MATERIALES O COLECCIONES" : "MATERIALS OR COLLECTIONS", values.materials || "—"],
    [lang === "es" ? "VOLUMEN APROXIMADO" : "APPROXIMATE VOLUME", values.volume || "—"],
    [lang === "es" ? "ESTADO ACTUAL Y FORMATOS" : "CURRENT STATE AND FORMATS", values.currentState || "—"],
    [lang === "es" ? "RESULTADOS ESPERADOS" : "EXPECTED OUTCOMES", values.deliverables || "—"],
    [lang === "es" ? "PLAZO" : "TIMESCALE", values.timing || "—"],
    [lang === "es" ? "PRESUPUESTO O FINANCIACIÓN" : "BUDGET OR FUNDING", values.budget || "—"],
    [lang === "es" ? "ENLACES" : "LINKS", values.links || "—"],
    [lang === "es" ? "DOCUMENTOS ADJUNTOS" : "ATTACHED DOCUMENTS", attachmentNames.join("\n") || "—"],
  ] as const;

  const text = sections.map(([heading, body]) => `${heading}\n${body}`).join("\n\n");
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#171817">${sections.map(([heading, body]) => `<h2 style="margin:28px 0 8px;color:#681821;font-size:15px;letter-spacing:.06em">${escapeHtml(heading)}</h2><div>${htmlValue(body)}</div>`).join("")}</div>`;

  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[HUMANITALIS contact local preview]\n" + text);
      return NextResponse.json({ ok: true, delivered: false, mode: "local-preview" });
    }
    return NextResponse.json({ ok: false, code: "delivery-not-configured" }, { status: 503 });
  }

  if (!recipient) return NextResponse.json({ ok: false, code: "recipient-not-configured" }, { status: 503 });

  const emailAttachments = await Promise.all(attachments.map(async (file) => ({
    filename: safeFilename(file.name),
    content: Buffer.from(await file.arrayBuffer()).toString("base64"),
  })));

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL?.trim() || "HUMANITALIS <onboarding@resend.dev>",
      to: [recipient],
      reply_to: values.email,
      subject,
      text,
      html,
      attachments: emailAttachments.length ? emailAttachments : undefined,
    }),
  });

  if (!resendResponse.ok) {
    const detail = await resendResponse.text().catch(() => "");
    console.error("HUMANITALIS contact delivery failed", resendResponse.status, detail.slice(0, 500));
    return NextResponse.json({ ok: false, code: "delivery-failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
