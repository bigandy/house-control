import { URL } from "url";

/**
 * Creates a full URL from a base URL and query params.
 * @param url
 * @param query
 * @returns {string}
 */
export const createUrl = ({ url, query = {} }) => {
  const urlBuilder = new URL(url);

  Object.entries(query).forEach(([key, value]) => {
    if (value == null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((val) => urlBuilder.searchParams.append(key, val));
      return;
    }

    urlBuilder.searchParams.append(key, value);
  });

  return urlBuilder.toString();
};
