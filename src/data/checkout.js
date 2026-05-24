/* MOCK DB - Usuario */
export const mockUser = {
  idUsuario: 1,
  email: 'cliente@funkomania.com',
  passwordHash: 'mock-password-hash',
  Nombre: 'Anna',
  Apellido1: 'Galindo',
  Apellido2: null,
  Telefono: '600123456',
  FechaRegistro: '2026-05-01 10:30:00',
  UltimoLogin: '2026-05-24 18:45:00',
  Rol: 'cliente',
  Activo: 1
}

/* MOCK DB - Direccion
   Direccion pertenece a Usuario mediante idUsuario.
   Solo una dirección está activa para el usuario, como en sp_activar_direccion_usuario.
*/
export const mockAddresses = [
  {
    idDireccion: 1,
    idUsuario: 1,
    Calle: 'Calle Mayor',
    Numero: '12',
    Piso: '2B',
    Puerta: null,
    Ciudad: 'Murcia',
    Municipio: 'Murcia',
    Provincia: 'Murcia',
    CP: '30001',
    Activo: 0
  },
  {
    idDireccion: 2,
    idUsuario: 1,
    Calle: 'Avenida Juan Carlos I',
    Numero: '45',
    Piso: '3A',
    Puerta: null,
    Ciudad: 'Murcia',
    Municipio: 'Murcia',
    Provincia: 'Murcia',
    CP: '30009',
    Activo: 1
  },
  {
    idDireccion: 3,
    idUsuario: 1,
    Calle: 'Calle Trapería',
    Numero: '8',
    Piso: null,
    Puerta: null,
    Ciudad: 'Murcia',
    Municipio: 'Murcia',
    Provincia: 'Murcia',
    CP: '30001',
    Activo: 0
  }
]

/* MOCK DB - Metodo_Pago
   Metodo_Pago NO pertenece a Usuario.
   Es una tabla general de métodos de pago disponibles en la tienda.
   La simulación de pago se hace en frontend/backend, pero NO se guardan datos sensibles.
   RequiereFormulario y Mensaje son campos auxiliares solo para simular el checkout.
*/
export const mockPaymentMethods = [
  {
    idMetodoPago: 1,
    Nombre: 'Tarjeta bancaria',
    Activo: 1,
    RequiereFormulario: true,
    Mensaje: 'Pago simulado con tarjeta bancaria.'
  },
  {
    idMetodoPago: 2,
    Nombre: 'PayPal',
    Activo: 1,
    RequiereFormulario: false,
    Mensaje: 'Simulación de redirección a PayPal.'
  },
  {
    idMetodoPago: 3,
    Nombre: 'Transferencia bancaria',
    Activo: 1,
    RequiereFormulario: false,
    Mensaje: 'Simulación de pago por transferencia bancaria.'
  },
  {
    idMetodoPago: 4,
    Nombre: 'Bizum',
    Activo: 0,
    RequiereFormulario: false,
    Mensaje: 'Método de pago no disponible actualmente.'
  }
]

/* HELPERS CHECKOUT MOCK */
export function getUserAddresses(idUsuario = mockUser.idUsuario) {
  return mockAddresses.filter((address) => address.idUsuario === idUsuario)
}

export function getActiveAddress(idUsuario = mockUser.idUsuario) {
  return mockAddresses.find((address) => address.idUsuario === idUsuario && address.Activo === 1)
}

export function getActiveAddressId(idUsuario = mockUser.idUsuario) {
  return getActiveAddress(idUsuario)?.idDireccion || null
}

export function getActivePaymentMethods() {
  return mockPaymentMethods.filter((method) => method.Activo === 1)
}

export function getPaymentMethodById(idMetodoPago) {
  return mockPaymentMethods.find((method) => method.idMetodoPago === idMetodoPago) || null
}

export function getDefaultPaymentMethod() {
  return getActivePaymentMethods()[0] || null
}

export function getDefaultPaymentMethodId() {
  return getDefaultPaymentMethod()?.idMetodoPago || null
}

export function formatAddress(address) {
  if (!address) return ''

  return `${address.Calle} ${address.Numero}${address.Piso ? ', Piso ' + address.Piso : ''}${address.Puerta ? ', Puerta ' + address.Puerta : ''}, ${address.CP}, ${address.Ciudad} (${address.Provincia})`
}

export function simulatePayment(idMetodoPago) {
  const method = getPaymentMethodById(idMetodoPago)

  if (!method || method.Activo !== 1) {
    return {
      success: false,
      message: 'El método de pago seleccionado no está disponible.'
    }
  }

  return {
    success: true,
    message: method.Mensaje
  }
}