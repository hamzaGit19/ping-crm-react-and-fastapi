import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

interface DashboardStats {
  total_companies: number;
  total_contacts: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axios.get(`${API_URL}/dashboard/stats`);
    return response.data;
  }
};