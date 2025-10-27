'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User } from 'lucide-react'

interface UserType {
  name: string
  email: string
  password: string
}

export function UserDropdown() {
  const [open, setOpen] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [error, setError] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const handleToggle = () => {
    setOpen(!open)
    if (!open) {
      setLoginEmail('')
      setLoginPassword('')
      setRegName('')
      setRegEmail('')
      setRegPassword('')
      setError('')
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const users: UserType[] = JSON.parse(localStorage.getItem('users') || '[]')
    const foundUser = users.find(
      (u) => u.email === loginEmail && u.password === loginPassword
    )

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('user', JSON.stringify(foundUser))
      setOpen(false)
      setError('')
    } else {
      setError('Correo o contraseña incorrectos')
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    const users: UserType[] = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.some((u) => u.email === regEmail)) {
      setError('El correo ya está registrado')
      return
    }
    const newUser = { name: regName, email: regEmail, password: regPassword }
    const updatedUsers = [...users, newUser]
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    setOpen(false)
    setError('')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="relative text-gray-600 hover:text-red-500 transition"
        aria-label="Cuenta de usuario">
        <User className="w-6 h-6 cursor-pointer" />
        {user && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-6 space-y-4 transition-all duration-300">
          {user ? (
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-center text-gray-800">
                Hola, {user.name}
              </span>
              <button
                className="w-full px-4 py-2 text-left rounded hover:bg-gray-100 transition"
                onClick={() => router.push('/account')}
              >
                Mi Cuenta
              </button>
              <button
                className="w-full px-4 py-2 text-left text-red-600 rounded hover:bg-red-50 transition"
                onClick={handleLogout}>
                Salir
              </button>
            </div>
          ) : (
            <>
              {error && <p className="text-red-500 text-center">{error}</p>}
              {!isRegister ? (
                <>
                  <h2 className="text-xl font-bold text-center text-gray-800">
                    Ingresa a tu cuenta
                  </h2>
                  <form onSubmit={handleLogin} className="flex flex-col gap-2">
                    <input
                      type="email"
                      placeholder="Correo"
                      className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)} />
                    <input
                      type="password"
                      placeholder="Contraseña"
                      className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)} />
                    <button className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">
                      Entrar
                    </button>
                  </form>
                  <p className="text-center text-sm text-gray-500">
                    ¿No tienes cuenta?{' '}
                    <button
                      onClick={() => {
                        setIsRegister(true)
                        setError('')
                      }}
                      className="text-red-600 hover:underline font-medium">
                      Regístrate
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-center text-gray-800">
                    Regístrate
                  </h2>
                  <form
                    onSubmit={handleRegister}
                    className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Nombre"
                      className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)} />
                    <input
                      type="email"
                      placeholder="Correo"
                      className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)} />
                    <input
                      type="password"
                      placeholder="Contraseña"
                      className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)} />
                    <button className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">
                      Registrar
                    </button>
                  </form>
                  <p className="text-center text-sm text-gray-500">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      onClick={() => {
                        setIsRegister(false)
                        setError('')
                      }}
                      className="text-red-600 hover:underline font-medium">
                      Inicia sesión
                    </button>
                  </p>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
