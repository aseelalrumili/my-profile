import axios from 'axios';

export const trackVisitor = async (page: string) => {
  try {
    await axios.post('/api/visitors', { page });
  } catch {}
};

export const fetchVisitorAnalytics = async () => {
  const { data } = await axios.get('/api/visitors');
  return data;
};
