# Shopify to Google Sheets Pipeline

Pipeline automatizado para extraer datos de una tienda Shopify y sincronizarlos con Google Sheets. Diseñado para trabajar con acceso de colaborador (no requiere permisos de administrador).

## 📋 Características

- ✅ Extracción de datos de Shopify usando Admin API
- ✅ Funciona con acceso de colaborador (no necesitas ser admin)
- ✅ Soporte para múltiples tipos de datos:
  - Productos
  - Órdenes
  - Clientes
  - Inventario
- ✅ Sincronización automática con Google Sheets
- ✅ Formato automático de hoja de cálculo
- ✅ Manejo robusto de errores

## 🚀 Instalación

### 1. Instalar dependencias

```bash
cd shopify-sheets-pipeline
npm install
```

### 2. Configurar Shopify

Como colaborador de una tienda Shopify, necesitas obtener un token de acceso:

#### Opción A: Token proporcionado por el propietario de la tienda

Solicita al administrador de la tienda que cree un token de acceso con los siguientes permisos:
- `read_products` (para productos)
- `read_orders` (para órdenes)
- `read_customers` (para clientes)
- `read_inventory` (para inventario)

#### Opción B: App personalizada (si tienes acceso)

1. Ve a tu tienda Shopify: `https://TU-TIENDA.myshopify.com/admin/apps`
2. Navega a "Apps" → "App development" → "Create an app"
3. Configura los scopes necesarios
4. Genera el Access Token

### 3. Configurar Google Sheets

#### Crear una cuenta de servicio de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Sheets:
   - Ve a "APIs & Services" → "Library"
   - Busca "Google Sheets API"
   - Haz clic en "Enable"
4. Crea una cuenta de servicio:
   - Ve a "APIs & Services" → "Credentials"
   - Haz clic en "Create Credentials" → "Service Account"
   - Completa el formulario y haz clic en "Create"
   - No necesitas otorgar roles adicionales
5. Genera una clave:
   - Haz clic en la cuenta de servicio creada
   - Ve a la pestaña "Keys"
   - Haz clic en "Add Key" → "Create new key"
   - Selecciona "JSON" y descarga el archivo
6. Guarda el archivo descargado como `credentials.json` en este directorio

#### Configurar el Spreadsheet

1. Crea una nueva Google Sheet o abre una existente
2. Comparte la hoja con el email de la cuenta de servicio (encontrarás el email en `credentials.json`, algo como `xxx@xxx.iam.gserviceaccount.com`)
3. Otorga permisos de "Editor"
4. Copia el ID del spreadsheet desde la URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### 4. Configurar variables de entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus credenciales
nano .env
```

Configura las siguientes variables:

```env
# URL de tu tienda Shopify (sin https://)
SHOPIFY_STORE_URL=tu-tienda.myshopify.com

# Token de acceso de Shopify
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx

# ID del Google Spreadsheet
GOOGLE_SPREADSHEET_ID=1abc123def456...

# Nombre de la hoja (por defecto: Sheet1)
GOOGLE_SHEET_NAME=Productos

# Tipo de datos a extraer: products, orders, customers, inventory
DATA_TO_PULL=products
```

## 📖 Uso

### Ejecutar el pipeline

```bash
npm start
```

O directamente:

```bash
node index.js
```

### Ejemplo de salida

```
=== Shopify to Google Sheets Pipeline ===

Store: mi-tienda.myshopify.com
Data Type: products
Target Sheet: Productos

Step 1: Extracting data from Shopify...
Fetching products from Shopify...
Successfully fetched 45 products
Extracted 45 records from Shopify

Step 2: Uploading data to Google Sheets...
Successfully authenticated with Google Sheets API
Uploading 45 rows to Google Sheets...
Cleared existing data from sheet
Successfully uploaded 46 rows to Google Sheets
Updated cells: 368

Step 3: Formatting sheet...
Sheet formatted successfully

=== Pipeline completed successfully! ===
View your spreadsheet: https://docs.google.com/spreadsheets/d/1abc123def456...
```

## 📊 Tipos de datos soportados

### Products (Productos)
Extrae información de productos:
- ID
- Título
- Proveedor
- Tipo de producto
- Fechas de creación y actualización
- Estado
- Etiquetas
- Cantidad de variantes
- Precio

### Orders (Órdenes)
Extrae información de órdenes:
- ID y número de orden
- Email del cliente
- Fechas
- Precios (total, subtotal, impuestos)
- Estado financiero
- Estado de fulfillment
- Cantidad de items

### Customers (Clientes)
Extrae información de clientes:
- ID
- Email
- Nombre y apellido
- Cantidad de órdenes
- Total gastado
- Fechas
- Estado

### Inventory (Inventario)
Extrae niveles de inventario:
- ID del item
- ID de ubicación
- Cantidad disponible
- Fecha de actualización

## 🔧 Estructura del proyecto

```
shopify-sheets-pipeline/
├── index.js                    # Script principal del pipeline
├── config.js                   # Configuración y variables de entorno
├── shopifyExtractor.js         # Módulo para extraer datos de Shopify
├── googleSheetsUploader.js     # Módulo para subir datos a Google Sheets
├── package.json                # Dependencias del proyecto
├── .env.example               # Ejemplo de variables de entorno
├── .env                       # Variables de entorno (no incluido en git)
├── credentials.json           # Credenciales de Google (no incluido en git)
└── README.md                  # Este archivo
```

## 🔐 Seguridad

- ⚠️ **NUNCA** compartas o commits los archivos `.env` o `credentials.json`
- Estos archivos están incluidos en `.gitignore`
- Mantén tus tokens y credenciales seguros
- Revoca tokens que ya no necesites

## 🐛 Solución de problemas

### Error: "Authentication failed"
- Verifica que tu `SHOPIFY_ACCESS_TOKEN` sea válido
- Asegúrate de que el token tenga los permisos necesarios
- Verifica que `credentials.json` esté presente y sea válido

### Error: "credentials.json not found"
- Asegúrate de haber descargado y colocado el archivo de credenciales en el directorio del proyecto
- Verifica que el nombre del archivo sea exactamente `credentials.json`

### Error: "Sheet not found"
- Verifica que el `GOOGLE_SHEET_NAME` coincida con el nombre de la pestaña en tu spreadsheet
- Asegúrate de que la cuenta de servicio tenga acceso al spreadsheet

### Error: "Rate limit exceeded"
- Shopify tiene límites de API (2 requests/segundo para la mayoría de planes)
- El script ya incluye manejo básico, pero si tienes muchos datos, considera agregar delays

## 📝 Automatización (Opcional)

### Usando cron (Linux/macOS)

Para ejecutar el pipeline automáticamente, agrega una entrada a crontab:

```bash
# Ejecutar cada día a las 2:00 AM
0 2 * * * cd /ruta/a/shopify-sheets-pipeline && node index.js >> logs/pipeline.log 2>&1
```

### Usando Task Scheduler (Windows)

1. Abre el Programador de tareas
2. Crea una nueva tarea básica
3. Configura el trigger (horario)
4. Configura la acción: ejecutar `node.exe` con el argumento de ruta al `index.js`

## 🤝 Soporte

Si encuentras problemas o tienes preguntas:
- Email: diego.huamantica@outlook.com
- Abre un issue en el repositorio

## 📄 Licencia

MIT License - Siéntete libre de usar y modificar según tus necesidades.

---

Desarrollado por Diego Huamantica
