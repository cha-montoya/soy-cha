const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://api.soycha.com"
).replace(/\/+$/, "");

function getErrorMessage(data, status) {
  if (typeof data?.message === "string") {
    return data.message;
  }

  if (typeof data?.error === "string") {
    return data.error;
  }

  if (typeof data?.error?.message === "string") {
    return data.error.message;
  }

  if (typeof data?.errors?.[0]?.message === "string") {
    return data.errors[0].message;
  }

  return `Unable to generate the image (${status}).`;
}

export async function generateImage(contentId) {
  if (contentId === undefined || contentId === null || contentId === "") {
    throw new Error("A content ID is required to generate an image.");
  }

  const endpoint = `${API_BASE_URL}/api/v1/content/${encodeURIComponent(
    String(contentId)
  )}/image/generate`;

  console.log("Generating image through:", endpoint);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `The image generation API returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok || data?.success === false) {
    throw new Error(getErrorMessage(data, response.status));
  }

  if (!data?.image?.url && !data?.content?.image_url) {
    throw new Error(
      "The API completed the request but did not return an image URL."
    );
  }

  return data;
}