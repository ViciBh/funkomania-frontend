/**
 * Vista del panel de administración de Funkomanía.
 * Permite gestionar usuarios, productos, categorías y pedidos desde una interfaz de administración.
 *
 * @author Viktoriia Bohoslavska
 */
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { clearNotifications } from '@/composables/useNotifications'
import { AlertTriangle, BadgePercent, Boxes, ChevronLeft, ChevronRight, Edit, Eye, ImagePlus, LogOut, PackagePlus, PackageSearch, Plus, Save, Search, ShieldCheck, ShoppingBag, Trash2, UserRound, X } from 'lucide-vue-next'
import { products, categories, productosOfertas, adminAlertasStock, getProductImage } from '@/data/products'
import { mockAdmin, getClientUsers, mockOrders, getOrderDetails } from '@/data/admin'

const activeSection = ref('datos')
const router = useRouter()
const { clearAuthUser } = useAuth()
const summaryOpen = ref(false)
const userSearch = ref('')
const productSearch = ref('')
const categorySearch = ref('')
const productModalOpen = ref(false)
const productModalMode = ref('edit')
const categoryModalOpen = ref(false)
const categoryModalMode = ref('edit')
const productList = ref(products.map((product) => ({ ...product })))
const categoryList = ref(categories.map((category) => ({ ...category })))
const orderSearch = ref('')
const orderModalOpen = ref(false)
const orderModalMode = ref('edit')
const selectedOrder = ref(null)
const orderStatusOptions = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']
const paymentStatusOptions = ['pendiente', 'pagado', 'rechazado']
const paymentMethodOptions = ['Tarjeta bancaria', 'PayPal', 'Transferencia bancaria', 'Bizum']

const productForm = ref({
  idProducto: null,
  Nombre: '',
  Precio: 0,
  iva: 21,
  Stock: 0,
  Image: null,
  Descripcion: '',
  Activo: 1,
  idCategoria: null,
  EnOferta: 0,
  Descuento: 0,
  FechaFinOferta: null
})

const categoryForm = ref({
  idCategoria: null,
  Nombre: '',
  CategoriaPadre: null
})

const categoryMode = ref('existing')
const newCategoryName = ref('')
const categoryParentId = ref(null)

function getOrderLineSubtotal(product) {
  const price = Number(product.PrecioUnitario_SinIVA || 0)
  const iva = Number(product.IVA || 0)
  const quantity = Number(product.Cantidad || 0)
  const priceWithIva = price + (price * iva / 100)

  return priceWithIva * quantity
}

function normalizeOrderProducts(order) {
  const rawLines = getOrderDetails(order.idPedido)

  if (Array.isArray(rawLines) && rawLines.length > 0) {
    return rawLines.map((line, index) => {
      const product = productList.value.find((item) => item.idProducto === Number(line.idProducto)) ||
        products.find((item) => item.idProducto === Number(line.idProducto))

      return {
        idLinea: `${line.idPedido}-${line.idProducto}-${index}`,
        idPedido: line.idPedido,
        idProducto: Number(line.idProducto),
        Nombre: line.NombreProducto || product?.Nombre || 'Producto pedido',
        Cantidad: Number(line.Cantidad || 1),
        PrecioUnitario_SinIVA: Number(line.PrecioUnitarioSinIVA || line.precioUnitario || product?.Precio || product?.PrecioOriginal_SinIVA || 0),
        IVA: Number(line.IVA || product?.iva || 21)
      }
    })
  }

  const firstProduct = productList.value[0] || products[0]

  return [
    {
      idLinea: `${order.idPedido || 'new'}-${firstProduct?.idProducto || 1}-0`,
      idPedido: order.idPedido,
      idProducto: firstProduct?.idProducto || 1,
      Nombre: firstProduct?.Nombre || 'Producto ejemplo',
      Cantidad: 1,
      PrecioUnitario_SinIVA: Number(firstProduct?.Precio || firstProduct?.PrecioOriginal_SinIVA || 10),
      IVA: Number(firstProduct?.iva || 21)
    }
  ]
}

