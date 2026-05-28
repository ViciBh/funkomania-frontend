/* MOCK DB - Usuario administrador */
export const mockAdmin = {
  idUsuario: 2,
  email: 'admin@funkomania.com',
  passwordHash: 'mock-admin-password-hash',
  Nombre: 'Antonio',
  Apellido1: 'Perez',
  Apellido2: null,
  Telefono: '600000000',
  FechaRegistro: '2026-05-01 09:00:00',
  UltimoLogin: '2026-05-27 18:30:00',
  Rol: 'admin',
  Activo: 1
}

/* MOCK DB - Usuario clientes */
export const mockUsers = [
  {
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
  },
  {
    idUsuario: 3,
    email: 'maria@example.com',
    passwordHash: 'mock-password-hash',
    Nombre: 'María',
    Apellido1: 'López',
    Apellido2: 'Pérez',
    Telefono: '611222333',
    FechaRegistro: '2026-05-10 12:15:00',
    UltimoLogin: '2026-05-25 09:20:00',
    Rol: 'cliente',
    Activo: 1
  },
  {
    idUsuario: 4,
    email: 'cliente.inactivo@example.com',
    passwordHash: 'mock-password-hash',
    Nombre: 'Carlos',
    Apellido1: 'Martínez',
    Apellido2: null,
    Telefono: null,
    FechaRegistro: '2026-05-12 16:40:00',
    UltimoLogin: null,
    Rol: 'cliente',
    Activo: 0
  }
]

/* MOCK DB - Pedido / VPedidos_Admin */
export const mockOrders = [
  {
    idPedido: 1,
    CodigoPedido: 'FM100001',
    idUsuario: 1,
    Cliente: 'Anna Galindo',
    email: 'cliente@funkomania.com',
    FechaPedido: '2026-05-20 14:25:00',
    EstadoPedido: 'pagado',
    idDireccion: 2,
    idMetodoPago: 1,
    MetodoPago: 'Tarjeta bancaria',
    TotalSinIVA: 47.05,
    TotalIVA: 9.89,
    TotalConIVA: 56.93
  },
  {
    idPedido: 2,
    CodigoPedido: 'FM100002',
    idUsuario: 3,
    Cliente: 'María López',
    email: 'maria@example.com',
    FechaPedido: '2026-05-22 18:10:00',
    EstadoPedido: 'preparando',
    idDireccion: 4,
    idMetodoPago: 2,
    MetodoPago: 'PayPal',
    TotalSinIVA: 32.20,
    TotalIVA: 6.76,
    TotalConIVA: 38.96
  },
  {
    idPedido: 3,
    CodigoPedido: 'FM100003',
    idUsuario: 1,
    Cliente: 'Anna Galindo',
    email: 'cliente@funkomania.com',
    FechaPedido: '2026-05-24 11:05:00',
    EstadoPedido: 'pendiente',
    idDireccion: 2,
    idMetodoPago: 3,
    MetodoPago: 'Transferencia bancaria',
    TotalSinIVA: 18.99,
    TotalIVA: 3.99,
    TotalConIVA: 22.98
  }
]

/* MOCK DB - Detalle_Pedido / VDetalle_Pedido */
export const mockOrderDetails = [
  {
    idPedido: 1,
    idProducto: 1,
    NombreProducto: 'Funko Pop Spider-Man',
    Cantidad: 2,
    PrecioUnitarioSinIVA: 14.03,
    IVA: 21,
    SubtotalSinIVA: 28.06,
    SubtotalConIVA: 33.96
  },
  {
    idPedido: 1,
    idProducto: 2,
    NombreProducto: 'Funko Pop Darth Vader',
    Cantidad: 1,
    PrecioUnitarioSinIVA: 18.99,
    IVA: 21,
    SubtotalSinIVA: 18.99,
    SubtotalConIVA: 22.98
  },
  {
    idPedido: 2,
    idProducto: 3,
    NombreProducto: 'Funko Pop Hermione Granger',
    Cantidad: 2,
    PrecioUnitarioSinIVA: 16.10,
    IVA: 21,
    SubtotalSinIVA: 32.20,
    SubtotalConIVA: 38.96
  },
  {
    idPedido: 3,
    idProducto: 2,
    NombreProducto: 'Funko Pop Darth Vader',
    Cantidad: 1,
    PrecioUnitarioSinIVA: 18.99,
    IVA: 21,
    SubtotalSinIVA: 18.99,
    SubtotalConIVA: 22.98
  }
]

/* HELPERS ADMIN MOCK */
export function getAdminOrders() {
  return mockOrders
}

export function getOrderDetails(idPedido) {
  return mockOrderDetails.filter((detail) => detail.idPedido === idPedido)
}

export function getClientUsers() {
  return mockUsers.filter((user) => user.Rol === 'cliente')
}

export function getActiveClientUsers() {
  return mockUsers.filter((user) => user.Rol === 'cliente' && user.Activo === 1)
}