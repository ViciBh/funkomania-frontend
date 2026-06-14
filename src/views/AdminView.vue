/**
 * Vista del panel de administración de Funkomanía.
 * Permite gestionar usuarios, productos, categorías y pedidos desde una interfaz de administración.
 *
 * @author Viktoriia Bohoslavska
 */
<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AlertTriangle, BadgePercent, Boxes, ChevronLeft, ChevronRight, Edit, Eye, ImagePlus, LogOut, PackagePlus, PackageSearch, Plus, Save, Search, ShieldCheck, ShoppingBag, Trash2, UserRound, X } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { getProductImage } from '@/data/products'
import { getAdminStockAlerts, getAdminUsers, getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct, getAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory, getAdminOrders, getAdminOrderDetail, createAdminOrder, updateAdminOrder, addAdminOrderLine, updateAdminOrderLine, deleteAdminOrderLine, getPaymentMethods } from '@/services/adminService'

const router = useRouter()
const { authUser, clearAuthUser } = useAuth()
const activeSection = ref('datos')
const summaryOpen = ref(false)
const userSearch = ref('')
const productSearch = ref('')
const categorySearch = ref('')
const orderSearch = ref('')
const globalMessage = ref('')
const globalError = ref('')
const stockAlerts = ref([])
const usersList = ref([])
const productList = ref([])
const categoryList = ref([])
const orderList = ref([])
const paymentMethods = ref([])
const stockAlertsLoading = ref(false)
const usersLoading = ref(false)
const productsLoading = ref(false)
const categoriesLoading = ref(false)
const ordersLoading = ref(false)
const orderDetailLoading = ref(false)
const paymentMethodsLoading = ref(false)
const stockAlertsError = ref('')
const usersError = ref('')
const productsError = ref('')
const categoriesError = ref('')
const ordersError = ref('')
const orderDetailError = ref('')
const paymentMethodsError = ref('')
const productModalOpen = ref(false)
const productModalMode = ref('edit')
const categoryModalOpen = ref(false)
const categoryModalMode = ref('edit')
const orderModalOpen = ref(false)
const orderModalMode = ref('edit')
const selectedOrder = ref(null)
const orderStatusOptions = ['PENDIENTE', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO']
const paymentStatusOptions = ['PENDIENTE', 'PAGADO', 'RECHAZADO']
const productForm = ref({
  idProducto: null,
  Nombre: '',
  Precio: 0,
  iva: 21,
  Stock: 0,
  Image: '',
  Descripcion: '',
  Activo: 1,
  idCategoria: null,
  EnOferta: 0,
  Descuento: 0,
  FechaFinOferta: ''
})
const categoryForm = ref({
  idCategoria: null,
  Nombre: '',
  CategoriaPadre: null
})
const categoryMode = ref('existing')
const newCategoryName = ref('')
const categoryParentId = ref(null)

function asArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.items)) return data.items
  if (data && typeof data === 'object') return [data]
  return []
}

function getFirstValue(item, keys, fallback = null) {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null) return item[key]
  }

  return fallback
}

function normalizeBoolean(value) {
  return value === true || value === 1 || value === '1' || String(value).toUpperCase() === 'TRUE'
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isNaN(number) ? fallback : number
}

function formatBackendDate(value) {
  if (!value) return ''
  return String(value).slice(0, 16)
}

function clearMessages() {
  globalMessage.value = ''
  globalError.value = ''
}

function showMessage(message) {
  globalMessage.value = message
  globalError.value = ''
}

function showError(message, error) {
  globalError.value = message
  globalMessage.value = ''
  console.error(message, error)
}

function normalizeUser(user) {
  return {
    idUsuario: getFirstValue(user, ['idUsuario', 'id'], ''),
    email: getFirstValue(user, ['email'], ''),
    Nombre: getFirstValue(user, ['Nombre', 'nombre'], 'Usuario'),
    Apellido1: getFirstValue(user, ['Apellido1', 'apellido1'], ''),
    Apellido2: getFirstValue(user, ['Apellido2', 'apellido2'], ''),
    Telefono: getFirstValue(user, ['Telefono', 'telefono'], ''),
    Rol: String(getFirstValue(user, ['Rol', 'rol'], 'CLIENTE')).toUpperCase(),
    Activo: normalizeBoolean(getFirstValue(user, ['Activo', 'activo'], true)) ? 1 : 0
  }
}

function normalizeProduct(product) {
  const idProducto = getFirstValue(product, ['idProducto', 'id'], null)
  const precioOriginalSinIva = normalizeNumber(getFirstValue(product, ['PrecioOriginal_SinIVA', 'precioOriginalSinIVA', 'precio', 'Precio'], 0))
  const precioOriginalConIva = normalizeNumber(getFirstValue(product, ['PrecioOriginal_ConIVA', 'precioOriginalConIVA'], 0))
  const precioFinalSinIva = normalizeNumber(getFirstValue(product, ['PrecioFinal_SinIVA', 'precioFinalSinIVA'], precioOriginalSinIva))
  const precioFinalConIva = normalizeNumber(getFirstValue(product, ['PrecioFinal_ConIVA', 'precioFinalConIVA'], precioOriginalConIva))
  const iva = normalizeNumber(getFirstValue(product, ['iva', 'IVA'], 21), 21)
  const enOferta = normalizeBoolean(getFirstValue(product, ['EnOferta', 'enOferta'], false))
  const activo = normalizeBoolean(getFirstValue(product, ['Activo', 'activo'], true))

  return {
    idProducto,
    Nombre: getFirstValue(product, ['Nombre', 'nombre'], 'Producto sin nombre'),
    Precio: precioOriginalSinIva,
    iva,
    Stock: normalizeNumber(getFirstValue(product, ['Stock', 'stock'], 0)),
    Image: getFirstValue(product, ['Image', 'imagen'], ''),
    Descripcion: getFirstValue(product, ['Descripcion', 'descripcion'], ''),
    Activo: activo ? 1 : 0,
    idCategoria: getFirstValue(product, ['idCategoria'], null),
    EnOferta: enOferta ? 1 : 0,
    Descuento: normalizeNumber(getFirstValue(product, ['Descuento', 'descuento'], 0)),
    FechaFinOferta: formatBackendDate(getFirstValue(product, ['FechaFinOferta', 'fechaFinOferta'], '')),
    PrecioOriginal_SinIVA: precioOriginalSinIva,
    PrecioOriginal_ConIVA: precioOriginalConIva,
    PrecioFinal_SinIVA: precioFinalSinIva,
    PrecioFinal_ConIVA: precioFinalConIva,
    NombreCategoria: getFirstValue(product, ['NombreCategoria', 'nombreCategoria'], ''),
    NombreCategoriaPadre: getFirstValue(product, ['NombreCategoriaPadre', 'nombreCategoriaPadre'], '')
  }
}

