'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { X, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type CartItem = {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

type CustomerData = {
  nombre: string
  apellidos: string
  correo: string
  documento: string
  telefono: string
  cumpleanos: string
  razonSocial: string
  ruc: string
  terminos: boolean
  privacidad: boolean
}

/* ---------- Mock datos de ubicación / tiendas ---------- */
const DEPARTAMENTOS = [
  {
    id: 'lima',
    name: 'Lima',
    provincias: [
      { id: 'lima-prov', name: 'Provincia de Lima', distritos: ['Miraflores', 'San Isidro', 'Surco'] },
      { id: 'callao-prov', name: 'Callao', distritos: ['Callao'] },
    ],
  },
  {
    id: 'cusco',
    name: 'Cusco',
    provincias: [
      { id: 'cusco-prov', name: 'Provincia del Cusco', distritos: ['Cusco', 'Wanchaq', 'San Sebastian'] },
    ],
  },
]

const MOCK_STORES = [
  { id: 's1', name: 'Tienda Miraflores', address: 'Av. Larco 123', dept: 'Lima', prov: 'Provincia de Lima', dist: 'Miraflores', freeFrom: 0, hours: '9:00 - 20:00' },
  { id: 's2', name: 'Tienda San Isidro', address: 'Av. Javier Prado 200', dept: 'Lima', prov: 'Provincia de Lima', dist: 'San Isidro', freeFrom: 0, hours: '10:00 - 19:00' },
  { id: 's3', name: 'Tienda Cusco Centro', address: 'Jr. Sarmiento 45', dept: 'Cusco', prov: 'Provincia del Cusco', dist: 'Cusco', freeFrom: 0, hours: '9:00 - 18:00' },
]

const CART_KEY = 'cart'
const CUSTOMER_KEY = 'checkout_customer'

const isBrowser = typeof window !== 'undefined'

function loadCart() {
  if (!isBrowser) return []
  try {
    const raw = localStorage.getItem('cart')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(cart) {
  if (isBrowser) localStorage.setItem('cart', JSON.stringify(cart))
}

function loadCustomer(): CustomerData {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY)
    if (!raw)
      return {
        nombre: '',
        apellidos: '',
        correo: '',
        documento: '',
        telefono: '',
        cumpleanos: '',
        razonSocial: '',
        ruc: '',
        terminos: false,
        privacidad: false,
      }
    return JSON.parse(raw)
  } catch {
    return {
      nombre: '',
      apellidos: '',
      correo: '',
      documento: '',
      telefono: '',
      cumpleanos: '',
      razonSocial: '',
      ruc: '',
      terminos: false,
      privacidad: false,
    }
  }
}
function saveCustomer(data: CustomerData) {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(data))
}

