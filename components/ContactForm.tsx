"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { Dictionary } from "@/content/dictionaries";
import type { Lang } from "@/lib/config";

type SubmissionState = "idle" | "sending" | "success" | "error";
type ContactMode = "brief" | "detailed";
const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const ACCEPTED_ATTACHMENTS = ".pdf,.doc,.docx,.xls,.xlsx,.odt,.ods,.txt,.csv,.jpg,.jpeg,.png";
const acceptedExtensions = new Set(ACCEPTED_ATTACHMENTS.split(","));

export function ContactForm({ lang, dictionary: d }: { lang: Lang; dictionary: Dictionary["contactPage"] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const briefTabRef = useRef<HTMLButtonElement>(null);
  const detailedTabRef = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<ContactMode>("brief");
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [attachmentStatus, setAttachmentStatus] = useState("");

  const minimumDescriptionLength = mode === "brief" ? 50 : 250;

  function selectMode(nextMode: ContactMode, focus = false) {
    setMode(nextMode);
    setDescriptionLength(0);
    setSubmissionState("idle");
    setStatusMessage("");
    setAttachmentStatus("");
    setStartedAt(Date.now());
    if (focus) (nextMode === "brief" ? briefTabRef : detailedTabRef).current?.focus();
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextMode = event.key === "ArrowLeft" || event.key === "Home" ? "brief" : "detailed";
    selectMode(nextMode, true);
  }

  function validateAttachments(files: File[]) {
    if (files.length > MAX_ATTACHMENTS) return d.attachmentsTooMany;
    if (files.some((file) => file.size > MAX_ATTACHMENT_BYTES) || files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_ATTACHMENT_BYTES) return d.attachmentsTooLarge;
    if (files.some((file) => !acceptedExtensions.has(`.${file.name.split(".").pop()?.toLowerCase()}`))) return d.attachmentsInvalid;
    return "";
  }

  function fieldLabel(label: string, required = false) {
    return <span className="contact-field-label"><span>{label}</span><small className={required ? "is-required" : "is-optional"}>{required ? d.required : d.optional}</small></span>;
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const description = String(formData.get("description") || "").trim();
    if (description.length < minimumDescriptionLength) {
      setSubmissionState("error");
      setStatusMessage(mode === "brief" ? d.brief.tooShort : d.tooShort);
      return;
    }
    const attachmentError = validateAttachments(formData.getAll("attachments").filter((value): value is File => value instanceof File && value.size > 0));
    if (attachmentError) {
      setSubmissionState("error");
      setStatusMessage(attachmentError);
      return;
    }

    setSubmissionState("sending");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; mode?: string };
      if (!response.ok || !result.ok) throw new Error("contact-request-failed");

      setSubmissionState("success");
      setStatusMessage(result.mode === "local-preview" ? d.localSuccess : mode === "brief" ? d.brief.success : d.success);
      formRef.current?.reset();
      setDescriptionLength(0);
      setAttachmentStatus("");
      setStartedAt(Date.now());
    } catch {
      setSubmissionState("error");
      setStatusMessage(d.error);
    }
  }

  const fieldClass = "contact-field";

  return (
    <>
      <div className="contact-mode-selector" aria-labelledby="contact-mode-title">
        <div className="contact-mode-intro">
          <p className="eyebrow">{d.mode.eyebrow}</p>
          <h2 id="contact-mode-title">{d.mode.title}</h2>
          <p>{d.mode.intro}</p>
        </div>
        <div className="contact-mode-tabs" role="tablist" aria-label={d.mode.title}>
          <button
            ref={briefTabRef}
            id="contact-tab-brief"
            type="button"
            role="tab"
            aria-selected={mode === "brief"}
            aria-controls="contact-panel-brief"
            tabIndex={mode === "brief" ? 0 : -1}
            onClick={() => selectMode("brief")}
            onKeyDown={handleTabKeyDown}
          >
            <span>01</span><strong>{d.mode.briefLabel}</strong><small>{d.mode.briefDescription}</small>
          </button>
          <button
            ref={detailedTabRef}
            id="contact-tab-detailed"
            type="button"
            role="tab"
            aria-selected={mode === "detailed"}
            aria-controls="contact-panel-detailed"
            tabIndex={mode === "detailed" ? 0 : -1}
            onClick={() => selectMode("detailed")}
            onKeyDown={handleTabKeyDown}
          >
            <span>02</span><strong>{d.mode.detailedLabel}</strong><small>{d.mode.detailedDescription}</small>
          </button>
        </div>
      </div>

      <form ref={formRef} className="contact-form" onSubmit={submitForm} noValidate>
        <input type="hidden" name="lang" value={lang} />
        <input type="hidden" name="mode" value={mode} />
        <input type="hidden" name="startedAt" value={startedAt} />
        <div className="form-trap" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <p className="contact-required-note">{d.requiredNote}</p>

        <fieldset className="contact-fieldset">
          <legend><span>01</span>{d.sections.contact}</legend>
          <div className="contact-fields-grid">
            <label className={fieldClass}>
              {fieldLabel(d.fields.name, true)}
              <input name="name" type="text" autoComplete="name" required maxLength={120} />
            </label>
            <label className={fieldClass}>
              {fieldLabel(d.fields.email, true)}
              <input name="email" type="email" autoComplete="email" required maxLength={254} />
            </label>
            <label className={fieldClass}>
              {fieldLabel(d.fields.organization, mode === "detailed")}
              <input name="organization" type="text" autoComplete="organization" required={mode === "detailed"} maxLength={180} />
            </label>
            {mode === "detailed" && <label className={fieldClass}>
              {fieldLabel(d.fields.role)}
              <input name="role" type="text" autoComplete="organization-title" placeholder={d.placeholders.role} maxLength={160} />
            </label>}
          </div>
        </fieldset>

        {mode === "brief" ? (
          <fieldset id="contact-panel-brief" className="contact-fieldset contact-brief-fieldset" role="tabpanel" aria-labelledby="contact-tab-brief">
            <legend><span>02</span>{d.brief.section}</legend>
            <label className={fieldClass}>
              {fieldLabel(d.brief.messageLabel, true)}
              <textarea
                name="description"
                rows={7}
                required
                minLength={50}
                maxLength={3000}
                placeholder={d.brief.placeholder}
                onChange={(event) => setDescriptionLength(event.currentTarget.value.length)}
                aria-describedby="contact-description-help contact-description-count"
              />
            </label>
            <div className="contact-detail-meta">
              <p id="contact-description-help">{d.brief.help}</p>
              <span id="contact-description-count" className={descriptionLength > 0 && descriptionLength < 50 ? "is-short" : ""}>{descriptionLength} / 3000 · {d.brief.minimum}</span>
            </div>
          </fieldset>
        ) : (
          <div id="contact-panel-detailed" role="tabpanel" aria-labelledby="contact-tab-detailed">
            <fieldset className="contact-fieldset">
              <legend><span>02</span>{d.sections.project}</legend>
              <div className="contact-fields-grid">
                <label className={fieldClass}>
                  {fieldLabel(d.fields.requestType, true)}
                  <select name="requestType" required defaultValue="">
                    <option value="" disabled>{d.selectPrompt}</option>
                    {d.requestTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className={fieldClass}>
                  {fieldLabel(d.fields.projectName)}
                  <input name="projectName" type="text" placeholder={d.placeholders.projectName} maxLength={180} />
                </label>
              </div>
              <div className="contact-service-group">
                <p className="contact-field-label"><span>{d.fields.services}</span><small className="is-optional">{d.optional}</small></p>
                <div className="contact-service-options">
                  {d.serviceOptions.map(([value, label]) => (
                    <label key={value}><input type="checkbox" name="services" value={value} /><span>{label}</span></label>
                  ))}
                </div>
              </div>
            </fieldset>

            <fieldset className="contact-fieldset contact-detail-fieldset">
              <legend><span>03</span>{d.sections.detail}</legend>
              <label className={fieldClass}>
                {fieldLabel(d.fields.description, true)}
                <textarea
                  name="description"
                  rows={12}
                  required
                  minLength={250}
                  maxLength={6000}
                  placeholder={d.placeholders.description}
                  onChange={(event) => setDescriptionLength(event.currentTarget.value.length)}
                  aria-describedby="contact-description-help contact-description-count"
                />
              </label>
              <div className="contact-detail-meta">
                <p id="contact-description-help">{d.detailHelp}</p>
                <span id="contact-description-count" className={descriptionLength > 0 && descriptionLength < 250 ? "is-short" : ""}>{descriptionLength} / 6000 · {d.detailMinimum}</span>
              </div>
            </fieldset>

            <fieldset className="contact-fieldset">
              <legend><span>04</span>{d.sections.planning}</legend>
              <div className="contact-fields-grid">
                <label className={`${fieldClass} contact-field-wide`}>
                  {fieldLabel(d.fields.materials)}
                  <textarea name="materials" rows={4} placeholder={d.placeholders.materials} maxLength={2000} />
                </label>
                <label className={fieldClass}>
                  {fieldLabel(d.fields.volume)}
                  <input name="volume" type="text" placeholder={d.placeholders.volume} maxLength={500} />
                </label>
                <label className={fieldClass}>
                  {fieldLabel(d.fields.currentState)}
                  <textarea name="currentState" rows={4} placeholder={d.placeholders.currentState} maxLength={2000} />
                </label>
                <label className={fieldClass}>
                  {fieldLabel(d.fields.deliverables)}
                  <textarea name="deliverables" rows={4} placeholder={d.placeholders.deliverables} maxLength={2000} />
                </label>
                <label className={fieldClass}>
                  {fieldLabel(d.fields.timing)}
                  <textarea name="timing" rows={4} placeholder={d.placeholders.timing} maxLength={1000} />
                </label>
                <label className={fieldClass}>
                  {fieldLabel(d.fields.budget)}
                  <textarea name="budget" rows={4} placeholder={d.placeholders.budget} maxLength={1000} />
                </label>
                <label className={`${fieldClass} contact-field-wide`}>
                  {fieldLabel(d.fields.links)}
                  <textarea name="links" rows={3} placeholder={d.placeholders.links} maxLength={2000} />
                </label>
                <label className={`${fieldClass} contact-field-wide contact-attachment-field`}>
                  {fieldLabel(d.fields.attachments)}
                  <input
                    name="attachments"
                    type="file"
                    accept={ACCEPTED_ATTACHMENTS}
                    multiple
                    aria-describedby="contact-attachments-help contact-attachments-status"
                    onChange={(event) => {
                      const files = Array.from(event.currentTarget.files || []);
                      const error = validateAttachments(files);
                      if (error) {
                        event.currentTarget.value = "";
                        setAttachmentStatus(error);
                        return;
                      }
                      setAttachmentStatus(files.length ? `${files.length} ${d.attachmentsSelected}` : "");
                    }}
                  />
                  <span id="contact-attachments-help" className="contact-field-help">{d.attachmentsHelp}</span>
                  <span id="contact-attachments-status" className="contact-attachment-status" aria-live="polite">{attachmentStatus}</span>
                </label>
              </div>
            </fieldset>
          </div>
        )}

        <div className="contact-form-footer">
          <label className="contact-privacy-consent">
            <input name="privacy" type="checkbox" value="accepted" required />
            <span><small className="is-required">{d.required}</small>{d.privacy.split(d.privacyLink)[0]}<Link href={`/${lang}/privacy`} target="_blank" rel="noreferrer">{d.privacyLink}</Link>{d.privacy.split(d.privacyLink)[1]}</span>
          </label>
          <div className="contact-submit-row">
            <button className="button button-light" type="submit" disabled={submissionState === "sending"}>
              {submissionState === "sending" ? d.sending : mode === "brief" ? d.brief.submit : d.submit}
              <span className="icon-arrow-external" aria-hidden="true" />
            </button>
            <div className={`contact-form-status ${submissionState}`} role="status" aria-live="polite">{statusMessage}</div>
          </div>
        </div>
      </form>
    </>
  );
}