function normalizeCategory(category) {
  const parent = getFirstValue(category, ['categoriaPadre', 'CategoriaPadre'], null)
  const idParent = typeof parent === 'object' && parent !== null ? getFirstValue(parent, ['id', 'idCategoria'], null) : parent

  return {
    idCategoria: getFirstValue(category, ['idCategoria', 'id'], null),
    Nombre: getFirstValue(category, ['Nombre', 'nombre'], 'Categoría sin nombre'),
    CategoriaPadre: idParent,
    productosAsociados: asArray(getFirstValue(category, ['productosAsociados'], []))
  }
}

function normalizeStockAlert(alert) {
  return {
    idProducto: getFirstValue(alert, ['idProducto', 'idproducto'], null),
    Nombre: getFirstValue(alert, ['Nombre', 'nombre', 'nombreProducto'], 'Producto sin nombre'),
    Stock: normalizeNumber(getFirstValue(alert, ['Stock', 'stock'], 0)),
    idCategoria: getFirstValue(alert, ['idCategoria', 'idcategoria'], null),
    Prioridad: getFirstValue(alert, ['Prioridad', 'prioridad'], 'Bajo')
  }
}

function normalizePaymentMethod(method) {
  return {
    idMetodoPago: getFirstValue(method, ['idMetodoPago', 'id'], null),
    Nombre: getFirstValue(method, ['Nombre', 'nombre'], 'Método de pago'),
    Activo: normalizeBoolean(getFirstValue(method, ['Activo', 'activo'], true)) ? 1 : 0
  }
}

function normalizeOrder(order) {
  return {
    idPedido: getFirstValue(order, ['idPedido'], null),
    CodigoPedido: getFirstValue(order, ['CodigoPedido', 'codigoPedido'], ''),
    idUsuario: getFirstValue(order, ['idUsuario'], null),
    Cliente: getFirstValue(order, ['Cliente', 'nombreUsuario', 'Nombre_Usuario'], 'Cliente Funkomanía'),
    Email: getFirstValue(order, ['Email', 'emailUsuario', 'Email_Usuario'], ''),
    Telefono: getFirstValue(order, ['Telefono', 'telefono'], ''),
    DireccionEnvio: getFirstValue(order, ['DireccionEnvio', 'direccionEnvio'], ''),
    FechaPedido: String(getFirstValue(order, ['FechaPedido', 'fechaPedido'], '')).slice(0, 10),
    EstadoPedido: getFirstValue(order, ['EstadoPedido', 'estadoPedido'], 'PENDIENTE'),
    EstadoPago: getFirstValue(order, ['EstadoPago', 'estadoPago'], 'PENDIENTE'),
    MetodoPago: getFirstValue(order, ['MetodoPago', 'metodoPago'], ''),
    idMetodoPago: getFirstValue(order, ['idMetodoPago'], null),
    idDireccion: getFirstValue(order, ['idDireccion'], null),
    Comentarios: getFirstValue(order, ['Comentarios', 'comentarios'], ''),
    TotalConIVA: normalizeNumber(getFirstValue(order, ['TotalConIVA', 'totalConIVA', 'totalPedido'], 0)),
    Productos: []
  }
}

function normalizeOrderLine(line) {
  return {
    idLinea: `${getFirstValue(line, ['idPedido'], 'pedido')}-${getFirstValue(line, ['idProducto'], 'producto')}-${Date.now()}-${Math.random()}`,
    idPedido: getFirstValue(line, ['idPedido'], null),
    idProducto: getFirstValue(line, ['idProducto'], null),
    Nombre: getFirstValue(line, ['Nombre', 'nombreProducto'], 'Producto pedido'),
    Cantidad: normalizeNumber(getFirstValue(line, ['Cantidad', 'cantidad'], 1), 1),
    PrecioUnitario_SinIVA: normalizeNumber(getFirstValue(line, ['PrecioUnitario_SinIVA', 'precioUnitarioSinIVA', 'precioUnitario'], 0)),
    IVA: normalizeNumber(getFirstValue(line, ['IVA', 'iva', 'ivaPorcentaje'], 21), 21),
    _isNew: false
  }
}

function buildProductRequest() {
  return {
    idCategoria: Number(productForm.value.idCategoria),
    nombre: productForm.value.Nombre,
    precio: Number(productForm.value.Precio || 0),
    stock: Number(productForm.value.Stock || 0),
    imagen: productForm.value.Image || null,
    descripcion: productForm.value.Descripcion,
    iva: Number(productForm.value.iva || 0),
    activo: Number(productForm.value.Activo) === 1,
    enOferta: Number(productForm.value.EnOferta) === 1,
    descuento: Number(productForm.value.Descuento || 0),
    fechaFinOferta: productForm.value.FechaFinOferta || null
  }
}

function buildCategoryRequest(categoryData) {
  return {
    nombre: categoryData.Nombre,
    idCategoriaPadre: categoryData.CategoriaPadre ? Number(categoryData.CategoriaPadre) : null
  }
}

function buildOrderRequest(order) {
  return {
    idUsuario: Number(order.idUsuario),
    idDireccion: Number(order.idDireccion),
    idMetodoPago: Number(order.idMetodoPago),
    estadoPedido: order.EstadoPedido,
    estadoPago: order.EstadoPago,
    comentarios: order.Comentarios || '',
    productos: order.Productos.map((product) => ({
      idProducto: Number(product.idProducto),
      precioUnitarioSinIVA: Number(product.PrecioUnitario_SinIVA || 0),
      iva: Number(product.IVA || 0),
      cantidad: Number(product.Cantidad || 1)
    }))
  }
}

function buildOrderUpdateRequest(order) {
  return {
    estadoPedido: order.EstadoPedido,
    estadoPago: order.EstadoPago,
    idMetodoPago: Number(order.idMetodoPago || 0),
    comentarios: order.Comentarios || ''
  }
}

function buildOrderLineRequest(product) {
  return {
    idProducto: Number(product.idProducto),
    cantidad: Number(product.Cantidad || 1),
    precioUnitarioSinIVA: Number(product.PrecioUnitario_SinIVA || 0),
    IVA: Number(product.IVA || 0)
  }
}

async function loadStockAlerts() {
  stockAlertsLoading.value = true
  stockAlertsError.value = ''

  try {
    const data = await getAdminStockAlerts()
    stockAlerts.value = asArray(data).map(normalizeStockAlert)
  } catch (error) {
    stockAlerts.value = []
    stockAlertsError.value = 'No se pudieron cargar las alertas de stock.'
    console.error('Error cargando alertas de stock:', error)
  } finally {
    stockAlertsLoading.value = false
  }
}

async function loadUsers() {
  usersLoading.value = true
  usersError.value = ''

  try {
    const data = await getAdminUsers()
    usersList.value = asArray(data).map(normalizeUser)
  } catch (error) {
    usersList.value = []
    usersError.value = 'No se pudieron cargar los usuarios.'
    console.error('Error cargando usuarios:', error)
  } finally {
    usersLoading.value = false
  }
}