function normalizeOrder(order) {
  const normalizedProducts = normalizeOrderProducts(order)
  const total = normalizedProducts.reduce((sum, line) => sum + getOrderLineSubtotal(line), 0)

  const estadoPedido = order.EstadoPedido === 'pagado' ? 'procesando' :
    order.EstadoPedido === 'preparando' ? 'procesando' :
    order.EstadoPedido || 'pendiente'

  const estadoPago = order.EstadoPago || (order.EstadoPedido === 'pagado' ? 'pagado' : 'pendiente')

  return {
    ...order,
    idPedido: Number(order.idPedido || 1),
    CodigoPedido: order.CodigoPedido || `FM${Date.now()}`,
    Cliente: order.Cliente || order.Nombre_Usuario || 'Cliente Funkomanía',
    Email: order.Email || order.email || order.Email_Usuario || 'cliente@funkomania.com',
    Telefono: order.Telefono || '600123456',
    DireccionEnvio: order.DireccionEnvio || `Dirección ID ${order.idDireccion || ''}`,
    FechaPedido: order.FechaPedido || new Date().toISOString().slice(0, 10),
    EstadoPedido: estadoPedido,
    EstadoPago: estadoPago,
    MetodoPago: order.MetodoPago || order.Metodo_Pago || 'Tarjeta bancaria',
    TotalConIVA: Number(order.TotalConIVA || total || 0),
    Productos: normalizedProducts
  }
}

const orderList = ref(mockOrders.map((order) => normalizeOrder(order)))

const clientUsers = computed(() => {
  return getClientUsers()
})

const filteredUsers = computed(() => {
  const text = userSearch.value.trim().toLowerCase()

  return clientUsers.value.filter((user) => {
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
  return selectedOrderProducts.value.reduce((sum, product) => {
    return sum + getOrderLineSubtotal(product)
  }, 0)
})

const activeProducts = computed(() => {
  return productList.value.filter((product) => product.Activo === 1)
})

const inactiveProducts = computed(() => {
  return productList.value.filter((product) => product.Activo === 0)
})

const lowStockProducts = computed(() => {
  return adminAlertasStock
})

const criticalStockProducts = computed(() => {
  return lowStockProducts.value.filter((product) => product.Stock === 0 || product.Prioridad === 'Critico')
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
      value: productosOfertas.length,
      text: 'Descuentos vigentes',
      icon: BadgePercent
    }
  ]
})

function setSection(section) {
  activeSection.value = section
}

function toggleSummary() {
  summaryOpen.value = !summaryOpen.value
}

function getProductDisplayImage(image) {
  if (!image) return null

  if (String(image).startsWith('blob:') || String(image).startsWith('data:') || String(image).startsWith('http')) {
    return image
  }

  return getProductImage(image)
}

function getCategoryById(idCategoria) {
  return categoryList.value.find((category) => category.idCategoria === Number(idCategoria)) || null
}

function getCategoryParentName(idCategoria) {
  const parent = getCategoryById(idCategoria)

  return parent?.Nombre || 'Sin categoría padre'
}

function getCategoryProductCount(idCategoria) {
  return productList.value.filter((product) => Number(product.idCategoria) === Number(idCategoria)).length
}

function updateCategoryParentFromSelected() {
  const category = getCategoryById(productForm.value.idCategoria)
  categoryParentId.value = category?.CategoriaPadre || null
}

function getPrecioConIva(precio, iva) {
  return Number(precio) + (Number(precio) * Number(iva) / 100)
}

function getPrecioConDescuento(precio, descuento, enOferta) {
  if (Number(enOferta) !== 1 || Number(descuento) <= 0) {
    return Number(precio)
  }

  return Number(precio) - (Number(precio) * Number(descuento) / 100)
}

function updateOrderLineProduct(line) {
  const product = productList.value.find((item) => item.idProducto === Number(line.idProducto))

  if (!product) return

  line.Nombre = product.Nombre
  line.PrecioUnitario_SinIVA = Number(product.Precio || product.PrecioOriginal_SinIVA || 0)
  line.IVA = Number(product.iva || 21)
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
    IVA: Number(firstProduct.iva || 21)
  })
}

function removeOrderLine(index) {
  if (!selectedOrder.value) return

  selectedOrder.value.Productos.splice(index, 1)
}

function createCategoryIfNeeded() {
  if (categoryMode.value === 'existing') {
    const category = getCategoryById(productForm.value.idCategoria)

    if (category) {
      category.CategoriaPadre = categoryParentId.value ? Number(categoryParentId.value) : null
    }

    return Number(productForm.value.idCategoria)
  }

  const name = newCategoryName.value.trim()

  if (!name) {
    return Number(productForm.value.idCategoria)
  }

  const nextId = categoryList.value.length ? Math.max(...categoryList.value.map((category) => category.idCategoria)) + 1 : 1

  const newCategory = {
    idCategoria: nextId,
    Nombre: name,
    CategoriaPadre: categoryParentId.value ? Number(categoryParentId.value) : null
  }

  categoryList.value.push(newCategory)

  return nextId
}

