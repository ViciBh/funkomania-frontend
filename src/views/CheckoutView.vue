<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CheckCircle, CreditCard, MapPin, ShoppingCart, User } from 'lucide-vue-next'
import { getCart, cartBaseTotal, cartIvaTotal, cartTotal, clearCart } from '@/composables/useCart'
import { getProductImage } from '@/data/products'
import {
  mockUser,
  getUserAddresses,
  getActiveAddress,
  getActivePaymentMethods,
  getDefaultPaymentMethodId,
  getPaymentMethodById,
  formatAddress,
  simulatePayment
} from '@/data/checkout'

const cart = getCart()
const userAddresses = getUserAddresses()
const activeAddress = getActiveAddress()
const paymentMethods = getActivePaymentMethods()

const personalForm = ref({
  Nombre: mockUser.Nombre,
  Apellido1: mockUser.Apellido1,
  Apellido2: mockUser.Apellido2 || '',
  email: mockUser.email,
  Telefono: mockUser.Telefono || ''
})

const addressForm = ref({
  idDireccion: activeAddress?.idDireccion || null,
  Calle: activeAddress?.Calle || '',
  Numero: activeAddress?.Numero || '',
  Piso: activeAddress?.Piso || '',
  Puerta: activeAddress?.Puerta || '',
  Ciudad: activeAddress?.Ciudad || '',
  Municipio: activeAddress?.Municipio || '',
  Provincia: activeAddress?.Provincia || '',
  CP: activeAddress?.CP || ''
})

const cardForm = ref({
  Titular: '',
  NumeroTarjeta: '',
  FechaCaducidad: '',
  CVV: ''
})

const selectedPaymentMethodId = ref(getDefaultPaymentMethodId())
const orderConfirmed = ref(false)
const paymentMessage = ref('')
const addressMessage = ref('')

const visibleAddresses = computed(() => {
  return userAddresses.slice(0, 2)
})

const selectedPaymentMethod = computed(() => {
  return getPaymentMethodById(selectedPaymentMethodId.value)
})

const canConfirmOrder = computed(() => {
  return cart.value.length > 0 &&
    personalForm.value.Nombre &&
    personalForm.value.Apellido1 &&
    personalForm.value.email &&
    addressForm.value.Calle &&
    addressForm.value.Numero &&
    addressForm.value.Ciudad &&
    addressForm.value.Provincia &&
    addressForm.value.CP &&
    selectedPaymentMethodId.value
})

function selectAddress(address) {
  addressForm.value = {
    idDireccion: address.idDireccion,
    Calle: address.Calle,
    Numero: address.Numero,
    Piso: address.Piso || '',
    Puerta: address.Puerta || '',
    Ciudad: address.Ciudad,
    Municipio: address.Municipio,
    Provincia: address.Provincia,
    CP: address.CP
  }

  addressMessage.value = `Dirección seleccionada: ${formatAddress(address)}`
}

function saveAddress() {
  const savedAddressMock = {
    idDireccion: addressForm.value.idDireccion,
    idUsuario: mockUser.idUsuario,
    Calle: addressForm.value.Calle,
    Numero: addressForm.value.Numero,
    Piso: addressForm.value.Piso || null,
    Puerta: addressForm.value.Puerta || null,
    Ciudad: addressForm.value.Ciudad,
    Municipio: addressForm.value.Municipio,
    Provincia: addressForm.value.Provincia,
    CP: addressForm.value.CP,
    Activo: 1
  }

  console.log('Dirección simulada para guardar:', savedAddressMock)
  addressMessage.value = 'Dirección preparada para guardar. En backend se guardará en la tabla Direccion.'
}

function confirmOrder() {
  const paymentResult = simulatePayment(selectedPaymentMethodId.value)

  if (!paymentResult.success) {
    paymentMessage.value = paymentResult.message
    return
  }

  const orderMock = {
    usuario: {
      idUsuario: mockUser.idUsuario,
      ...personalForm.value
    },
    direccion: {
      idDireccion: addressForm.value.idDireccion,
      ...addressForm.value
    },
    idMetodoPago: selectedPaymentMethodId.value,
    metodoPago: selectedPaymentMethod.value?.Nombre,
    productos: cart.value,
    baseImponible: cartBaseTotal.value,
    ivaIncluido: cartIvaTotal.value,
    totalConIva: cartTotal.value
  }

  console.log('Pedido simulado:', orderMock)

  paymentMessage.value = paymentResult.message
  orderConfirmed.value = true
  clearCart()
}
</script>