async function loadProducts() {
  productsLoading.value = true
  productsError.value = ''

  try {
    const data = await getAdminProducts()
    productList.value = asArray(data).map(normalizeProduct)
  } catch (error) {
    productList.value = []
    productsError.value = 'No se pudieron cargar los productos.'
    console.error('Error cargando productos:', error)
  } finally {
    productsLoading.value = false
  }
}

async function loadCategories() {
  categoriesLoading.value = true
  categoriesError.value = ''

  try {
    const data = await getAdminCategories()
    categoryList.value = asArray(data).map(normalizeCategory)
  } catch (error) {
    categoryList.value = []
    categoriesError.value = 'No se pudieron cargar las categorías.'
    console.error('Error cargando categorías:', error)
  } finally {
    categoriesLoading.value = false
  }
}

async function loadOrders() {
  ordersLoading.value = true
  ordersError.value = ''

  try {
    const data = await getAdminOrders()
    orderList.value = asArray(data).map(normalizeOrder)
  } catch (error) {
    orderList.value = []
    ordersError.value = 'No se pudieron cargar los pedidos.'
    console.error('Error cargando pedidos:', error)
  } finally {
    ordersLoading.value = false
  }
}

async function loadPaymentMethods() {
  paymentMethodsLoading.value = true
  paymentMethodsError.value = ''

  try {
    const data = await getPaymentMethods()
    paymentMethods.value = asArray(data).map(normalizePaymentMethod).filter((method) => method.Activo === 1)
  } catch (error) {
    paymentMethods.value = []
    paymentMethodsError.value = 'No se pudieron cargar los métodos de pago.'
    console.error('Error cargando métodos de pago:', error)
  } finally {
    paymentMethodsLoading.value = false
  }
}

async function loadAdminData() {
  await Promise.all([
    loadStockAlerts(),
    loadUsers(),
    loadProducts(),
    loadCategories(),
    loadOrders(),
    loadPaymentMethods()
  ])
}

const clientUsersForOrders = computed(() => {
  return usersList.value.filter((user) => user.Activo === 1 && String(user.Rol).toUpperCase() === 'CLIENTE')
})
const filteredUsers = computed(() => {
  const text = userSearch.value.trim().toLowerCase()

  return usersList.value.filter((user) => {
    return user.Nombre.toLowerCase().includes(text) ||
      user.Apellido1.toLowerCase().includes(text) ||
      user.email.toLowerCase().includes(text) ||
      String(user.idUsuario).includes(text)
  })
})

const filteredProducts = computed(() => {
  const text = productSearch.value.trim().toLowerCase()

  return productList.value.filter((product) => {
    return product.Nombre.toLowerCase().includes(text) ||
      product.NombreCategoria.toLowerCase().includes(text) ||
      product.Descripcion.toLowerCase().includes(text) ||
      String(product.idProducto).includes(text)
  })
})

const filteredCategories = computed(() => {
  const text = categorySearch.value.trim().toLowerCase()

  return categoryList.value.filter((category) => {
    return category.Nombre.toLowerCase().includes(text) ||
      String(category.idCategoria).includes(text) ||
      getCategoryParentName(category.CategoriaPadre).toLowerCase().includes(text)
  })
})

const filteredOrders = computed(() => {
  const text = orderSearch.value.trim().toLowerCase()

  return orderList.value.filter((order) => {
    return String(order.idPedido).includes(text) ||
      order.CodigoPedido.toLowerCase().includes(text) ||
      order.Cliente.toLowerCase().includes(text) ||
      order.Email.toLowerCase().includes(text) ||
      order.EstadoPedido.toLowerCase().includes(text) ||
      order.EstadoPago.toLowerCase().includes(text) ||
      order.MetodoPago.toLowerCase().includes(text)
  })
})

const selectedOrderProducts = computed(() => {
  return selectedOrder.value?.Productos || []
})

const selectedOrderTotal = computed(() => {
  return selectedOrderProducts.value.reduce((sum, product) => sum + getOrderLineSubtotal(product), 0)
})

const activeProducts = computed(() => {
  return productList.value.filter((product) => product.Activo === 1)
})

const inactiveProducts = computed(() => {
  return productList.value.filter((product) => product.Activo === 0)
})

const lowStockProducts = computed(() => {
  return stockAlerts.value
})

const activeOffers = computed(() => {
  const now = new Date()

  return productList.value.filter((product) => {
    const hasDate = product.FechaFinOferta ? new Date(product.FechaFinOferta) >= now : true
    return product.EnOferta === 1 && Number(product.Descuento) > 0 && product.Activo === 1 && hasDate
  })
})

const activePaymentMethods = computed(() => {
  return paymentMethods.value.filter((method) => method.Activo === 1)
})

const availableParentCategories = computed(() => {
  return categoryList.value.filter((category) => category.idCategoria !== Number(productForm.value.idCategoria))
})

const availableCategoryParentOptions = computed(() => {
  return categoryList.value.filter((category) => category.idCategoria !== Number(categoryForm.value.idCategoria))
})

const adminStats = computed(() => {
  return [
    {
      title: 'Alertas stock',
      value: lowStockProducts.value.length,
      text: 'Stock bajo o agotado',
      icon: AlertTriangle
    },
    {
      title: 'Productos activos',
      value: activeProducts.value.length,
      text: 'Visibles en catálogo',
      icon: Boxes
    },
    {
      title: 'Productos inactivos',
      value: inactiveProducts.value.length,
      text: 'Ocultos por eliminación lógica',
      icon: PackageSearch
    },
    {
      title: 'Ofertas activas',
      value: activeOffers.value.length,
      text: 'Descuentos vigentes',
      icon: BadgePercent
    }
  ]
})

function getOrderLineSubtotal(product) {
  const price = Number(product.PrecioUnitario_SinIVA || 0)
  const iva = Number(product.IVA || 0)
  const quantity = Number(product.Cantidad || 0)
  const priceWithIva = price + (price * iva / 100)

  return priceWithIva * quantity
}

function setSection(section) {
  activeSection.value = section
}

function toggleSummary() {
  summaryOpen.value = !summaryOpen.value
}

function getProductDisplayImage(image) {
  if (!image) return null
  if (String(image).startsWith('blob:') || String(image).startsWith('data:') || String(image).startsWith('http')) return image

  return getProductImage(image)
}

function getCategoryById(idCategoria) {
  return categoryList.value.find((category) => Number(category.idCategoria) === Number(idCategoria)) || null
}

function getCategoryParentName(idCategoria) {
  const parent = getCategoryById(idCategoria)

  return parent?.Nombre || 'Sin categoría padre'
}

function getCategoryProductCount(idCategoria) {
  const category = getCategoryById(idCategoria)
  if (category?.productosAsociados?.length) return category.productosAsociados.length

  return productList.value.filter((product) => Number(product.idCategoria) === Number(idCategoria)).length
}

function updateCategoryParentFromSelected() {
  const category = getCategoryById(productForm.value.idCategoria)
  categoryParentId.value = category?.CategoriaPadre || null
}

