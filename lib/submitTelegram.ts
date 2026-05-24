function resolveSendUrl(): string {
  if (typeof window === "undefined") return "/send.php";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return "/api/telegram";
  return "/send.php";
}

export async function submitTelegramJson(
  payload: Record<string, unknown>
): Promise<Response> {
  return fetch(resolveSendUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** Кодирует файл в base64 для передачи в JSON (PHP: send.php → sendDocument). */
export async function fileToAttachmentFields(file: File): Promise<{
  _fileBase64: string;
  _fileName: string;
  _fileMime: string;
}> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return {
    _fileBase64: btoa(binary),
    _fileName: file.name || "attachment.bin",
    _fileMime: file.type || "application/octet-stream",
  };
}
