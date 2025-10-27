'use client'

import { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'

interface UserType {
  name: string
  email: string
  password: string
  genero?: string
  image?: string
}

export default function AccountPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<UserType | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const u = JSON.parse(storedUser)
      setUser(u)
      setFormData(u)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!formData) return
    setUser(formData)
    localStorage.setItem('user', JSON.stringify(formData))
    setEditing(false)
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Debes iniciar sesión para ver tu perfil
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl m-5 p-6 w-full max-w-md">
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {formData?.image ? (
                <img src={formData.image} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 font-bold text-lg">IMG</span>
              )}
            </div>

            {editing && (
              <label className="absolute -bottom-2 -right-2 w-13 h-13 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                <FaPlus size={13} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Perfil</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Editar
              </button>
            )}
          </div>

          {!editing ? (
            <div className="space-y-2 text-center text-gray-600">
              <p><span className="font-medium">Nombre:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Género:</span> {user.genero || 'No especificado'}</p>
            </div>
          ) : (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData?.name || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-gray-700 focus:ring-2 focus:ring-red-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData?.email || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-gray-700 focus:ring-2 focus:ring-red-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Género</label>
                <select
                  name="genero"
                  value={formData?.genero || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-gray-700 bg-white focus:ring-2 focus:ring-red-300 outline-none"
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
