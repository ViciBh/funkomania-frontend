/**
 * Vista de checkout de Funkomanía.
 * Gestiona los datos personales, dirección de envío, métodos de pago y creación real del pedido desde el carrito.
 *
 * @author Viktoriia Bohoslavska
 */
<script setup>
import { computed, ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { CheckCircle, CreditCard, MapPin, ShoppingCart, User } from 'lucide-vue-next'
import { getCart, cartBaseTotal, cartIvaTotal, cartTotal, loadCart } from '@/composables/useCart'
import { useAuth } from '@/composables/useAuth'
import { getProductImage } from '@/data/products'
import { getPaymentMethods } from '@/services/paymentService'
import { createUserAddress, getUserAddresses } from '@/services/addressService'
import { createOrderFromCart } from '@/services/orderService'

const cart = getCart()
const { authUser } = useAuth()
const paymentMethods = ref([])
const paymentMethodsLoading = ref(false)
const paymentMethodsError = ref('')
const addressSaving = ref(false)
const savedAddress = ref(null)
const savedAddressSnapshot = ref(null)
const personalForm = ref({
  Nombre: authUser.value.name || '',
  Apellido1: '',
  Apellido2: '',
  email: authUser.value.username || '',
  Telefono: ''
})
const addressForm = ref({
  idDireccion: null,
  Calle: '',
  Numero: '',
  Piso: '',
  Puerta: '',
  Ciudad: '',
  Municipio: '',
  Provincia: '',
  CP: ''
})
const cardForm = ref({
  Titular: '',
  NumeroTarjeta: '',
  FechaCaducidad: '',
  CVV: ''
})
const bizumForm = ref({
  TelefonoBizum: ''
})
const transferForm = ref({
  TitularTransferencia: ''
})
const selectedPaymentMethodId = ref(null)
const orderConfirmed = ref(false)
const orderCreating = ref(false)
const orderCode = ref('')
const paymentMessage = ref('')
const addressMessage = ref('')

const selectedPaymentMethod = computed(() => {
  return paymentMethods.value.find((method) => method.idMetodoPago === selectedPaymentMethodId.value) || null
})

function normalizePhone(phone) {
  return phone.replace(/\s/g, '')
}

function normalizeCardNumber(number) {
  return number.replace(/\s/g, '')
}

function normalizeAddressValue(value) {
  return String(value || '').trim().toLowerCase()
}

function getComparableAddress(address) {
  return {
    Calle: normalizeAddressValue(address?.Calle),
    Numero: normalizeAddressValue(address?.Numero),
    Piso: normalizeAddressValue(address?.Piso),
    Puerta: normalizeAddressValue(address?.Puerta),
    Ciudad: normalizeAddressValue(address?.Ciudad),
    Municipio: normalizeAddressValue(address?.Municipio),
    Provincia: normalizeAddressValue(address?.Provincia),
    CP: normalizeAddressValue(address?.CP)
  }
}

function isSameAddressData(addressA, addressB) {
  const firstAddress = getComparableAddress(addressA)
  const secondAddress = getComparableAddress(addressB)

  return firstAddress.Calle === secondAddress.Calle &&
    firstAddress.Numero === secondAddress.Numero &&
    firstAddress.Piso === secondAddress.Piso &&
    firstAddress.Puerta === secondAddress.Puerta &&
    firstAddress.Ciudad === secondAddress.Ciudad &&
    firstAddress.Municipio === secondAddress.Municipio &&
    firstAddress.Provincia === secondAddress.Provincia &&
    firstAddress.CP === secondAddress.CP
}

function isNameValid(value) {
  return /^[A-Za-zÀ-ÿ\s'-]{2,50}$/.test(value.trim())
}

function isEmailValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isPhoneValid(value) {
  return /^(\+34)?[6789]\d{8}$/.test(normalizePhone(value))
}

function isPostalCodeValid(value) {
  return /^\d{5}$/.test(value.trim())
}

function isAddressTextValid(value) {
  return /^[A-Za-zÀ-ÿ0-9\sºª.,'-]{2,120}$/.test(value.trim())
}

function isCityTextValid(value) {
  return /^[A-Za-zÀ-ÿ\s'-]{2,100}$/.test(value.trim())
}

function isAddressNumberValid(value) {
  return /^[A-Za-z0-9ºª/-]{1,10}$/.test(value.trim())
}

function isExpiryDateValid(value) {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return false
  const [month, year] = value.split('/')
  const expiryMonth = Number(month)
  const expiryYear = 2000 + Number(year)
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  return expiryYear > currentYear || (expiryYear === currentYear && expiryMonth >= currentMonth)
}

const isNombreValid = computed(() => isNameValid(personalForm.value.Nombre))
const isApellido1Valid = computed(() => isNameValid(personalForm.value.Apellido1))
const isApellido2Valid = computed(() => !personalForm.value.Apellido2 || isNameValid(personalForm.value.Apellido2))
const isEmailFormValid = computed(() => isEmailValid(personalForm.value.email))
const isTelefonoValid = computed(() => isPhoneValid(personalForm.value.Telefono))
const isCalleValid = computed(() => isAddressTextValid(addressForm.value.Calle))
const isNumeroValid = computed(() => isAddressNumberValid(addressForm.value.Numero))
const isPisoValid = computed(() => !addressForm.value.Piso || isAddressNumberValid(addressForm.value.Piso))
const isPuertaValid = computed(() => !addressForm.value.Puerta || isAddressNumberValid(addressForm.value.Puerta))
const isCiudadValid = computed(() => isCityTextValid(addressForm.value.Ciudad))
const isMunicipioValid = computed(() => !addressForm.value.Municipio || isCityTextValid(addressForm.value.Municipio))
const isProvinciaValid = computed(() => isCityTextValid(addressForm.value.Provincia))
const isCpValid = computed(() => isPostalCodeValid(addressForm.value.CP))
const isAddressFormChanged = computed(() => {
  if (!savedAddressSnapshot.value) return true
  return !isSameAddressData(addressForm.value, savedAddressSnapshot.value)
})
const isAddressSaved = computed(() => {
  return !!savedAddress.value?.idDireccion && !isAddressFormChanged.value
})
const isCardTitularValid = computed(() => isNameValid(cardForm.value.Titular))
const isCardNumberValid = computed(() => /^\d{16}$/.test(normalizeCardNumber(cardForm.value.NumeroTarjeta)))
const isCardExpiryValid = computed(() => isExpiryDateValid(cardForm.value.FechaCaducidad))
const isCardCvvValid = computed(() => /^\d{3,4}$/.test(cardForm.value.CVV))
const isBizumFormValid = computed(() => isPhoneValid(bizumForm.value.TelefonoBizum))
const isTransferFormValid = computed(() => isNameValid(transferForm.value.TitularTransferencia))
const isPersonalFormValid = computed(() => {
  return isNombreValid.value &&
    isApellido1Valid.value &&
    isApellido2Valid.value &&
    isEmailFormValid.value &&
    isTelefonoValid.value
})
const isAddressFormValid = computed(() => {
  return isCalleValid.value &&
    isNumeroValid.value &&
    isPisoValid.value &&
    isPuertaValid.value &&
    isCiudadValid.value &&
    isMunicipioValid.value &&
    isProvinciaValid.value &&
    isCpValid.value
})
const isCardFormValid = computed(() => {
  return isCardTitularValid.value &&
    isCardNumberValid.value &&
    isCardExpiryValid.value &&
    isCardCvvValid.value
})
const isPaymentFormValid = computed(() => {
  if (!selectedPaymentMethod.value) return false
  if (selectedPaymentMethod.value.Tipo === 'card') return isCardFormValid.value
  if (selectedPaymentMethod.value.Tipo === 'bizum') return isBizumFormValid.value
  if (selectedPaymentMethod.value.Tipo === 'transfer') return isTransferFormValid.value
  return true
})
const canConfirmOrder = computed(() => {
  return cart.value.length > 0 &&
    isPersonalFormValid.value &&
    isAddressFormValid.value &&
    isAddressSaved.value &&
    selectedPaymentMethodId.value &&
    isPaymentFormValid.value &&
    !orderCreating.value
})

function showError(value, isValid) {
  return value && !isValid
}

function fillAddressForm(address) {
  addressForm.value = {
    idDireccion: address?.idDireccion || null,
    Calle: address?.Calle || '',
    Numero: address?.Numero || '',
    Piso: address?.Piso || '',
    Puerta: address?.Puerta || '',
    Ciudad: address?.Ciudad || '',
    Municipio: address?.Municipio || '',
    Provincia: address?.Provincia || '',
    CP: address?.CP || ''
  }
}

async function loadPaymentMethods() {
  paymentMethodsLoading.value = true
  paymentMethodsError.value = ''

  try {
    paymentMethods.value = await getPaymentMethods()
    selectedPaymentMethodId.value = paymentMethods.value[0]?.idMetodoPago || null
  } catch (error) {
    paymentMethodsError.value = 'No se pudieron cargar los métodos de pago'
    console.error('Error cargando métodos de pago:', error)
  } finally {
    paymentMethodsLoading.value = false
  }
}

async function loadLastActiveAddress() {
  try {
    const addresses = await getUserAddresses()
    const activeAddress = addresses
      .filter((address) => address.Activo === 1)
      .sort((a, b) => b.idDireccion - a.idDireccion)[0]

    if (activeAddress) {
      savedAddress.value = activeAddress
      savedAddressSnapshot.value = getComparableAddress(activeAddress)
      fillAddressForm(activeAddress)
      addressMessage.value = 'Se ha cargado tu última dirección usada. Puedes usarla o modificarla y guardar una nueva.'
    } else {
      addressMessage.value = 'Introduce una dirección de envío y guárdala antes de confirmar el pedido.'
    }
  } catch (error) {
    addressMessage.value = 'Introduce una dirección de envío y guárdala antes de confirmar el pedido.'
    console.error('Error cargando dirección activa:', error)
  }
}

async function saveAddress() {
  if (!isAddressFormValid.value) {
    addressMessage.value = 'Revisa los datos de la dirección antes de guardarla.'
    return
  }

  if (isAddressSaved.value) {
    addressMessage.value = 'La dirección ya está guardada y se usará para este pedido.'
    return
  }

  addressSaving.value = true

  try {
    const createdAddress = await createUserAddress({
      ...addressForm.value,
      idDireccion: null
    })

    if (createdAddress?.idDireccion) {
      savedAddress.value = createdAddress
      savedAddressSnapshot.value = getComparableAddress(createdAddress)
      fillAddressForm(createdAddress)
      addressMessage.value = 'Dirección guardada y seleccionada para este pedido.'
    } else {
      await loadLastActiveAddress()
      addressMessage.value = 'Dirección guardada y seleccionada para este pedido.'
    }
  } catch (error) {
    addressMessage.value = 'No se pudo guardar la dirección. Revisa los datos e inténtalo de nuevo.'
    console.error('Error guardando dirección:', error)
  } finally {
    addressSaving.value = false
  }
}

function getSimulatedPaymentStatus() {
  if (!selectedPaymentMethod.value) return 'pago_error'
  if (selectedPaymentMethod.value.Tipo === 'transfer') return 'pendiente_transferencia'
  if (selectedPaymentMethod.value.Tipo === 'cash') return 'pendiente_contra_reembolso'
  return 'pagado'
}

function getSimulatedPaymentData() {
  if (!selectedPaymentMethod.value) return null

  if (selectedPaymentMethod.value.Tipo === 'card') {
    return {
      tipo: 'tarjeta',
      titular: cardForm.value.Titular,
      numeroEnmascarado: `**** **** **** ${normalizeCardNumber(cardForm.value.NumeroTarjeta).slice(-4)}`,
      fechaCaducidad: cardForm.value.FechaCaducidad
    }
  }

  if (selectedPaymentMethod.value.Tipo === 'bizum') {
    return {
      tipo: 'bizum',
      telefono: bizumForm.value.TelefonoBizum
    }
  }

  if (selectedPaymentMethod.value.Tipo === 'transfer') {
    return {
      tipo: 'transferencia',
      titular: transferForm.value.TitularTransferencia,
      ibanSimulado: 'ES00 0000 0000 0000 0000 0000',
      referencia: 'FUNKOMANIA-PEDIDO'
    }
  }

  return {
    tipo: selectedPaymentMethod.value.Tipo
  }
}

function simulatePayment() {
  if (!isPersonalFormValid.value) {
    return {
      success: false,
      message: 'Revisa la información personal. El nombre, apellidos, email y teléfono deben tener un formato válido.'
    }
  }

  if (!isAddressFormValid.value) {
    return {
      success: false,
      message: 'Revisa la dirección de envío. El código postal debe tener 5 dígitos y los campos obligatorios deben ser válidos.'
    }
  }

  if (!isAddressSaved.value) {
    return {
      success: false,
      message: 'Guarda la dirección de envío antes de confirmar el pedido.'
    }
  }

  if (!selectedPaymentMethod.value) {
    return {
      success: false,
      message: 'Selecciona un método de pago.'
    }
  }

  if (selectedPaymentMethod.value.Tipo === 'card' && !isCardFormValid.value) {
    return {
      success: false,
      message: 'Revisa los datos de la tarjeta.'
    }
  }

  if (selectedPaymentMethod.value.Tipo === 'bizum' && !isBizumFormValid.value) {
    return {
      success: false,
      message: 'Introduce un teléfono Bizum válido.'
    }
  }

  if (selectedPaymentMethod.value.Tipo === 'transfer' && !isTransferFormValid.value) {
    return {
      success: false,
      message: 'Introduce el nombre del titular que realizará la transferencia.'
    }
  }

  if (selectedPaymentMethod.value.Tipo === 'transfer') {
    return {
      success: true,
      message: 'Pedido registrado. El pago queda pendiente por transferencia bancaria.'
    }
  }

  if (selectedPaymentMethod.value.Tipo === 'cash') {
    return {
      success: true,
      message: 'Pedido registrado. El pago se realizará al recibir el pedido.'
    }
  }

  if (selectedPaymentMethod.value.Tipo === 'paypal') {
    return {
      success: true,
      message: 'Pago simulado correctamente mediante PayPal.'
    }
  }

  if (selectedPaymentMethod.value.Tipo === 'wallet') {
    return {
      success: true,
      message: `Pago móvil simulado correctamente mediante ${selectedPaymentMethod.value.Nombre}.`
    }
  }

  return {
    success: true,
    message: `Pago simulado correctamente mediante ${selectedPaymentMethod.value.Nombre}.`
  }
}

async function confirmOrder() {
  const paymentResult = simulatePayment()

  if (!paymentResult.success) {
    paymentMessage.value = paymentResult.message
    return
  }

  orderCreating.value = true
  paymentMessage.value = ''

  try {
    const createdOrder = await createOrderFromCart({
      idDireccion: savedAddress.value.idDireccion,
      idMetodoPago: selectedPaymentMethodId.value,
      comentarios: ''
    })

    orderCode.value = createdOrder?.codigoPedido || ''
    paymentMessage.value = createdOrder?.mensaje || paymentResult.message || 'Pedido confirmado correctamente.'
    orderConfirmed.value = true
    await loadCart()
  } catch (error) {
    paymentMessage.value = 'No se pudo crear el pedido. Revisa el carrito, la dirección y el método de pago.'
    console.error('Error creando pedido:', error)
  } finally {
    orderCreating.value = false
  }
}

onMounted(() => {
  loadPaymentMethods()
  loadLastActiveAddress()
})
</script>

<template>
  <main class="checkout-page">
    <section v-if="orderConfirmed" class="checkout-success">
      <CheckCircle :size="54" :stroke-width="2.2" />
      <h1>Pedido confirmado</h1>
      <p>{{ paymentMessage }}</p>
      <p v-if="orderCode"><strong>Código de pedido:</strong> {{ orderCode }}</p>
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
              <input v-model="personalForm.Nombre" type="text" :class="{ 'checkout-input-error': showError(personalForm.Nombre, isNombreValid) }" />
              <small v-if="showError(personalForm.Nombre, isNombreValid)" class="checkout-field-error">El nombre debe contener solo letras y mínimo 2 caracteres.</small>
            </label>

            <label>
              <span>Primer apellido</span>
              <input v-model="personalForm.Apellido1" type="text" :class="{ 'checkout-input-error': showError(personalForm.Apellido1, isApellido1Valid) }" />
              <small v-if="showError(personalForm.Apellido1, isApellido1Valid)" class="checkout-field-error">El primer apellido debe contener solo letras y mínimo 2 caracteres.</small>
            </label>

            <label>
              <span>Segundo apellido</span>
              <input v-model="personalForm.Apellido2" type="text" :class="{ 'checkout-input-error': showError(personalForm.Apellido2, isApellido2Valid) }" />
              <small v-if="showError(personalForm.Apellido2, isApellido2Valid)" class="checkout-field-error">El segundo apellido debe contener solo letras.</small>
            </label>

            <label>
              <span>Email</span>
              <input v-model="personalForm.email" type="email" :class="{ 'checkout-input-error': showError(personalForm.email, isEmailFormValid) }" />
              <small v-if="showError(personalForm.email, isEmailFormValid)" class="checkout-field-error">Introduce un email válido.</small>
            </label>

            <label>
              <span>Teléfono</span>
              <input v-model="personalForm.Telefono" type="text" placeholder="Ej. 600123456 o +34600123456" :class="{ 'checkout-input-error': showError(personalForm.Telefono, isTelefonoValid) }" />
              <small v-if="showError(personalForm.Telefono, isTelefonoValid)" class="checkout-field-error">El teléfono debe tener 9 dígitos o formato +34 seguido de 9 dígitos.</small>
            </label>
          </div>
        </section>

        <section class="checkout-block">
          <div class="checkout-block-title">
            <MapPin :size="22" :stroke-width="2.4" />
            <h1>Dirección de envío</h1>
          </div>

          <p class="checkout-message">Introduce la dirección de envío. Al guardarla, se creará como dirección activa y las anteriores quedarán inactivas en la base de datos.</p>

          <div class="checkout-address-data">
            <label>
              <span>Calle</span>
              <input v-model="addressForm.Calle" type="text" :class="{ 'checkout-input-error': showError(addressForm.Calle, isCalleValid) }" />
              <small v-if="showError(addressForm.Calle, isCalleValid)" class="checkout-field-error">Introduce una calle válida.</small>
            </label>

            <label>
              <span>Número</span>
              <input v-model="addressForm.Numero" type="text" :class="{ 'checkout-input-error': showError(addressForm.Numero, isNumeroValid) }" />
              <small v-if="showError(addressForm.Numero, isNumeroValid)" class="checkout-field-error">Introduce un número válido.</small>
            </label>

            <label>
              <span>Piso</span>
              <input v-model="addressForm.Piso" type="text" :class="{ 'checkout-input-error': showError(addressForm.Piso, isPisoValid) }" />
              <small v-if="showError(addressForm.Piso, isPisoValid)" class="checkout-field-error">Introduce un piso válido.</small>
            </label>

            <label>
              <span>Puerta</span>
              <input v-model="addressForm.Puerta" type="text" :class="{ 'checkout-input-error': showError(addressForm.Puerta, isPuertaValid) }" />
              <small v-if="showError(addressForm.Puerta, isPuertaValid)" class="checkout-field-error">Introduce una puerta válida.</small>
            </label>

            <label>
              <span>Ciudad</span>
              <input v-model="addressForm.Ciudad" type="text" :class="{ 'checkout-input-error': showError(addressForm.Ciudad, isCiudadValid) }" />
              <small v-if="showError(addressForm.Ciudad, isCiudadValid)" class="checkout-field-error">Introduce una ciudad válida.</small>
            </label>

            <label>
              <span>Municipio</span>
              <input v-model="addressForm.Municipio" type="text" :class="{ 'checkout-input-error': showError(addressForm.Municipio, isMunicipioValid) }" />
              <small v-if="showError(addressForm.Municipio, isMunicipioValid)" class="checkout-field-error">Introduce un municipio válido.</small>
            </label>

            <label>
              <span>Provincia</span>
              <input v-model="addressForm.Provincia" type="text" :class="{ 'checkout-input-error': showError(addressForm.Provincia, isProvinciaValid) }" />
              <small v-if="showError(addressForm.Provincia, isProvinciaValid)" class="checkout-field-error">Introduce una provincia válida.</small>
            </label>

            <label>
              <span>Código postal</span>
              <input v-model="addressForm.CP" type="text" placeholder="Ej. 30001" :class="{ 'checkout-input-error': showError(addressForm.CP, isCpValid) }" />
              <small v-if="showError(addressForm.CP, isCpValid)" class="checkout-field-error">El código postal debe tener 5 dígitos.</small>
            </label>
          </div>

          <button class="checkout-save-address" type="button" :disabled="addressSaving" @click="saveAddress">
            {{ addressSaving ? 'Guardando dirección...' : 'Guardar dirección' }}
          </button>

          <p v-if="addressMessage" class="checkout-message">{{ addressMessage }}</p>
        </section>

        <section class="checkout-block">
          <div class="checkout-block-title">
            <CreditCard :size="22" :stroke-width="2.4" />
            <h1>Método de pago</h1>
          </div>

          <p v-if="paymentMethodsLoading" class="checkout-message">Cargando métodos de pago...</p>
          <p v-else-if="paymentMethodsError" class="checkout-message">{{ paymentMethodsError }}</p>

          <div v-else class="checkout-options">
            <label v-for="method in paymentMethods" :key="method.idMetodoPago" class="checkout-option">
              <input v-model="selectedPaymentMethodId" type="radio" :value="method.idMetodoPago" />
              <span>
                <strong>{{ method.Nombre }}</strong>
                <small>{{ method.Mensaje }}</small>
              </span>
            </label>
          </div>

          <div v-if="selectedPaymentMethod?.Tipo === 'card'" class="checkout-payment-simulation">
            <h2>Datos de tarjeta</h2>
            <p>Estos datos no se guardan en la base de datos. Solo simulan el proceso de pago.</p>

            <div class="checkout-card-form">
              <label>
                <input v-model="cardForm.Titular" type="text" placeholder="Titular de la tarjeta" :class="{ 'checkout-input-error': showError(cardForm.Titular, isCardTitularValid) }" />
                <small v-if="showError(cardForm.Titular, isCardTitularValid)" class="checkout-field-error">El titular debe contener solo letras y mínimo 2 caracteres.</small>
              </label>

              <label>
                <input v-model="cardForm.NumeroTarjeta" type="text" placeholder="Número de tarjeta, 16 dígitos" :class="{ 'checkout-input-error': showError(cardForm.NumeroTarjeta, isCardNumberValid) }" />
                <small v-if="showError(cardForm.NumeroTarjeta, isCardNumberValid)" class="checkout-field-error">El número de tarjeta debe tener 16 dígitos.</small>
              </label>

              <label>
                <input v-model="cardForm.FechaCaducidad" type="text" placeholder="MM/AA" :class="{ 'checkout-input-error': showError(cardForm.FechaCaducidad, isCardExpiryValid) }" />
                <small v-if="showError(cardForm.FechaCaducidad, isCardExpiryValid)" class="checkout-field-error">Formato válido: MM/AA y fecha no caducada.</small>
              </label>

              <label>
                <input v-model="cardForm.CVV" type="text" placeholder="CVV" :class="{ 'checkout-input-error': showError(cardForm.CVV, isCardCvvValid) }" />
                <small v-if="showError(cardForm.CVV, isCardCvvValid)" class="checkout-field-error">El CVV debe tener 3 o 4 dígitos.</small>
              </label>
            </div>

            <p class="checkout-payment-note">Ejemplo válido: 4111111111111111 · 12/30 · 123</p>
          </div>

          <div v-else-if="selectedPaymentMethod?.Tipo === 'bizum'" class="checkout-payment-simulation">
            <h2>Datos de Bizum</h2>
            <p>Introduce el teléfono asociado a Bizum. No se realizará ningún cargo real.</p>

            <div class="checkout-card-form">
              <label>
                <input v-model="bizumForm.TelefonoBizum" type="text" placeholder="Teléfono Bizum, ej. 600123456 o +34600123456" :class="{ 'checkout-input-error': showError(bizumForm.TelefonoBizum, isBizumFormValid) }" />
                <small v-if="showError(bizumForm.TelefonoBizum, isBizumFormValid)" class="checkout-field-error">El teléfono debe tener 9 dígitos o formato +34 seguido de 9 dígitos.</small>
              </label>
            </div>
          </div>

          <div v-else-if="selectedPaymentMethod?.Tipo === 'transfer'" class="checkout-payment-simulation">
            <h2>Datos de transferencia bancaria</h2>
            <p>El pedido quedará registrado como pendiente de pago.</p>

            <div class="checkout-card-form">
              <label>
                <input v-model="transferForm.TitularTransferencia" type="text" placeholder="Nombre del titular de la transferencia" :class="{ 'checkout-input-error': showError(transferForm.TitularTransferencia, isTransferFormValid) }" />
                <small v-if="showError(transferForm.TitularTransferencia, isTransferFormValid)" class="checkout-field-error">El titular debe contener solo letras y mínimo 2 caracteres.</small>
              </label>
            </div>

            <p><strong>IBAN simulado:</strong> ES00 0000 0000 0000 0000 0000</p>
            <p><strong>Referencia:</strong> FUNKOMANIA-PEDIDO</p>
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
          <h2>Sumas y impuestos</h2>

          <div class="checkout-summary-row">
            <span>Base imponible</span>
            <strong>{{ cartBaseTotal.toFixed(2) }}€</strong>
          </div>

          <div class="checkout-summary-row">
            <span>IVA incluido</span>
            <strong>{{ cartIvaTotal.toFixed(2) }}€</strong>
          </div>

          <p class="checkout-shipping-note">
            <strong>Nota:</strong> el coste de envío no está incluido en el precio de los productos.
          </p>

          <div class="checkout-summary-row checkout-summary-total">
            <span>Total</span>
            <strong>{{ cartTotal.toFixed(2) }}€</strong>
          </div>
        </div>

        <p v-if="paymentMessage" class="checkout-message">{{ paymentMessage }}</p>

        <button class="checkout-confirm-button" type="button" :disabled="!canConfirmOrder" @click="confirmOrder">
          {{ orderCreating ? 'Creando pedido...' : 'Comprar' }}
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