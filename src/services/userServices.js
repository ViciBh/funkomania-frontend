import { apiRequest } from './api'

export async function getUserProfile() {
  return await apiRequest('/usuario/perfil')
}

export async function updateUserProfile(userData) {
  return await apiRequest('/usuario/perfil', {
    method: 'PUT',
    body: JSON.stringify(userData)
  })
}