function updateOrderLineProduct(line) {
  const product = productList.value.find((item) => Number(item.idProducto) === Number(line.idProducto))
  if (!product) return

  line.Nombre = product.Nombre
  line.PrecioUnitario_SinIVA = Number(product.Precio || product.PrecioOriginal_SinIVA || 0)
  line.IVA = Number(product.iva || 21)
}

function handleOrderPaymentMethodChange() {
  if (!selectedOrder.value) return

  const method = activePaymentMethods.value.find((item) => Number(item.idMetodoPago) === Number(selectedOrder.value.idMetodoPago))
  selectedOrder.value.MetodoPago = method?.Nombre || ''
}

function addOrderLine() {
  if (!selectedOrder.value) return

  const firstProduct = productList.value[0]
  if (!firstProduct) return

  selectedOrder.value.Productos.push({
    idLinea: `new-${Date.now()}`,
    idPedido: selectedOrder.value.idPedido,
    idProducto: firstProduct.idProducto,
    Nombre: firstProduct.Nombre,
    Cantidad: 1,
    PrecioUnitario_SinIVA: Number(firstProduct.Precio || firstProduct.PrecioOriginal_SinIVA || 0),
    IVA: Number(firstProduct.iva || 21),
    _isNew: true
  })
}

async function removeOrderLine(index) {
  if (!selectedOrder.value) return

  const line = selectedOrder.value.Productos[index]
  
  if (!confirm(`¿Seguro que quieres eliminar la línea "${line?.Nombre || 'producto'}" del pedido?`)) return

  if (orderModalMode.value === 'edit' && line && !line._isNew) {
    try {
      await deleteAdminOrderLine(selectedOrder.value.idPedido, line.idProducto)
      showMessage('Línea eliminada correctamente.')
    } catch (error) {
      showError('No se pudo eliminar la línea del pedido.', error)
      return
    }
  }

  selectedOrder.value.Productos.splice(index, 1)
}

function openNewProductModal() {
  const firstCategory = categoryList.value[0] || null

  clearMessages()
  productModalMode.value = 'create'
  categoryMode.value = 'existing'
  newCategoryName.value = ''
  categoryParentId.value = firstCategory?.CategoriaPadre || null

  productForm.value = {
    idProducto: null,
    Nombre: '',
    Precio: 0,
    iva: 21,
    Stock: 0,
    Image: '',
    Descripcion: '',
    Activo: 1,
    idCategoria: firstCategory?.idCategoria || null,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: ''
  }

  productModalOpen.value = true
}

function openEditProductModal(product) {
  const category = getCategoryById(product.idCategoria)

  clearMessages()
  productModalMode.value = 'edit'
  categoryMode.value = 'existing'
  newCategoryName.value = ''
  categoryParentId.value = category?.CategoriaPadre || null

  productForm.value = {
    idProducto: product.idProducto,
    Nombre: product.Nombre,
    Precio: product.Precio ?? product.PrecioOriginal_SinIVA ?? 0,
    iva: product.iva ?? 21,
    Stock: product.Stock,
    Image: product.Image,
    Descripcion: product.Descripcion,
    Activo: product.Activo,
    idCategoria: product.idCategoria,
    EnOferta: product.EnOferta,
    Descuento: product.Descuento,
    FechaFinOferta: product.FechaFinOferta
  }

  productModalOpen.value = true
}

function closeProductModal() {
  productModalOpen.value = false
}

function handleProductImageUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  productForm.value.Image = URL.createObjectURL(file)
}

async function createCategoryIfNeeded() {
  if (categoryMode.value === 'existing') return Number(productForm.value.idCategoria)

  const name = newCategoryName.value.trim()
  if (!name) return Number(productForm.value.idCategoria)

  const createdCategory = await createAdminCategory({
    nombre: name,
    idCategoriaPadre: categoryParentId.value ? Number(categoryParentId.value) : null
  })

  await loadCategories()
  const normalizedCategory = normalizeCategory(createdCategory || {})

  return normalizedCategory.idCategoria || categoryList.value.find((category) => category.Nombre === name)?.idCategoria || Number(productForm.value.idCategoria)
}

async function saveProduct() {
  clearMessages()

  try {
    productForm.value.idCategoria = await createCategoryIfNeeded()
    const request = buildProductRequest()

    if (productModalMode.value === 'create') {
      await createAdminProduct(request)
      showMessage('Producto creado correctamente.')
    } else {
      await updateAdminProduct(productForm.value.idProducto, request)
      showMessage('Producto actualizado correctamente.')
    }

    closeProductModal()
    await Promise.all([loadProducts(), loadStockAlerts(), loadCategories()])
  } catch (error) {
    showError('No se pudo guardar el producto.', error)
  }
}

function handleOrderUserChange() {
  if (!selectedOrder.value) return

  const user = usersList.value.find((item) => Number(item.idUsuario) === Number(selectedOrder.value.idUsuario))

  if (!user) {
    selectedOrder.value.Cliente = ''
    selectedOrder.value.Email = ''
    selectedOrder.value.Telefono = ''
    return
  }

  selectedOrder.value.Cliente = `${user.Nombre} ${user.Apellido1 || ''}`.trim()
  selectedOrder.value.Email = user.email
  selectedOrder.value.Telefono = user.Telefono || ''
}

async function handleDeleteProduct(product) {
  if (!confirm(`¿Seguro que quieres eliminar el producto "${product.Nombre}"?`)) return

  clearMessages()

  try {
    await deleteAdminProduct(product.idProducto)
    showMessage('Producto eliminado lógicamente.')
    await Promise.all([loadProducts(), loadStockAlerts(), loadCategories()])
  } catch (error) {
    showError('No se pudo eliminar el producto.', error)
  }
}

function openNewCategoryModal() {
  clearMessages()
  categoryModalMode.value = 'create'

  categoryForm.value = {
    idCategoria: null,
    Nombre: '',
    CategoriaPadre: null
  }

  categoryModalOpen.value = true
}

function openEditCategoryModal(category) {
  clearMessages()
  categoryModalMode.value = 'edit'

  categoryForm.value = {
    idCategoria: category.idCategoria,
    Nombre: category.Nombre,
    CategoriaPadre: category.CategoriaPadre || null
  }

  categoryModalOpen.value = true
}

function closeCategoryModal() {
  categoryModalOpen.value = false
}

async function saveCategory() {
  clearMessages()

  const categoryData = {
    idCategoria: categoryForm.value.idCategoria ? Number(categoryForm.value.idCategoria) : null,
    Nombre: categoryForm.value.Nombre.trim(),
    CategoriaPadre: categoryForm.value.CategoriaPadre ? Number(categoryForm.value.CategoriaPadre) : null
  }

  if (!categoryData.Nombre) return

  try {
    if (categoryModalMode.value === 'create') {
      await createAdminCategory(buildCategoryRequest(categoryData))
      showMessage('Categoría creada correctamente.')
    } else {
      await updateAdminCategory(categoryData.idCategoria, buildCategoryRequest(categoryData))
      showMessage('Categoría actualizada correctamente.')
    }

    closeCategoryModal()
    await Promise.all([loadCategories(), loadProducts()])
  } catch (error) {
    showError('No se pudo guardar la categoría.', error)
  }
}

