/**
 * For clientside handling of HTTP errors.
 */
export class HttpError extends Error {
  constructor(public response: Response) {
    super(`HTTP ${response.status} ${response.statusText}`);
    // eslint-disable-next-line no-console
    console.log(`HTTP ${response.status} ${response.statusText}`, {
      response,
      get text() {
        return response.text();
      },
    });
  }
}
