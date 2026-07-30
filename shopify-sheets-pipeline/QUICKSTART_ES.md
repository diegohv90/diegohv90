# Guía Rápida de Inicio

Esta guía te ayudará a configurar el pipeline en 5 minutos.

## Paso 1: Instalar dependencias

```bash
cd shopify-sheets-pipeline
npm install
```

## Paso 2: Configurar variables de entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita el archivo .env
nano .env  # o usa tu editor favorito
```

Configura estas variables:

```env
SHOPIFY_STORE_URL=tu-tienda.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
GOOGLE_SPREADSHEET_ID=1abc123def...
GOOGLE_SHEET_NAME=Sheet1
DATA_TO_PULL=products
```

### ¿Cómo obtener el Shopify Access Token?

**Como colaborador**, solicita al administrador de la tienda que:

1. Vaya a: Configuración → Apps y canales de ventas → Develop apps
2. Cree una nueva app personalizada
3. Configure los permisos:
   - `read_products` para productos
   - `read_orders` para órdenes
   - `read_customers` para clientes
   - `read_inventory` para inventario
4. Instale la app y copie el "Admin API access token"
5. Te comparta ese token de forma segura

### ¿Cómo obtener el Google Spreadsheet ID?

1. Abre tu Google Sheet
2. Mira la URL: `https://docs.google.com/spreadsheets/d/[ESTE-ES-EL-ID]/edit`
3. Copia el ID que está entre `/d/` y `/edit`

## Paso 3: Configurar credenciales de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto nuevo
3. Habilita la API de Google Sheets
4. Crea una cuenta de servicio (Service Account)
5. Descarga las credenciales en formato JSON
6. Guárdalas como `credentials.json` en este directorio

**Importante:** Comparte tu Google Sheet con el email de la cuenta de servicio (está en el archivo JSON, algo como `xxx@xxx.iam.gserviceaccount.com`)

## Paso 4: Validar configuración

```bash
npm run test-config
```

Si todo está correcto, verás:

```
✅ Configuration looks good!
```

## Paso 5: Ejecutar el pipeline

```bash
npm start
```

## ¿Qué datos puedo extraer?

Cambia `DATA_TO_PULL` en tu archivo `.env` a uno de estos valores:

- `products` - Productos de la tienda
- `orders` - Órdenes y ventas
- `customers` - Base de clientes
- `inventory` - Niveles de inventario

## Solución rápida de problemas

### Error: "credentials.json not found"
→ Asegúrate de haber descargado y guardado el archivo de credenciales de Google

### Error: "Authentication failed"
→ Verifica que tu token de Shopify sea válido y tenga los permisos correctos

### Error: "Sheet not found"
→ Verifica que hayas compartido la hoja con la cuenta de servicio de Google

## ¿Necesitas ayuda?

Lee el [README completo](README.md) para más detalles o contacta: diego.huamantica@outlook.com
