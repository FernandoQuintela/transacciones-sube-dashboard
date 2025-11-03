# 🚌 Dashboard de Transacciones SUBE

Visualización interactiva de datos públicos del sistema SUBE, desarrollada como proyecto **Full Stack**.  
El dashboard muestra patrones de movilidad urbana y nacional a partir de más de **400.000 registros reales** procesados desde hojas Excel del portal de datos abiertos del Gobierno Argentino.

---

## 📖 Descripción general

**Dashboard de Transacciones SUBE** es una aplicación full stack que analiza y presenta la información del transporte público argentino a través de un entorno moderno y fluido.  
Permite explorar estadísticas por línea de subte, tipo de transporte y nivel nacional, todo con visualizaciones dinámicas y adaptadas a modo **dark/light**.

Este proyecto fue desarrollado por **Fernando Quintela** como parte de su portfolio profesional en **desarrollo Full Stack y QA técnico**, con foco en integraciones reales, visualización de datos y despliegue completo.

---

## 🧠 Storytelling (Qué, Cómo y Por Qué)

**Qué:**  
Construir un dashboard real, basado en datos públicos, que muestre mi capacidad para desarrollar un producto completo —desde la ingesta de datos y backend hasta el frontend interactivo.

**Cómo:**  
Partiendo de un dataset Excel con 400.000+ filas de transacciones SUBE, procesadas mediante Node.js, Express y librerías de parsing.  
Los datos se normalizan, exponen en endpoints API REST, y se visualizan con React + Recharts en un entorno responsive, con modo oscuro, animaciones suaves y una UI orientada a la experiencia.

**Por qué:**  
Porque quería demostrar una **visión integral de producto**, no solo código aislado: arquitectura, diseño, usabilidad y despliegue.  
Y también, crear algo útil y estéticamente coherente que cualquier persona pueda entender de un vistazo.

---

## 🧩 Tecnologías principales

**Frontend:**
- React + Vite
- Recharts
- Context API (modo oscuro/claro)
- CSS responsive y animaciones suaves
- Fetch API con variables de entorno
- Vercel (hosting del frontend)

**Backend:**
- Node.js + Express
- XLSX (lectura y normalización de datos)
- CORS / JSON endpoints REST
- Railway o Render (hosting del backend)

**Datos:**
- Dataset público SUBE (Ministerio de Transporte / datos.gob.ar)

---

## ⚙️ Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/ferquintela/transacciones-sube-dashboard.git
cd transacciones-sube-dashboard

# Instalar dependencias en backend
cd backend
npm install

# Instalar dependencias en frontend
cd ../frontend
npm install
```

---

**Variables de entorno**

Crear un archivo .env en el frontend con tu IP o dominio del backend:

```bash
VITE_API_URL=http://localhost:4000
```

**Correr el backend**

```bash
cd backend
npm run dev
```

**Correr el frontend**

```bash
cd frontend
npm run dev
```

---

**El sitio quedará disponible en:**

```bash
http://localhost:5173
```

---

## 🧭 Estructura del proyecto

```bash
transacciones-sube-dashboard/
│
├── backend/
│   ├── data/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── assets/
│   ├── index.css
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 📊 Visualizaciones incluidas

- Pasajeros por mes (gráfico de línea)

- Ranking de líneas por uso (gráfico de barras)

- Participación por línea (gráfico circular)

- Estadísticas nacionales (panel KPI dinámico)

Cada gráfico reacciona al modo de tema, y las animaciones se activan al entrar en pantalla.

---

## 🌐 Enlaces

📂 Dataset original: Datos abiertos de SUBE (Gobierno Argentino)

```bash
https://datos.transporte.gob.ar/dataset/sube-cantidad-de-transacciones-usos-por-fecha
```

---

## 💼 Autor: Fernando Quintela

🧾 CV: cv-es.pdf
🧾 cv-en.pdf

---

## 🚀 Versión online (deploy): [pendiente de publicar]

---

## 📜 Licencia

Uso libre con fines educativos y demostrativos.
Fuente de datos: dominio público (Gobierno de Argentina).

---

## 🎯 Objetivo final

Mostrar la integración completa entre backend, frontend, visualización y despliegue, en un entorno visualmente atractivo, limpio y profesional.
Un dashboard real, accesible y mantenible —hecho desde cero.