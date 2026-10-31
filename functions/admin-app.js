// the dashboard shell is only served through /admin
export const onRequest = () => new Response('Not found', { status: 404 });