export default function CheckoutPage() {
  const router = useRouter()

const [cart, setCart] = useState<CartItem[] | null>(null)

useEffect(() => {
  const loadedCart = loadCart()
  setCart(loadedCart)
}, [])

useEffect(() => {
  if (cart) saveCart(cart)
}, [cart])


  const subtotal = useMemo(() => (cart ?? []).reduce((s, it) => s + it.price * it.quantity, 0), [cart])

  const shipping = 0
  const total = subtotal + shipping

  const updateQuantity = (item: CartItem, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(p => p.id !== item.id))
      return
    }
    setCart(prev => prev.map(p => (p.id === item.id ? { ...p, quantity: qty } : p)))
  }
  const removeItem = (item: CartItem) => setCart(prev => prev.filter(p => p.id !== item.id))
  const [expandedStep, setExpandedStep] = useState<1 | 2 | 3>(1)
  const [customer, setCustomer] = useState<CustomerData>(() => loadCustomer())

  useEffect(() => {
    saveCustomer(customer)
  }, [customer])

  const handleCustomerChange = (k: keyof CustomerData, v: string | boolean) => {
    setCustomer(prev => ({ ...prev, [k]: v } as CustomerData))
  }

  const [deliveryType, setDeliveryType] = useState<'domicilio' | 'tienda' | ''>('')
  const [departamento, setDepartamento] = useState('')
  const [provincia, setProvincia] = useState('')
  const [distrito, setDistrito] = useState('')
  const [foundStores, setFoundStores] = useState<typeof MOCK_STORES>([])
  const [selectedStore, setSelectedStore] = useState<typeof MOCK_STORES[0] | null>(null)
  const [recogerNombre, setRecogerNombre] = useState('')

  useEffect(() => {
    setSelectedStore(null)
  }, [departamento, provincia, distrito, deliveryType])

  const findStores = () => {
    const filtered = MOCK_STORES.filter(s =>
      (departamento ? s.dept.toLowerCase() === departamento.toLowerCase() : true) &&
      (provincia ? s.prov.toLowerCase().includes(provincia.toLowerCase()) : true) &&
      (distrito ? s.dist.toLowerCase().includes(distrito.toLowerCase()) : true)
    )
    setFoundStores(filtered)
  }

  const chooseStoreAndReturn = (store: typeof MOCK_STORES[0]) => {
    setSelectedStore(store)
  }

  const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'efectivo' | 'agencias' | ''>('')
  const [cardData, setCardData] = useState({
    holder: '',
    month: '',
    year: '',
    cvv: '',
    street: '',
    number: '',
    postal: '',
    departamento: '',
    provincia: '',
    distrito: '',
  })

  const [orderSuccess, setOrderSuccess] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const canContinueFromCustomer =
    !!customer.nombre.trim() &&
    !!customer.apellidos.trim() &&
    !!customer.correo.trim() &&
    !!customer.documento.trim() &&
    !!customer.telefono.trim() &&
    customer.terminos &&
    customer.privacidad

  const canContinueFromDelivery =
    (deliveryType === 'domicilio' && departamento && provincia && distrito) ||
    (deliveryType === 'tienda' && selectedStore && recogerNombre.trim())

  const handleCompletePurchase = () => {
    const order = {
      id: `ORD-${Date.now()}`,
      customer,
      cart,
      total,
      delivery: deliveryType === 'domicilio' ? { departamento, provincia, distrito } : { store: selectedStore, recogerNombre },
      payment: paymentMethod,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('last_order', JSON.stringify(order))
    setCart([])
    saveCart([])
    setOrderSuccess(true)
    setShowSuccessModal(true)
    setTimeout(() => {
      setShowSuccessModal(false)
      router.push('/')
    }, 3000)
  }

  const renderStepHeader = (step: 1 | 2 | 3, title: string, subtitle: string) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">{step}</div>
        <div>
          <h2 className="font-semibold text-gray-600 text-lg">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <button onClick={() => setExpandedStep(step)} className="text-sm text-gray-600 hover:text-red-600">Editar</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h1 className="text-2xl font-bold text-red-600">MiguelStore</h1>
            <p className="text-sm text-gray-500 mt-1">
              Solo son datos para el portafolio — puede poner datos ficticios.
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            {renderStepHeader(1, 'Tus datos', 'Datos del cliente (correo, nombre, documento, RUC, etc.)')}

            {expandedStep === 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-500 font-medium">Correo</label>
                    <input value={customer.correo} onChange={e => handleCustomerChange('correo', e.target.value)} className="w-full border border-gray-500 rounded text-gray-500 px-3 py-2 mt-1" placeholder="correo@ejemplo.com"/>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium">Documento de identidad</label>
                    <input value={customer.documento} onChange={e => handleCustomerChange('documento', e.target.value)} className="w-full border border-gray-500 rounded text-gray-500 px-3 py-2 mt-1" placeholder="DNI / Carnet"/>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 font-medium">Nombre</label>
                    <input value={customer.nombre} onChange={e => handleCustomerChange('nombre', e.target.value)} className="w-full border border-gray-500 rounded text-gray-500 px-3 py-2 mt-1" placeholder="Nombre"/>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium">Apellidos</label>
                    <input value={customer.apellidos} onChange={e => handleCustomerChange('apellidos', e.target.value)} className="w-full border border-gray-500 rounded text-gray-500 px-3 py-2 mt-1" placeholder="Apellidos"/>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 font-medium">Teléfono</label>
                    <input value={customer.telefono} onChange={e => handleCustomerChange('telefono', e.target.value)} className="w-full border border-gray-500 rounded text-gray-500 px-3 py-2 mt-1" placeholder="999 999 999"/>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium">Cumpleaños</label>
                    <input type="date" value={customer.cumpleanos} onChange={e => handleCustomerChange('cumpleanos', e.target.value)} className="w-full border border-gray-500 rounded text-gray-500 px-3 py-2 mt-1"/>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 font-medium">Razón Social</label>
                    <input value={customer.razonSocial} onChange={e => handleCustomerChange('razonSocial', e.target.value)} className="w-full border border-gray-500 rounded text-gray-500 px-3 py-2 mt-1" placeholder="Empresa S.A."/>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium">RUC</label>
                    <input value={customer.ruc} onChange={e => handleCustomerChange('ruc', e.target.value)} className="w-full border rounded border-gray-500 text-gray-500 px-3 py-2 mt-1" placeholder="20123456789"/>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-3 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={customer.terminos} onChange={e => handleCustomerChange('terminos', e.target.checked)} />
                    <span className="text-sm text-gray-500">Acepto términos y condiciones</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={customer.privacidad} onChange={e => handleCustomerChange('privacidad', e.target.checked)} />
                    <span className="text-sm text-gray-500">Acepto aviso de privacidad</span>
                  </label>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    disabled={!canContinueFromCustomer}
                    onClick={() => { setExpandedStep(2); }}
                    className="bg-red-600 disabled:opacity-50 text-white px-6 py-2 rounded shadow"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            {renderStepHeader(2, 'Envío / Retiro en tienda', 'Selecciona cómo quieres recibir tu pedido')}

            {expandedStep === 2 && (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeliveryType('domicilio')}
                    className={`px-4 py-2 rounded border text-gray-500 ${deliveryType === 'domicilio' ? 'bg-red-600 text-white' : ''}`}
                  >
                    Envío a domicilio
                  </button>
                  <button
                    onClick={() => setDeliveryType('tienda')}
                    className={`px-4 py-2 rounded border text-gray-500 ${deliveryType === 'tienda' ? 'bg-red-600 text-white' : ''}`}
                  >
                    Retiro en tienda
                  </button>
                </div>

                {deliveryType === 'domicilio' && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm text-gray-500">Departamento</label>
                      <select value={departamento} onChange={e => { setDepartamento(e.target.value); setProvincia(''); setDistrito('') }} className="w-full border text-gray-500 rounded px-3 py-2 mt-1">
                        <option value="">Seleccione</option>
                        {DEPARTAMENTOS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Provincia</label>
                      <select value={provincia} onChange={e => { setProvincia(e.target.value); setDistrito('') }} className="w-full border text-gray-500 rounded px-3 py-2 mt-1">
                        <option value="">Seleccione</option>
                        {departamento && DEPARTAMENTOS.find(d => d.name === departamento)?.provincias.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Distrito</label>
                      <select value={distrito} onChange={e => setDistrito(e.target.value)} className="w-full border text-gray-500 rounded px-3 py-2 mt-1">
                        <option value="">Seleccione</option>
                        {provincia && DEPARTAMENTOS.flatMap(d => d.provincias).find(p => p.name === provincia)?.distritos.map(x => <option key={x} value={x}>{x}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {deliveryType === 'tienda' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm text-gray-500">Departamento</label>
                        <select value={departamento} onChange={e => { setDepartamento(e.target.value); setProvincia(''); setDistrito('') }} className="w-full border text-gray-500 rounded px-3 py-2 mt-1">
                          <option value="">Seleccione</option>
                          {DEPARTAMENTOS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Provincia</label>
                        <select value={provincia} onChange={e => { setProvincia(e.target.value); setDistrito('') }} className="w-full border text-gray-500 rounded px-3 py-2 mt-1">
                          <option value="">Seleccione</option>
                          {departamento && DEPARTAMENTOS.find(d => d.name === departamento)?.provincias.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Distrito</label>
                        <select value={distrito} onChange={e => setDistrito(e.target.value)} className="w-full border text-gray-500 rounded px-3 py-2 mt-1">
                          <option value="">Seleccione</option>
                          {provincia && DEPARTAMENTOS.flatMap(d => d.provincias).find(p => p.name === provincia)?.distritos.map(x => <option key={x} value={x}>{x}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-3">
                      <button onClick={findStores} className="bg-red-600 text-white px-4 py-2 rounded">Buscar</button>
                      <span className="text-sm text-gray-500 self-center">Busca tiendas donde recoger</span>
                    </div>

                    {foundStores.length > 0 && !selectedStore && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {foundStores.map(s => (
                          <div key={s.id} className="border rounded p-3">
                            <h3 className="font-semibold text-gray-500">{s.name}</h3>
                            <p className="text-sm text-gray-600">{s.address} — {s.dist}, {s.dept}</p>
                            <p className="text-sm text-gray-600">Horario: {s.hours}</p>
                            <p className="text-sm text-green-600 mt-2">Productos disponibles</p>
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => chooseStoreAndReturn(s)} className="bg-white border px-3 py-1 rounded">Ver tienda</button>
                              <button onClick={() => { chooseStoreAndReturn(s); }} className="bg-red-600 text-white px-3 py-1 rounded">Recoger en esta tienda</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedStore && (
                      <div className="mt-4 border rounded p-3 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-500">{selectedStore.name}</h3>
                            <p className="text-sm text-gray-600">{selectedStore.address}</p>
                            <p className="text-sm text-gray-600">{selectedStore.dist}, {selectedStore.dept}</p>
                            <p className="text-sm text-green-600 mt-2">Tu pedido está disponible en esta tienda. Te esperamos para recogerlo.</p>
                            <p className="text-sm text-gray-500">Horario: {selectedStore.hours}</p>
                          </div>
                          <div className="text-right">
                            <button className="bg-white border text-gray-500 px-3 py-1 rounded mb-2" onClick={() => { setSelectedStore(null); setFoundStores([]); }}>Ver tiendas</button>
                            <div>
                              <label className="text-sm text-gray-500">Nombre completo quien recogerá</label>
                              <input className="border rounded text-gray-500 px-3 py-2 mt-1" value={recogerNombre} onChange={e => setRecogerNombre(e.target.value)} placeholder="Nombre y apellidos"/>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => { /* confirmar seleccionar tienda */ }}>Recoger en esta tienda</button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="mt-4 flex justify-center">
                  <button disabled={!canContinueFromDelivery} onClick={() => { setExpandedStep(3) }} className="bg-red-600 disabled:opacity-50 text-white px-6 py-2 rounded shadow">Ir a pagar</button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            {renderStepHeader(3, 'Pagar', 'Selecciona forma de pago y completa los datos')}

            {expandedStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-500 font-medium mb-1">Método de pago</label>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setPaymentMethod('tarjeta')} className={`px-3 py-5 rounded border text-gray-500 ${paymentMethod === 'tarjeta' ? 'bg-red-600 text-white' : ''}`}>Tarjeta crédito/débito</button>
                      <button onClick={() => setPaymentMethod('efectivo')} className={`px-3 py-5 rounded border text-gray-500 ${paymentMethod === 'efectivo' ? 'bg-red-600 text-white' : ''}`}>Efectivo (retiro)</button>
                      <button onClick={() => setPaymentMethod('agencias')} className={`px-3 py-5 rounded border text-gray-500 ${paymentMethod === 'agencias' ? 'bg-red-600 text-white' : ''}`}>Pago en agencias</button>
                    </div>
                  </div>
                </div>
                
                <div>
                  {paymentMethod === 'tarjeta' && (
                    <div className="border rounded p-4">
                      <label className="text-sm text-gray-500">Número de tarjeta</label>
                      <input value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})} className="w-full border rounded text-gray-500 px-3 py-2 mt-1 mb-2" placeholder="XXXX XXXX XXXX XXXX"/>

                      <div className="flex-1 mb-4">
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 border rounded px-2 py-1">
                              <input type="radio" name="cardtype" defaultChecked/>
                              <span className="text-sm text-gray-500">Visa</span>
                            </label>
                            <label className="flex items-center gap-2 border rounded px-2 py-1">
                              <input type="radio" name="cardtype"/>
                              <span className="text-sm text-gray-500">Mastercard</span>
                            </label>
                            <label className="flex items-center gap-2 border rounded px-2 py-1">
                              <input type="radio" name="cardtype"/>
                              <span className="text-sm text-gray-500">Diners</span>
                            </label>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <div className="flex-1">
                          <label className="text-sm text-gray-500">Nombre y apelldos como figura en la tarjeta</label>
                          <input value={cardData.holder} onChange={e => setCardData({...cardData, holder: e.target.value})} className="w-full border rounded text-gray-500 px-3 py-2 mt-1" placeholder="NOMBRE APELLIDOS"/>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <label className="text-sm text-gray-500 mt-5">Fecha de vencimiento</label>
                        <div className="w-32">
                          <label className="text-sm text-gray-500">Mes</label>
                          <select value={cardData.month} onChange={e => setCardData({...cardData, month: e.target.value})} className="w-full border rounded text-gray-500 px-2 py-2 mt-1">
                            <option value="">MM</option>
                            {Array.from({length:12}).map((_,i) => <option key={i} value={(i+1).toString().padStart(2,'0')}>{(i+1).toString().padStart(2,'0')}</option>)}
                          </select>
                        </div>
                        <div className="w-32">
                          <label className="text-sm text-gray-500">Año</label>
                          <select value={cardData.year} onChange={e => setCardData({...cardData, year: e.target.value})} className="w-full border rounded text-gray-500 px-2 py-2 mt-1">
                            <option value="">YY</option>
                            {Array.from({length:12}).map((_,i) => {
                              const y = new Date().getFullYear() + i
                              return <option key={y} value={y.toString()}>{y}</option>
                            })}
                          </select>
                        </div>
                      </div>

                      
                        <div className="flex gap-2 mb-4 w-53">
                          <label className="text-sm text-gray-500">Codigo de Seguridad</label>
                          <input value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} className="w-full border rounded text-gray-500 px-3 py-2 mt-1" placeholder="CVV"/>
                        </div>                       
                      

                      <div>
                        <label className="text-sm text-gray-500">Dirección de facturación</label>
                        <input value={cardData.street} onChange={e => setCardData({...cardData, street: e.target.value})} className="w-full border rounded text-gray-500 px-2 py-2 mt-1 mb-2" placeholder="Calle"/>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pb-2">
                          <input value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})} className="border rounded text-gray-500 px-2 py-2" placeholder="N.º"/>
                          <input value={cardData.postal} onChange={e => setCardData({...cardData, postal: e.target.value})} className="border rounded text-gray-500 px-2 py-2" placeholder="Piso / Dpto"/>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pb-2">
                          <select
                            value={cardData.departamento}
                            onChange={(e) => {
                              const depId = e.target.value
                              const dep = DEPARTAMENTOS.find((d) => d.id === depId)
                              setCardData({
                                ...cardData,
                                departamento: depId,
                                provincia: '',
                                distrito: '',
                              })
                            }}
                            className="border rounded text-gray-500 px-2 py-2"
                          >
                            <option value="">Departamento</option>
                            {DEPARTAMENTOS.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>

                          <select
                            value={cardData.provincia}
                            onChange={(e) => {
                              const provId = e.target.value
                              setCardData({
                                ...cardData,
                                provincia: provId,
                                distrito: '',
                              })
                            }}
                            className="border rounded text-gray-500 px-2 py-2"
                            disabled={!cardData.departamento}
                          >
                            <option value="">Provincia</option>
                            {cardData.departamento &&
                              DEPARTAMENTOS.find((d) => d.id === cardData.departamento)?.provincias.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                          </select>

                          <select
                            value={cardData.distrito}
                            onChange={(e) =>
                              setCardData({
                                ...cardData,
                                distrito: e.target.value,
                              })
                            }
                            className="border rounded text-gray-500 px-2 py-2"
                            disabled={!cardData.provincia}
                          >
                            <option value="">Distrito</option>
                            {cardData.departamento &&
                              cardData.provincia &&
                              DEPARTAMENTOS.find((d) => d.id === cardData.departamento)?.provincias.find(
                                (p) => p.id === cardData.provincia
                              )?.distritos.map((dist) => (
                                <option key={dist} value={dist}>
                                  {dist}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                
                  {paymentMethod === 'efectivo' && (
                    <div className="border rounded p-4">
                      <p className="text-sm text-gray-500">Pagarás en efectivo al recoger en tienda.</p>
                    </div>
                  )}

                  {paymentMethod === 'agencias' && (
                    <div className="border rounded p-4">
                      <p className="text-sm text-gray-500">Te daremos los datos para pagar en agencia (ej. PagoEfectivo) tras confirmar.</p>
                    </div>
                  )}    
                </div>                            
              </div>
            )}
          </div>

          {orderSuccess && !showSuccessModal && (
            <div className="bg-green-50 border border-green-200 p-4 rounded text-green-800">
              ¡Compra realizada con éxito! Guarda tu comprobante. (Esto es un mock — datos guardados en localStorage)
            </div>
          )}
        </div>
      <div>
      <div className="bg-white border rounded p-4 md:mt-28">
        <h3 className="font-semibold text-gray-500">Tu pedido</h3>
          <div className="space-y-3 mt-3">
            {cart === null ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : cart.length === 0 ? (
              <p className="text-sm text-gray-500">No hay productos en la bolsa</p>
            ) : cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 border-b pb-3">
                <div className="w-20 h-20 relative">
                  <Image src={item.image} alt={item.title} width={80} height={80} className="object-contain rounded" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-500">{item.title}</h4>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeItem(item)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => updateQuantity(item, item.quantity - 1)} className="w-7 h-7 border rounded text-gray-500">-</button>
                    <span className="text-gray-500 px-2">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item, item.quantity + 1)} className="w-7 h-7 border rounded text-gray-500">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Gastos de envío</span>
              <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-lg text-gray-500 font-bold mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="mt-3">
              <button
                onClick={handleCompletePurchase}
                disabled={!paymentMethod}
                className="w-full bg-red-600 disabled:opacity-50 text-white px-3 py-2 rounded"
              >
                Comprar ahora
              </button>
            </div>
          </div>
      </div>

      <div className="mt-3 border rounded p-3 bg-white">
        <p className="text-sm text-gray-600">Pago seguro • Devoluciones en 30 días • Atención al cliente</p>
      </div>
    </div>
  </div>

  {showSuccessModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Compra realizada con éxito</h2>
        <p className="text-gray-700 mb-4">Gracias por tu compra. Serás redirigido a la página principal en unos segundos.</p>
        <button onClick={() => { setShowSuccessModal(false); router.push('/') }} className="px-4 py-2 bg-green-700 text-white rounded">Ir ahora al inicio</button>
      </div>
    </div>
  )}
  </div>
  )
}