<template>
  <main class="checkout-page">
    <section v-if="orderConfirmed" class="checkout-success">
      <CheckCircle :size="54" :stroke-width="2.2" />
      <h1>Pedido confirmado</h1>
      <p>{{ paymentMessage }}</p>
      <RouterLink to="/catalogo" class="checkout-main-link">Volver al catálogo</RouterLink>
    </section>

    <section v-else-if="cart.length > 0" class="checkout-layout">
      <div class="checkout-forms">
        <section class="checkout-block">
          <div class="checkout-block-title">
            <User :size="22" :stroke-width="2.4" />
            <h1>Información personal</h1>
          </div>

          <div class="checkout-personal-data">
            <label>
              <span>Nombre</span>
              <input v-model="personalForm.Nombre" type="text" />
            </label>

            <label>
              <span>Primer apellido</span>
              <input v-model="personalForm.Apellido1" type="text" />
            </label>

            <label>
              <span>Segundo apellido</span>
              <input v-model="personalForm.Apellido2" type="text" />
            </label>

            <label>
              <span>Email</span>
              <input v-model="personalForm.email" type="email" />
            </label>

            <label>
              <span>Teléfono</span>
              <input v-model="personalForm.Telefono" type="text" />
            </label>
          </div>
        </section>

        <section class="checkout-block">
          <div class="checkout-block-title">
            <MapPin :size="22" :stroke-width="2.4" />
            <h1>Dirección de envío</h1>
          </div>

          <div class="checkout-address-data">
            <label>
              <span>Calle</span>
              <input v-model="addressForm.Calle" type="text" />
            </label>

            <label>
              <span>Número</span>
              <input v-model="addressForm.Numero" type="text" />
            </label>

            <label>
              <span>Piso</span>
              <input v-model="addressForm.Piso" type="text" />
            </label>

            <label>
              <span>Puerta</span>
              <input v-model="addressForm.Puerta" type="text" />
            </label>

            <label>
              <span>Ciudad</span>
              <input v-model="addressForm.Ciudad" type="text" />
            </label>

            <label>
              <span>Municipio</span>
              <input v-model="addressForm.Municipio" type="text" />
            </label>

            <label>
              <span>Provincia</span>
              <input v-model="addressForm.Provincia" type="text" />
            </label>

            <label>
              <span>Código postal</span>
              <input v-model="addressForm.CP" type="text" />
            </label>
          </div>

          <button class="checkout-save-address" type="button" @click="saveAddress">Guardar dirección</button>
          <div class="checkout-saved-addresses">
            <h2>Direcciones guardadas</h2>

            <button v-for="address in visibleAddresses" :key="address.idDireccion" class="checkout-address-card" :class="{ 'checkout-address-card-active': address.Activo === 1 }" type="button" @click="selectAddress(address)">
              <span>
                <strong>{{ formatAddress(address) }}</strong>
                <small>{{ address.Activo === 1 ? 'Dirección activa' : 'Dirección guardada' }}</small>
              </span>
            </button>
          </div>
        </section>

        <section class="checkout-block">
          <div class="checkout-block-title">
            <CreditCard :size="22" :stroke-width="2.4" />
            <h1>Método de pago</h1>
          </div>

          <div class="checkout-options">
            <label v-for="method in paymentMethods" :key="method.idMetodoPago" class="checkout-option">
              <input v-model="selectedPaymentMethodId" type="radio" :value="method.idMetodoPago" />
              <span>
                <strong>{{ method.Nombre }}</strong>
                <small>{{ method.Mensaje }}</small>
              </span>
            </label>
          </div>

          <div v-if="selectedPaymentMethod?.RequiereFormulario" class="checkout-payment-simulation">
            <h2>Simulación de pago con tarjeta</h2>
            <p>Estos datos no se guardan en la base de datos. Solo simulan el proceso de pago.</p>

            <div class="checkout-card-form">
              <input v-model="cardForm.Titular" type="text" placeholder="Titular de la tarjeta" />
              <input v-model="cardForm.NumeroTarjeta" type="text" placeholder="Número de tarjeta" />
              <input v-model="cardForm.FechaCaducidad" type="text" placeholder="MM/AA" />
              <input v-model="cardForm.CVV" type="text" placeholder="CVV" />
            </div>
          </div>
        </section>
      </div>

      <aside class="checkout-summary-panel">
        <h1>Artículos</h1>

        <div class="checkout-products">
          <article v-for="product in cart" :key="product.idProducto" class="checkout-product">
            <div class="checkout-product-image-wrap">
              <img v-if="getProductImage(product.Image)" :src="getProductImage(product.Image)" :alt="product.Nombre" class="checkout-product-image" />
              <div v-else class="checkout-product-image-placeholder">Sin imagen</div>
            </div>

            <div class="checkout-product-info">
              <h2>{{ product.Nombre }}</h2>
              <p>{{ product.Cantidad }} x {{ product.PrecioConIva.toFixed(2) }}€</p>
            </div>
          </article>
        </div>

        <div class="checkout-totals-box">
          <h2>Sumas e impuestos</h2>

          <div class="checkout-summary-row">
            <span>Base imponible</span>
            <strong>{{ cartBaseTotal.toFixed(2) }}€</strong>
          </div>

          <div class="checkout-summary-row">
            <span>IVA incluido</span>
            <strong>{{ cartIvaTotal.toFixed(2) }}€</strong>
          </div>

          <div class="checkout-summary-row">
            <span>Envío estándar</span>
            <strong>0.00€</strong>
          </div>

          <div class="checkout-summary-row checkout-summary-total">
            <span>Total</span>
            <strong>{{ cartTotal.toFixed(2) }}€</strong>
          </div>
        </div>

        <p v-if="paymentMessage" class="checkout-message">{{ paymentMessage }}</p>

        <button class="checkout-confirm-button" type="button" :disabled="!canConfirmOrder" @click="confirmOrder">
          Comprar
        </button>

        <RouterLink to="/carrito" class="checkout-back-cart">Volver al carrito</RouterLink>
      </aside>
    </section>

    <section v-else class="checkout-empty">
      <ShoppingCart :size="48" :stroke-width="2.2" />
      <h1>No hay productos en el carrito</h1>
      <p>Añade productos antes de continuar con el checkout.</p>
      <RouterLink to="/catalogo" class="checkout-main-link">Ir al catálogo</RouterLink>
    </section>
  </main>
</template>

<style scoped></style>