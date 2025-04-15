import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1'

export interface Contact {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
  company_id?: number
  created_at: string
  updated_at: string
}

export interface PaginatedResponse {
  items: Contact[]
  total: number
  pages: number
}

export const contactService = {
  async getAll(page = 1, size = 10, search = ''): Promise<PaginatedResponse> {
    const response = await axios.get(`${API_URL}/contacts/`, {
      params: {
        page,
        size,
        search
      }
    })
    return response.data
  },

  async create(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> {
    const response = await axios.post(`${API_URL}/contacts/`, contact)
    return response.data
  },

  async update(id: number, contact: Partial<Contact>): Promise<Contact> {
    const response = await axios.put(`${API_URL}/contacts/${id}`, contact)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}/contacts/${id}`)
  },

  async getById(id: number): Promise<Contact> {
    const response = await axios.get(`${API_URL}/contacts/${id}`)
    return response.data
  }
}