# 🎟️ Rifa Solidaria: Viaje a Fátima de Lulú

Aplicación web moderna y optimizada para móviles para gestionar una rifa de **100 números (del 00 al 99)** con bloqueo de papeletas en tiempo real y pasarela de reserva directa por **WhatsApp y Bizum**.

---

## 🌟 Características Principales

1. **Tablero del 00 al 99**:
   - Visualización clara del estado de cada papeleta: **Libre (Verde)**, **Reservado (Naranja / Esperando Bizum)** y **Pagado (Gris / Confirmado)**.
   - Búsqueda rápida por número para encontrar papeletas al instante.
   - Filtros rápidos por estado y barra de progreso de recaudación.

2. **Pasarela de WhatsApp & Bizum**:
   - Al seleccionar un número libre, se abre la ventana de reserva.
   - Muestra el importe (**3,00 €**), el número para Bizum (**662357153**) y el concepto sugerido con botones de un solo clic para copiar al portapapeles.
   - Al pulsar **"Bloquear Número y Enviar WhatsApp"**:
     - El número se bloquea en la base de datos para que nadie más lo elija.
     - Abre WhatsApp directamente hacia el teléfono del organizador con un mensaje completo pre-redactado (Nombre, Teléfono, Número y Concepto).
     - ¡Efecto de confeti y confirmación en pantalla!

3. **Panel de Administración con PIN**:
   - Acceso privado protegido con contraseña de administrador.
   - Permite al organizador:
     - Marcar números como **Pagados** cuando reciba el Bizum.
     - **Liberar números** si un comprador se echa atrás o no paga.
     - Asignar números manualmente (para amigos/familiares que paguen en efectivo).
     - Botón directo para contactar a cada comprador por WhatsApp.
     - **Descargar listado completo en Excel (CSV)**.

4. **Comprobador de Sorteo de la ONCE**:
   - Introduce el número premiado del cupón de la ONCE y el sistema detecta automáticamente las 2 últimas cifras y muestra el ganador.

5. **Modo Híbrido (Supabase + LocalStorage)**:
   - Funciona de inmediato sin configuración previa (modo local).
   - Conexión lista para **Supabase** para sincronización en tiempo real entre múltiples dispositivos.

---

## 🚀 Puesta en Marcha Local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Configuración de Supabase (Base de datos en tiempo real)

Para que cuando una persona reserve un número desde su móvil, a todas las demás personas se les bloquee en directo:

1. Entra en [Supabase](https://supabase.com) y crea una cuenta gratuita.
2. Crea un **Nuevo Proyecto** (ej: `rifa-lulu`).
3. Ve a la pestaña **SQL Editor** en el menú lateral izquierdo.
4. Pulsa en **New query**, copia y pega todo el contenido del archivo [`supabase_schema.sql`](./supabase_schema.sql) y dale al botón verde **Run**.
   - Esto creará la tabla `raffle_tickets`, los 100 números (00-99), los permisos de acceso y activará el Realtime.
5. Ve a **Project Settings** (icono de engranaje) $\rightarrow$ **API**:
   - Copia la **Project URL**.
   - Copia la **Project API Key (`anon` / `public`)**.
6. Pega estas claves en tu archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
NEXT_PUBLIC_ADMIN_PIN=tu_contraseña_aqui
```

---

## ☁️ Despliegue en Vercel

1. Sube este proyecto a tu repositorio de GitHub o impórtalo directamente desde la interfaz de Vercel.
2. En [Vercel](https://vercel.com):
   - Pulsa **Add New** $\rightarrow$ **Project**.
   - Selecciona el repositorio de la rifa.
3. En la sección **Environment Variables**, añade las mismas variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PIN` (puedes poner el PIN que tú quieras)
4. Haz clic en **Deploy**.
5. ¡Listo! Vercel te dará un enlace (ej: `https://rifa-lulu.vercel.app`) listo para compartir por WhatsApp.