async function handleDeleteCategory(category) {
  if (!confirm(`¿Seguro que quieres eliminar la categoría "${category.Nombre}"?`)) return

  clearMessages()

  try {
    await deleteAdminCategory(category.idCategoria)
    showMessage('Categoría eliminada correctamente.')
    await Promise.all([loadCategories(), loadProducts()])
  } catch (error) {
    showError('No se pudo eliminar la categoría. Comprueba que no tenga productos asociados.', error)
  }
}

async function openNewOrderModal() {
  clearMessages()

  if (usersList.value.length === 0) await loadUsers()
  if (productList.value.length === 0) await loadProducts()
  if (paymentMethods.value.length === 0) await loadPaymentMethods()
  const firstProduct = productList.value[0]
  const firstPaymentMethod = activePaymentMethods.value[0] || null

  orderModalMode.value = 'create'

  selectedOrder.value = {
    idPedido: null,
    CodigoPedido: '',
    idUsuario: '',
    idDireccion: '',
    idMetodoPago: firstPaymentMethod?.idMetodoPago || '',
    Cliente: 'Nuevo cliente',
    Email: '',
    Telefono: '',
    DireccionEnvio: '',
    FechaPedido: new Date().toISOString().slice(0, 10),
    EstadoPedido: 'PENDIENTE',
    EstadoPago: 'PENDIENTE',
    MetodoPago: firstPaymentMethod?.Nombre || '',
    Comentarios: '',
    TotalConIVA: 0,
    Productos: firstProduct ? [
      {
        idLinea: `new-${Date.now()}`,
        idPedido: null,
        idProducto: firstProduct.idProducto,
        Nombre: firstProduct.Nombre,
        Cantidad: 1,
        PrecioUnitario_SinIVA: Number(firstProduct.Precio || firstProduct.PrecioOriginal_SinIVA || 0),
        IVA: Number(firstProduct.iva || 21),
        _isNew: true
      }
    ] : []
  }

  orderModalOpen.value = true
}

async function openOrderModal(order) {
  clearMessages()
  orderDetailError.value = ''
  orderDetailLoading.value = true
  orderModalMode.value = 'edit'

  selectedOrder.value = {
    ...order,
    Productos: []
  }

  orderModalOpen.value = true

  try {
    const detail = await getAdminOrderDetail(order.idPedido)

    selectedOrder.value = {
      ...selectedOrder.value,
      idUsuario: getFirstValue(detail, ['idUsuario'], selectedOrder.value.idUsuario),
      TotalConIVA: normalizeNumber(getFirstValue(detail, ['totalConIVA'], selectedOrder.value.TotalConIVA)),
      Productos: asArray(getFirstValue(detail, ['lineas'], [])).map(normalizeOrderLine)
    }
  } catch (error) {
    orderDetailError.value = 'No se pudo cargar el detalle del pedido.'
    console.error('Error cargando detalle pedido:', error)
  } finally {
    orderDetailLoading.value = false
  }
}

function closeOrderModal() {
  orderModalOpen.value = false
  selectedOrder.value = null
}

async function saveOrderChanges() {
  if (!selectedOrder.value) return

  clearMessages()

  if (!selectedOrder.value.idMetodoPago) {
    showError('Selecciona un método de pago.')
    return
  }

  if (orderModalMode.value === 'create') {
    if (!selectedOrder.value.idUsuario) {
      showError('Selecciona un usuario para crear el pedido.')
      return
    }

    if (!selectedOrder.value.idDireccion) {
      showError('Este pedido necesita una dirección. Si el cliente no tiene dirección, primero debe crear una dirección en su cuenta.')
      return
    }

    if (selectedOrder.value.Productos.length === 0) {
      showError('El pedido debe tener al menos una línea de producto.')
      return
    }
  }

  try {
    if (orderModalMode.value === 'create') {
      await createAdminOrder(buildOrderRequest(selectedOrder.value))
      showMessage('Pedido creado correctamente.')
      closeOrderModal()
      await loadOrders()
      return
    }

    await updateAdminOrder(selectedOrder.value.idPedido, buildOrderUpdateRequest(selectedOrder.value))

    for (const line of selectedOrder.value.Productos) {
      if (line._isNew) {
        await addAdminOrderLine(selectedOrder.value.idPedido, buildOrderLineRequest(line))
      } else {
        await updateAdminOrderLine(selectedOrder.value.idPedido, line.idProducto, {
          cantidad: Number(line.Cantidad || 1),
          PrecioUnitario_SinIVA: Number(line.PrecioUnitario_SinIVA || 0),
          IVA: Number(line.IVA || 0)
        })
      }
    }

    showMessage('Pedido actualizado correctamente.')
    closeOrderModal()
    await loadOrders()
  } catch (error) {
    showError('No se pudo guardar el pedido.', error)
  }
}

function handleLogout() {
  clearAuthUser()
  router.push('/')
}

onMounted(() => {
  loadAdminData()
})
</script>

