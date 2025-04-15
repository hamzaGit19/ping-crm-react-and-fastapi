import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1'

export const companyService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/companies`)
    return response.data
  }
}