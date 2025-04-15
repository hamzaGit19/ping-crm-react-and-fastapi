import axios, { AxiosError } from 'axios'

const API_URL = 'http://localhost:8000/api/v1'

interface Company {
  id?: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
  created_at?: string
  updated_at?: string
}

interface PaginatedResponse {
  items: Company[]
  total: number
  page: number
  size: number
  pages: number
}

export const companyService = {
  getAll: async (page = 1, size = 10, search = ''): Promise<PaginatedResponse> => {
    const response = await axios.get(`${API_URL}/companies/`, {
      params: {
        page,
        size,
        search
      }
    })
    return response.data
  },

  create: async (data: Company) => {
    try {
      console.log('Sending company data:', data)
      const response = await axios.post(`${API_URL}/companies/`, data)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error creating company:', error.response?.data || error.message)
      } else {
        console.error('Error creating company:', error)
      }
      throw error
    }
  },

  update: async (id: number, data: Company) => {
    try {
      const response = await axios.put(`${API_URL}/companies/${id}/`, data)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error updating company:', error.response?.data || error.message)
      } else {
        console.error('Error updating company:', error)
      }
      throw error
    }
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/companies/${id}`)
  }
}