function buildProductData() {
  const idCategoria = createCategoryIfNeeded()
  const category = getCategoryById(idCategoria)
  const parentCategory = category?.CategoriaPadre ? getCategoryById(category.CategoriaPadre) : null
  const precioSinIva = Number(productForm.value.Precio || 0)
  const iva = Number(productForm.value.iva || 0)
  const descuento = Number(productForm.value.Descuento || 0)
  const precioFinalSinIva = getPrecioConDescuento(precioSinIva, descuento, productForm.value.EnOferta)

  return {
    ...productForm.value,
    idProducto: Number(productForm.value.idProducto),
    Nombre: productForm.value.Nombre,
    Precio: precioSinIva,
    iva: iva,
    Stock: Number(productForm.value.Stock || 0),
    Image: productForm.value.Image || null,
    Descripcion: productForm.value.Descripcion,
    Activo: Number(productForm.value.Activo),
    idCategoria: Number(idCategoria),
    EnOferta: Number(productForm.value.EnOferta),
    Descuento: descuento,
    FechaFinOferta: productForm.value.FechaFinOferta || null,

    PrecioOriginal_SinIVA: precioSinIva,
    PrecioOriginal_ConIVA: getPrecioConIva(precioSinIva, iva),
    PrecioFinal_SinIVA: precioFinalSinIva,
    PrecioFinal_ConIVA: getPrecioConIva(precioFinalSinIva, iva),
    NombreCategoria: category?.Nombre || '',
    NombreCategoriaPadre: parentCategory?.Nombre || null
  }
}

function openNewProductModal() {
  const nextId = productList.value.length ? Math.max(...productList.value.map((product) => product.idProducto)) + 1 : 1
  const firstCategory = categoryList.value[0] || null

  productModalMode.value = 'create'
  categoryMode.value = 'existing'
  newCategoryName.value = ''
  categoryParentId.value = firstCategory?.CategoriaPadre || null

  productForm.value = {
    idProducto: nextId,
    Nombre: '',
    Precio: 0,
    iva: 21,
    Stock: 0,
    Image: null,
    Descripcion: '',
    Activo: 1,
    idCategoria: firstCategory?.idCategoria || null,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null
  }

  productModalOpen.value = true
}

