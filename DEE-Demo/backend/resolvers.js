export const handler = async (req) => {
  const { path = '/ping' } = req;
  const now = new Date().toISOString();
  if (path === '/ping') {
    return {
      body: {
        ok: true,
        time: now,
        message: 'DEE resolver alive',
      },
    };
  }
  return {
    body: {
      ok: false,
      time: now,
      error: `Unknown path: ${path}`,
    },
  };
};