<template>
  <main class="admin-page">
    <button class="admin-summary-tab" :class="{ 'admin-summary-tab-alert': lowStockProducts.length > 0 }" type="button" @click="toggleSummary">
      <span>Resumen</span>
      <AlertTriangle v-if="lowStockProducts.length > 0" :size="17" :stroke-width="2.6" />
      <ChevronRight v-if="summaryOpen" :size="18" :stroke-width="2.5" />
      <ChevronLeft v-else :size="18" :stroke-width="2.5" />
    </button>

    <aside class="admin-summary-drawer" :class="{ 'admin-summary-drawer-open': summaryOpen }">
      <h2>Resumen admin</h2>
      <p v-if="stockAlertsLoading" class="admin-summary-message">Cargando alertas de stock...</p>
      <p v-else-if="stockAlertsError" class="admin-summary-message admin-summary-message-error">{{ stockAlertsError }}</p>

      <div class="admin-summary-list">
        <article v-for="card in adminStats" :key="card.title" class="admin-summary-card">
          <span class="admin-summary-icon">
            <component :is="card.icon" :size="24" :stroke-width="2.5" />
          </span>
          <div>
            <strong>{{ card.value }}</strong>
            <h3>{{ card.title }}</h3>
            <p>{{ card.text }}</p>
          </div>
        </article>
      </div>
    </aside>

    <section class="admin-shell">
      <aside class="admin-sidebar">
        <button class="admin-menu-button" :class="{ 'admin-menu-button-active': activeSection === 'datos' }" type="button" @click="setSection('datos')">Mis datos</button>
        <button class="admin-menu-button" :class="{ 'admin-menu-button-active': activeSection === 'usuarios' }" type="button" @click="setSection('usuarios')">Usuarios</button>
        <button class="admin-menu-button" :class="{ 'admin-menu-button-active': activeSection === 'articulos' }" type="button" @click="setSection('articulos')">Artículos</button>
        <button class="admin-menu-button" :class="{ 'admin-menu-button-active': activeSection === 'categorias' }" type="button" @click="setSection('categorias')">Categorías</button>
        <button class="admin-menu-button" :class="{ 'admin-menu-button-active': activeSection === 'pedidos' }" type="button" @click="setSection('pedidos')">Pedidos</button>

        <button class="admin-logout-button" type="button" @click="handleLogout">
          <LogOut :size="18" :stroke-width="2.4" />
          Cerrar sesión
        </button>
      </aside>

      <section class="admin-main-panel">
        <p v-if="globalMessage" class="admin-summary-message">{{ globalMessage }}</p>
        <p v-if="globalError" class="admin-summary-message admin-summary-message-error">{{ globalError }}</p>

        <div v-if="activeSection === 'datos'" class="admin-section">
          <h1>Mis datos</h1>

          <div class="admin-profile-card">
            <span class="admin-profile-icon">
              <ShieldCheck :size="52" :stroke-width="2.2" />
            </span>

            <div class="admin-profile-info">
              <h2>{{ authUser.name || 'Administrador' }}</h2>
              <p>{{ authUser.username }}</p>

              <div class="admin-profile-grid">
                <div>
                  <span>Rol</span>
                  <strong>{{ authUser.role || 'ADMIN' }}</strong>
                </div>

                <div>
                  <span>Estado</span>
                  <strong>Activo</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeSection === 'usuarios'" class="admin-section">
          <h1>Listado de usuarios</h1>

          <div class="admin-users-toolbar">
            <label class="admin-users-search">
              <Search :size="18" :stroke-width="2.4" />
              <input v-model="userSearch" type="search" placeholder="Búsqueda usuarios" />
            </label>

            <div class="admin-users-count">
              <span>Nº registros</span>
              <strong>{{ filteredUsers.length }}</strong>
            </div>
          </div>

          <p v-if="usersLoading" class="admin-summary-message">Cargando usuarios...</p>
          <p v-else-if="usersError" class="admin-summary-message admin-summary-message-error">{{ usersError }}</p>

          <div class="admin-users-panel">
            <div class="admin-users-list">
              <article v-for="user in filteredUsers" :key="user.idUsuario" class="admin-user-row">
                <span class="admin-user-avatar">
                  <UserRound :size="24" :stroke-width="2.3" />
                </span>

                <div class="admin-user-data">
                  <h2>{{ user.Nombre }} {{ user.Apellido1 }}</h2>
                  <p>{{ user.email }}</p>
                  <small>{{ user.Telefono || 'Sin teléfono' }}</small>
                </div>

                <div class="admin-user-right">
                  <strong>ID {{ user.idUsuario }}</strong>
                  <small>{{ user.Rol }}</small>
                  <span :class="{ 'admin-status-disabled': user.Activo === 0 }">
                    {{ user.Activo === 1 ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </article>

              <div v-if="!usersLoading && filteredUsers.length === 0" class="admin-empty">
                <p>No se encontraron usuarios.</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeSection === 'articulos'" class="admin-section">
          <h1>Listado de artículos</h1>

          <div class="admin-products-toolbar">
            <label class="admin-products-search">
              <Search :size="18" :stroke-width="2.4" />
              <input v-model="productSearch" type="search" placeholder="Búsqueda artículos" />
            </label>

            <div class="admin-products-actions">
              <div class="admin-products-count">
                <span>Nº registros</span>
                <strong>{{ filteredProducts.length }}</strong>
              </div>

              <button class="admin-add-product-button" type="button" @click="openNewProductModal">
                <PackagePlus :size="18" :stroke-width="2.5" />
                Añadir producto
              </button>
            </div>
          </div>

          <p v-if="productsLoading" class="admin-summary-message">Cargando artículos...</p>
          <p v-else-if="productsError" class="admin-summary-message admin-summary-message-error">{{ productsError }}</p>

          <div class="admin-products-panel">
            <div class="admin-products-list">
              <article v-for="product in filteredProducts" :key="product.idProducto" class="admin-product-row">
                <span class="admin-product-image-box">
                  <img v-if="getProductDisplayImage(product.Image)" :src="getProductDisplayImage(product.Image)" :alt="product.Nombre" />
                  <span v-else>Sin imagen</span>
                </span>

                <div class="admin-product-name">
                  <h2>{{ product.Nombre }}</h2>
                  <small>{{ product.Activo === 1 ? 'Activo' : 'Inactivo' }}</small>
                </div>

                <div class="admin-product-price">
                  <small>Sin IVA</small>
                  <strong>{{ Number(product.Precio || product.PrecioOriginal_SinIVA || 0).toFixed(2) }}€</strong>
                  <small>IVA {{ product.iva }}%</small>
                </div>

                <div class="admin-product-category">
                  <strong>{{ product.NombreCategoria }}</strong>
                  <small>ID categoría: {{ product.idCategoria }}</small>
                </div>

                <p class="admin-product-description">{{ product.Descripcion }}</p>

                <div class="admin-product-right">
                  <strong>ID {{ product.idProducto }}</strong>

                  <div class="admin-product-row-actions">
                    <button type="button" @click="openEditProductModal(product)">
                      <Edit :size="15" :stroke-width="2.5" />
                      Editar
                    </button>

                    <button type="button" @click="handleDeleteProduct(product)">
                      <Trash2 :size="15" :stroke-width="2.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>

              <div v-if="!productsLoading && filteredProducts.length === 0" class="admin-empty">
                <p>No se encontraron artículos.</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeSection === 'categorias'" class="admin-section">
          <h1>Gestión de categorías</h1>

          <div class="admin-categories-toolbar">
            <label class="admin-categories-search">
              <Search :size="18" :stroke-width="2.4" />
              <input v-model="categorySearch" type="search" placeholder="Búsqueda categorías" />
            </label>

            <div class="admin-categories-actions">
              <div class="admin-categories-count">
                <span>Nº registros</span>
                <strong>{{ filteredCategories.length }}</strong>
              </div>

              <button class="admin-add-category-button" type="button" @click="openNewCategoryModal">
                <Plus :size="18" :stroke-width="2.5" />
                Añadir categoría
              </button>
            </div>
          </div>

          <p v-if="categoriesLoading" class="admin-summary-message">Cargando categorías...</p>
          <p v-else-if="categoriesError" class="admin-summary-message admin-summary-message-error">{{ categoriesError }}</p>

          <div class="admin-categories-panel">
            <div class="admin-categories-list">
              <article v-for="category in filteredCategories" :key="category.idCategoria" class="admin-category-row">
                <span class="admin-category-icon">
                  <Boxes :size="23" :stroke-width="2.4" />
                </span>

                <div class="admin-category-name">
                  <h2>{{ category.Nombre }}</h2>
                  <small>ID categoría: {{ category.idCategoria }}</small>
                </div>

                <div class="admin-category-parent">
                  <span>Categoría padre</span>
                  <strong>{{ getCategoryParentName(category.CategoriaPadre) }}</strong>
                </div>

                <div class="admin-category-products">
                  <span>Productos asociados</span>
                  <strong>{{ getCategoryProductCount(category.idCategoria) }}</strong>
                </div>

                <div class="admin-category-right">
                  <div class="admin-category-row-actions">
                    <button type="button" @click="openEditCategoryModal(category)">
                      <Edit :size="15" :stroke-width="2.5" />
                      Editar
                    </button>

                    <button class="admin-category-delete-button" type="button" :disabled="getCategoryProductCount(category.idCategoria) > 0" @click="handleDeleteCategory(category)">
                      <Trash2 :size="15" :stroke-width="2.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>

              <div v-if="!categoriesLoading && filteredCategories.length === 0" class="admin-empty">
                <p>No se encontraron categorías.</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeSection === 'pedidos'" class="admin-section">
          <h1>Gestión de pedidos</h1>

          <div class="admin-orders-toolbar">
            <label class="admin-orders-search">
              <Search :size="18" :stroke-width="2.4" />
              <input v-model="orderSearch" type="search" placeholder="Búsqueda pedidos" />
            </label>

            <div class="admin-orders-actions">
              <div class="admin-orders-count">
                <span>Nº registros</span>
                <strong>{{ filteredOrders.length }}</strong>
              </div>

              <button class="admin-add-order-button" type="button" @click="openNewOrderModal">
                <Plus :size="18" :stroke-width="2.5" />
                Crear pedido
              </button>
            </div>
          </div>

          <p v-if="ordersLoading" class="admin-summary-message">Cargando pedidos...</p>
          <p v-else-if="ordersError" class="admin-summary-message admin-summary-message-error">{{ ordersError }}</p>

          <div class="admin-orders-panel">
            <div class="admin-orders-list">
              <article v-for="order in filteredOrders" :key="order.idPedido" class="admin-order-row">
                <span class="admin-order-icon">
                  <ShoppingBag :size="22" :stroke-width="2.4" />
                </span>

                <div class="admin-order-code">
                  <h2>{{ order.CodigoPedido }}</h2>
                  <small>ID {{ order.idPedido }}</small>
                </div>

                <div class="admin-order-client">
                  <strong>{{ order.Cliente }}</strong>
                  <small>{{ order.Email }}</small>
                </div>

                <div class="admin-order-date">
                  <strong>{{ order.FechaPedido }}</strong>
                  <small>{{ order.MetodoPago }}</small>
                </div>

                <div class="admin-order-status">
                  <span class="admin-order-status-pill">{{ order.EstadoPedido }}</span>
                  <small>Pago: {{ order.EstadoPago }}</small>
                </div>

                <div class="admin-order-total">
                  <strong>{{ order.TotalConIVA.toFixed(2) }}€</strong>

                  <button type="button" @click="openOrderModal(order)">
                    <Eye :size="15" :stroke-width="2.5" />
                    Ver
                  </button>
                </div>
              </article>

              <div v-if="!ordersLoading && filteredOrders.length === 0" class="admin-empty">
                <p>No se encontraron pedidos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>

    <div v-if="productModalOpen" class="admin-product-modal-overlay">
      <section class="admin-product-modal">
        <div class="admin-product-modal-header">
          <h2>{{ productModalMode === 'create' ? 'Añadir producto' : 'Editar producto' }}</h2>

          <button type="button" @click="closeProductModal">
            <X :size="20" :stroke-width="2.5" />
          </button>
        </div>

        <form class="admin-product-form" @submit.prevent="saveProduct">
          <div class="admin-product-form-top">
            <label class="admin-product-image-upload">
              <span>Insertar foto</span>
              <input type="file" accept="image/*" @change="handleProductImageUpload" />
              <div class="admin-product-image-preview">
                <img v-if="getProductDisplayImage(productForm.Image)" :src="getProductDisplayImage(productForm.Image)" alt="Vista previa producto" />
                <ImagePlus v-else :size="28" :stroke-width="2.3" />
              </div>
            </label>

            <div class="admin-product-form-side">
              <label>
                <span>ID producto</span>
                <input v-model="productForm.idProducto" type="number" disabled />
              </label>

              <div class="admin-product-switch-combined">
                <span>Estado del producto</span>

                <div class="admin-product-switches">
                  <div class="admin-product-switch-item">
                    <strong>Activo</strong>
                    <label class="admin-switch">
                      <input v-model="productForm.Activo" type="checkbox" :true-value="1" :false-value="0" />
                      <span></span>
                    </label>
                  </div>

                  <div class="admin-product-switch-item">
                    <strong>En oferta</strong>
                    <label class="admin-switch">
                      <input v-model="productForm.EnOferta" type="checkbox" :true-value="1" :false-value="0" />
                      <span></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <label>
            <span>Nombre</span>
            <input v-model="productForm.Nombre" type="text" required />
          </label>

          <label>
            <span>Precio sin IVA</span>
            <input v-model="productForm.Precio" type="number" step="0.01" min="0" required />
          </label>

          <label>
            <span>IVA %</span>
            <input v-model="productForm.iva" type="number" step="1" min="0" required />
          </label>

          <label>
            <span>Stock</span>
            <input v-model="productForm.Stock" type="number" min="0" required />
          </label>

          <label>
            <span>Tipo de categoría</span>
            <select v-model="categoryMode">
              <option value="existing">Elegir categoría existente</option>
              <option value="new">Crear nueva categoría</option>
            </select>
          </label>

          <label v-if="categoryMode === 'existing'">
            <span>Categoría</span>
            <select v-model="productForm.idCategoria" @change="updateCategoryParentFromSelected">
              <option v-for="category in categoryList" :key="category.idCategoria" :value="category.idCategoria">
                {{ category.Nombre }}
              </option>
            </select>
          </label>

          <label v-if="categoryMode === 'new'">
            <span>Nueva categoría</span>
            <input v-model="newCategoryName" type="text" placeholder="Nombre de la nueva categoría" />
          </label>

          <label>
            <span>Categoría padre</span>
            <select v-model="categoryParentId">
              <option :value="null">Sin categoría padre</option>
              <option v-for="category in availableParentCategories" :key="category.idCategoria" :value="category.idCategoria">
                {{ category.Nombre }}
              </option>
            </select>
          </label>

          <label>
            <span>Ruta imagen</span>
            <input v-model="productForm.Image" type="text" placeholder="Nombre archivo o URL" />
          </label>

          <label>
            <span>Descuento %</span>
            <input v-model="productForm.Descuento" type="number" min="0" max="100" />
          </label>

          <label>
            <span>Fecha fin oferta</span>
            <input v-model="productForm.FechaFinOferta" type="datetime-local" />
          </label>

          <label class="admin-product-form-full">
            <span>Descripción</span>
            <textarea v-model="productForm.Descripcion" rows="4"></textarea>
          </label>

          <div class="admin-product-form-actions">
            <button class="admin-product-cancel-button" type="button" @click="closeProductModal">Cancelar</button>

            <button class="admin-product-save-button" type="submit">
              <Save :size="18" :stroke-width="2.5" />
              Guardar cambios
            </button>
          </div>
        </form>
      </section>
    </div>

    <div v-if="categoryModalOpen" class="admin-category-modal-overlay">
      <section class="admin-category-modal">
        <div class="admin-category-modal-header">
          <h2>{{ categoryModalMode === 'create' ? 'Añadir categoría' : 'Editar categoría' }}</h2>

          <button type="button" @click="closeCategoryModal">
            <X :size="20" :stroke-width="2.5" />
          </button>
        </div>

        <form class="admin-category-form" @submit.prevent="saveCategory">
          <label>
            <span>ID categoría</span>
            <input v-model="categoryForm.idCategoria" type="number" disabled />
          </label>

          <label>
            <span>Nombre</span>
            <input v-model="categoryForm.Nombre" type="text" required />
          </label>

          <label class="admin-category-form-full">
            <span>Categoría padre</span>
            <select v-model="categoryForm.CategoriaPadre">
              <option :value="null">Sin categoría padre</option>
              <option v-for="category in availableCategoryParentOptions" :key="category.idCategoria" :value="category.idCategoria">
                {{ category.Nombre }}
              </option>
            </select>
          </label>

          <div class="admin-category-form-actions">
            <button class="admin-category-cancel-button" type="button" @click="closeCategoryModal">Cancelar</button>

            <button class="admin-category-save-button" type="submit">
              <Save :size="18" :stroke-width="2.5" />
              Guardar cambios
            </button>
          </div>
        </form>
      </section>
    </div>

    <div v-if="orderModalOpen && selectedOrder" class="admin-order-modal-overlay">
      <section class="admin-order-modal">
        <div class="admin-order-modal-header">
          <h2>{{ orderModalMode === 'create' ? 'Crear pedido' : `Detalle pedido ${selectedOrder.CodigoPedido}` }}</h2>

          <button type="button" @click="closeOrderModal">
            <X :size="20" :stroke-width="2.5" />
          </button>
        </div>

        <p v-if="orderDetailLoading" class="admin-summary-message">Cargando detalle del pedido...</p>
        <p v-else-if="orderDetailError" class="admin-summary-message admin-summary-message-error">{{ orderDetailError }}</p>

        <div class="admin-order-detail-grid">
          <label class="admin-order-detail-field">
            <span>Usuario</span>
            <select v-model="selectedOrder.idUsuario" :disabled="orderModalMode === 'edit'" @change="handleOrderUserChange">
              <option value="">Selecciona usuario</option>
              <option v-for="user in clientUsersForOrders" :key="user.idUsuario" :value="user.idUsuario">
                ID {{ user.idUsuario }} - {{ user.Nombre }} {{ user.Apellido1 }} - {{ user.email }}
              </option>
            </select>
          </label>

          <label class="admin-order-detail-field">
            <span>ID dirección</span>
            <input v-model="selectedOrder.idDireccion" type="number" :disabled="orderModalMode === 'edit'" />
          </label>

          <label class="admin-order-detail-field">
            <span>Método de pago</span>
            <select v-model="selectedOrder.idMetodoPago" @change="handleOrderPaymentMethodChange">
              <option value="">Selecciona método</option>
              <option v-for="method in activePaymentMethods" :key="method.idMetodoPago" :value="method.idMetodoPago">
                ID {{ method.idMetodoPago }} - {{ method.Nombre }}
              </option>
            </select>
            <small v-if="paymentMethodsLoading">Cargando métodos...</small>
            <small v-else-if="paymentMethodsError">{{ paymentMethodsError }}</small>
          </label>

          <label class="admin-order-detail-field">
            <span>Cliente</span>
            <input v-model="selectedOrder.Cliente" type="text" disabled />
          </label>

          <label class="admin-order-detail-field">
            <span>Email</span>
            <input v-model="selectedOrder.Email" type="email" disabled />
          </label>

          <label class="admin-order-detail-field">
            <span>Fecha pedido</span>
            <input v-model="selectedOrder.FechaPedido" type="date" disabled />
          </label>

          <label class="admin-order-detail-field">
            <span>Estado pedido</span>
            <select v-model="selectedOrder.EstadoPedido">
              <option v-for="status in orderStatusOptions" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </label>

          <label class="admin-order-detail-field">
            <span>Estado pago</span>
            <select v-model="selectedOrder.EstadoPago">
              <option v-for="status in paymentStatusOptions" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </label>

          <label class="admin-order-detail-field admin-order-detail-field-full">
            <span>Comentarios</span>
            <input v-model="selectedOrder.Comentarios" type="text" />
          </label>
        </div>

        <div class="admin-order-products">
          <div class="admin-order-products-header">
            <h3>Líneas del pedido</h3>

            <button type="button" @click="addOrderLine">
              <Plus :size="16" :stroke-width="2.5" />
              Añadir línea
            </button>
          </div>

          <div class="admin-order-products-list">
            <article v-for="(product, index) in selectedOrderProducts" :key="product.idLinea || `${product.idProducto}-${index}`" class="admin-order-product-row">
              <label>
                <span>Producto</span>
                <select v-model="product.idProducto" :disabled="orderModalMode === 'edit' && !product._isNew" @change="updateOrderLineProduct(product)">
                  <option v-for="item in productList" :key="item.idProducto" :value="item.idProducto">
                    {{ item.Nombre }}
                  </option>
                </select>
              </label>

              <label>
                <span>Cantidad</span>
                <input v-model="product.Cantidad" type="number" min="1" />
              </label>

              <label>
                <span>Precio sin IVA</span>
                <input v-model="product.PrecioUnitario_SinIVA" type="number" step="0.01" min="0" />
              </label>

              <label>
                <span>IVA %</span>
                <input v-model="product.IVA" type="number" step="1" min="0" />
              </label>

              <div class="admin-order-line-subtotal">
                <span>Subtotal con IVA</span>
                <strong>{{ getOrderLineSubtotal(product).toFixed(2) }}€</strong>
              </div>

              <button class="admin-order-line-delete" type="button" @click="removeOrderLine(index)">
                <Trash2 :size="16" :stroke-width="2.5" />
              </button>
            </article>

            <div v-if="selectedOrderProducts.length === 0" class="admin-empty">
              <p>Este pedido no tiene líneas.</p>
            </div>
          </div>
        </div>

        <div class="admin-order-modal-footer">
          <div>
            <span>Total pedido</span>
            <strong>{{ selectedOrderTotal.toFixed(2) }}€</strong>
          </div>

          <button class="admin-order-save-button" type="button" @click="saveOrderChanges">
            <Save :size="18" :stroke-width="2.5" />
            Guardar pedido
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped></style>