const DRIVE_UPLOAD_URL =
  "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink";

interface DriveFileResponse {
  id: string;
  name: string;
  webViewLink: string;
}

export async function uploadToGoogleDrive(
  accessToken: string,
  docxBlob: Blob,
  fileName: string
): Promise<DriveFileResponse> {
  const metadata = {
    name: fileName,
    mimeType: "application/vnd.google-apps.document",
  };

  const boundary = "resume_builder_boundary_" + Date.now();
  const delimiter = "\r\n--" + boundary + "\r\n";
  const closeDelimiter = "\r\n--" + boundary + "--";

  const docxArrayBuffer = await docxBlob.arrayBuffer();
  const docxUint8 = new Uint8Array(docxArrayBuffer);

  const metadataPart =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata);

  const filePart =
    delimiter +
    "Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document\r\n" +
    "Content-Transfer-Encoding: binary\r\n\r\n";

  const bodyParts = [
    new TextEncoder().encode(metadataPart),
    new TextEncoder().encode(filePart),
    docxUint8,
    new TextEncoder().encode(closeDelimiter),
  ];

  const totalLength = bodyParts.reduce((sum, part) => sum + part.byteLength, 0);
  const body = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of bodyParts) {
    body.set(part, offset);
    offset += part.byteLength;
  }

  const response = await fetch(DRIVE_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body: body.buffer,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Drive API error:", response.status, errorBody);

    if (response.status === 401) {
      throw new Error("AUTH_EXPIRED");
    }
    if (response.status === 403) {
      throw new Error(
        "権限が不足しています。Google Driveへのアクセスを許可してください。"
      );
    }
    throw new Error(
      `Google Driveへのアップロードに失敗しました (${response.status})`
    );
  }

  return (await response.json()) as DriveFileResponse;
}
