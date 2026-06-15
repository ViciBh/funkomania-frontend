# Funkomanía - Ejecución del frontend

Este repositorio global contiene el proyecto Funkomanía organizado mediante submódulos de Git. El frontend se encuentra dentro del submódulo `frontend`.

## Clonar el repositorio global con submódulos

Para descargar el proyecto completo, incluyendo backend y frontend, se debe clonar el repositorio usando la opción `--recursive`:

```bash
git clone --recursive https://github.com/JuanAlberticoHF/funkomania.git
```

Después, acceder a la carpeta del proyecto:

```bash
cd funkomania
```

La estructura esperada del repositorio global es:

```txt
funkomania/
  backend/
  frontend/
  .gitmodules
```

## Inicializar submódulos si el repositorio ya estaba clonado

Si el repositorio global ya fue clonado sin usar `--recursive`, se pueden descargar los submódulos con el siguiente comando:

```bash
git submodule update --init --recursive
```

## Ejecutar el frontend

Para ejecutar el frontend, acceder a la carpeta correspondiente:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Ejecutar el servidor local de desarrollo:

```bash
npm run dev
```

La aplicación frontend estará disponible normalmente en:

```txt
http://localhost:5173/
```

## Conexión con el backend

Para que el frontend pueda comunicarse correctamente con la API, el backend debe estar ejecutándose en:

```txt
http://localhost:8080
```

El frontend utiliza un proxy configurado en Vite. Por ello, las peticiones realizadas desde el frontend a rutas que empiezan por `/api` se redirigen automáticamente al backend durante el desarrollo.

Ejemplo:

```txt
Frontend: /api/productos
Backend:  http://localhost:8080/productos
```

La configuración del proxy se encuentra en el archivo `vite.config.js`.

## Variables de entorno para Supabase

Para utilizar la subida de imágenes de productos desde el panel de administración, es necesario configurar Supabase.

Dentro de la carpeta `frontend`, crear un archivo `.env` con el siguiente contenido:

```env
VITE_SUPABASE_URL=https://wrtuusxnsyvmzrdzrbmj.supabase.co
VITE_SUPABASE_KEY=TU_SUPABASE_PUBLISHABLE_KEY
```

Después de modificar el archivo `.env`, es necesario reiniciar el servidor de desarrollo:

```bash
Ctrl + C
npm run dev
```

El archivo `.env` no debe subirse al repositorio, ya que puede contener claves o datos de configuración privados.

## Comandos de comprobación del frontend

Para ejecutar las pruebas unitarias y de componentes con Vitest:

```bash
npm run test
```

Para comprobar que el proyecto compila correctamente:

```bash
npm run build
```

Para ejecutar las pruebas E2E con Playwright:

```bash
npm run e2e
```

Resultado esperado:

```txt
Vitest: pruebas superadas
Build: compilación correcta
Playwright: pruebas E2E superadas
```

## Actualizar el submódulo frontend

Los submódulos no guardan automáticamente la última versión del repositorio, sino un commit concreto. Por ello, si se actualiza el repositorio del frontend, también hay que actualizar la referencia del submódulo en el repositorio global.

Primero, actualizar el repositorio frontend:

```bash
cd frontend
git pull origin main
```

Después, volver a la raíz del repositorio global:

```bash
cd ..
```

Comprobar cambios:

```bash
git status
```

Guardar la nueva referencia del submódulo:

```bash
git add frontend
git commit -m "Actualiza submodulo frontend"
git push origin main
```

## Nota importante

Para trabajar correctamente con el proyecto completo, se recomienda clonar siempre el repositorio global con:

```bash
git clone --recursive https://github.com/JuanAlberticoHF/funkomania.git
```

De esta forma se descargan automáticamente tanto el backend como el frontend.
