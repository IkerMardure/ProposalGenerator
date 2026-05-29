export function getAppUrl(requestUrl?: string) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    requestUrl ||
    'http://localhost:3000'
  );
}