function openEditProductModal(product) {
  const category = getCategoryById(product.idCategoria)

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

function saveProduct() {
  const productData = buildProductData()

  if (productModalMode.value === 'create') {
    productList.value.push(productData)
  } else {
    productList.value = productList.value.map((product) => {
      return product.idProducto === productData.idProducto ? productData : product
    })
  }

  closeProductModal()
}

function openNewCategoryModal() {
  const nextId = categoryList.value.length ? Math.max(...categoryList.value.map((category) => category.idCategoria)) + 1 : 1

  categoryModalMode.value = 'create'
  categoryForm.value = {
    idCategoria: nextId,
    Nombre: '',
    CategoriaPadre: null
  }

  categoryModalOpen.value = true
}

function openEditCategoryModal(category) {
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

function saveCategory() {
  const categoryData = {
    idCategoria: Number(categoryForm.value.idCategoria),
    Nombre: categoryForm.value.Nombre.trim(),
    CategoriaPadre: categoryForm.value.CategoriaPadre ? Number(categoryForm.value.CategoriaPadre) : null
  }

  if (!categoryData.Nombre) return

  if (categoryModalMode.value === 'create') {
    categoryList.value.push(categoryData)
  } else {
    categoryList.value = categoryList.value.map((category) => {
      return category.idCategoria === categoryData.idCategoria ? categoryData : category
    })

    productList.value = productList.value.map((product) => {
      if (Number(product.idCategoria) !== categoryData.idCategoria) return product

      const parentCategory = categoryData.CategoriaPadre ? getCategoryById(categoryData.CategoriaPadre) : null

      return {
        ...product,
        NombreCategoria: categoryData.Nombre,
        NombreCategoriaPadre: parentCategory?.Nombre || null
      }
    })
  }

  closeCategoryModal()
}

function deleteCategory(category) {
  if (getCategoryProductCount(category.idCategoria) > 0) {
    console.log('No se puede eliminar una categoría con productos asociados')
    return
  }

  categoryList.value = categoryList.value
    .filter((item) => item.idCategoria !== category.idCategoria)
    .map((item) => {
      return item.CategoriaPadre === category.idCategoria ? { ...item, CategoriaPadre: null } : item
    })
}

function openNewOrderModal() {
  const nextId = orderList.value.length ? Math.max(...orderList.value.map((order) => order.idPedido)) + 1 : 1
  const firstProduct = productList.value[0]

  orderModalMode.value = 'create'
  selectedOrder.value = {
    idPedido: nextId,
    CodigoPedido: `FM${Date.now()}`,
    Cliente: 'Nuevo cliente',
    Email: 'cliente@funkomania.com',
    Telefono: '600123456',
    DireccionEnvio: 'Dirección de envío',
    FechaPedido: new Date().toISOString().slice(0, 10),
    EstadoPedido: 'pendiente',
    EstadoPago: 'pendiente',
    MetodoPago: 'Tarjeta bancaria',
    TotalConIVA: 0,
    Productos: firstProduct ? [
      {
        idLinea: `new-${Date.now()}`,
        idPedido: nextId,
        idProducto: firstProduct.idProducto,
        Nombre: firstProduct.Nombre,
        Cantidad: 1,
        PrecioUnitario_SinIVA: Number(firstProduct.Precio || firstProduct.PrecioOriginal_SinIVA || 0),
        IVA: Number(firstProduct.iva || 21)
      }
    ] : []
  }

  orderModalOpen.value = true
}

function openOrderModal(order) {
  orderModalMode.value = 'edit'
  selectedOrder.value = {
    ...order,
    Productos: order.Productos.map((product) => ({ ...product }))
  }

  orderModalOpen.value = true
}

function closeOrderModal() {
  orderModalOpen.value = false
  selectedOrder.value = null
}

function saveOrderChanges() {
  if (!selectedOrder.value) return

  const updatedOrder = {
    ...selectedOrder.value,
    TotalConIVA: selectedOrderTotal.value,
    Productos: selectedOrder.value.Productos.map((product) => ({ ...product }))
  }

  if (orderModalMode.value === 'create') {
    orderList.value.push(updatedOrder)
  } else {
    orderList.value = orderList.value.map((order) => {
      return order.idPedido === updatedOrder.idPedido ? updatedOrder : order
    })
  }

  closeOrderModal()
}

function handleLogout() {
  clearAuthUser()
  clearNotifications()
  router.push('/')
}
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

        <button class="admin-logout-button" type="button"  @click="handleLogout">
          <LogOut :size="18" :stroke-width="2.4" />
          Cerrar sesión
        </button>
      </aside>

      <section class="admin-main-panel">
        <div v-if="activeSection === 'datos'" class="admin-section">
          <h1>Mis datos</h1>

          <div class="admin-profile-card">
            <span class="admin-profile-icon">
              <ShieldCheck :size="52" :stroke-width="2.2" />
            </span>

            <div class="admin-profile-info">
              <h2>{{ mockAdmin.Nombre }} {{ mockAdmin.Apellido1 }}</h2>
              <p>{{ mockAdmin.email }}</p>

              <div class="admin-profile-grid">
                <div>
                  <span>Rol</span>
                  <strong>{{ mockAdmin.Rol }}</strong>
                </div>

                <div>
                  <span>Teléfono</span>
                  <strong>{{ mockAdmin.Telefono }}</strong>
                </div>

                <div>
                  <span>Estado</span>
                  <strong>{{ mockAdmin.Activo === 1 ? 'Activo' : 'Inactivo' }}</strong>
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
                  <span :class="{ 'admin-status-disabled': user.Activo === 0 }">
                    {{ user.Activo === 1 ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </article>

              <div v-if="filteredUsers.length === 0" class="admin-empty">
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
                  </div>
                </div>
              </article>

              <div v-if="filteredProducts.length === 0" class="admin-empty">
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

                    <button class="admin-category-delete-button" type="button" :disabled="getCategoryProductCount(category.idCategoria) > 0" @click="deleteCategory(category)">
                      <Trash2 :size="15" :stroke-width="2.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>

              <div v-if="filteredCategories.length === 0" class="admin-empty">
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

              <div v-if="filteredOrders.length === 0" class="admin-empty">
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

        <div class="admin-order-detail-grid">
          <label class="admin-order-detail-field">
            <span>Cliente</span>
            <input v-model="selectedOrder.Cliente" type="text" />
          </label>

          <label class="admin-order-detail-field">
            <span>Email</span>
            <input v-model="selectedOrder.Email" type="email" />
          </label>

          <label class="admin-order-detail-field">
            <span>Teléfono</span>
            <input v-model="selectedOrder.Telefono" type="text" />
          </label>

          <label class="admin-order-detail-field">
            <span>Fecha pedido</span>
            <input v-model="selectedOrder.FechaPedido" type="date" />
          </label>

          <label class="admin-order-detail-field admin-order-detail-field-full">
            <span>Dirección de envío</span>
            <input v-model="selectedOrder.DireccionEnvio" type="text" />
          </label>

          <label class="admin-order-detail-field">
            <span>Método de pago</span>
            <select v-model="selectedOrder.MetodoPago">
              <option v-for="method in paymentMethodOptions" :key="method" :value="method">
                {{ method }}
              </option>
            </select>
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
                <select v-model="product.idProducto" @change="updateOrderLineProduct(product)">
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