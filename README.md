# 📊 Sistema de Gestión de Nóminas - Documentación

## 🎯 Descripción General

Sistema web estático moderno y completo para la gestión de nóminas con login, gestión de empleados, calculadora de descuentos y exportación a Excel.

## 📋 Características

### ✨ Interfaz Moderna
- Diseño glassmorphism con colores gradientes
- Animaciones suaves y efectos visuales atractivos
- Iconos profesionales con Font Awesome
- Responsive y adaptable a todos los dispositivos
- Tema oscuro profesional

### 🔐 Sistema de Login
- **Usuario**: `ximena`
- **Contraseña**: `123`
- Validación en cliente
- Sesión persistente con sessionStorage
- Animaciones de transición

### 👥 Gestión de Empleados
- Tabla completa con información de 6 empleados
- Visualización de:
  - Cédula
  - Nombre
  - Puesto
  - Salario Base
- Modal con detalles completos incluyendo descuentos

### 🧮 Calculadora de Nómina
- Cálculo automático de descuentos por ley
- Descuentos incluidos:
  - **Seguro Social**: 10.5%
  - **Impuesto Renta**: 8%
  - **Otros Descuentos**: 2%
  - **Total**: 20.5%

### 📊 Dashboard
- Estadísticas en tiempo real:
  - Total de empleados
  - Nómina total mensual
  - Total de descuentos
  - Neto a pagar
- Cards animadas con hover effects

### 📥 Exportación a Excel
- Exportación completa en formato .xlsx
- 3 hojas incluidas:
  - **Resumen**: Totales consolidados
  - **Empleados**: Nómina detallada con descuentos
  - **Descuentos**: Explicación de conceptos y cálculos
- Descarga automática con nombre y fecha

## 📁 Estructura de Archivos

```
tareaXime/
├── login.html           # Página de login
├── index.html           # Dashboard principal
├── style.css            # Estilos globales con animaciones
├── login.js             # Lógica de autenticación
├── dashboard.js         # Lógica del dashboard y cálculos
└── README.md            # Este archivo
```

## 🚀 Cómo Usar

### 1. Abrir la Aplicación
1. Abre el archivo `login.html` en tu navegador
2. O simplemente abre `index.html` si ya tienes sesión activa

### 2. Login
1. Ingresa las credenciales:
   - Usuario: `ximena`
   - Contraseña: `123`
2. Hace clic en "Iniciar Sesión"

### 3. Dashboard
Una vez autenticado, tendrás acceso a 3 secciones:

#### 📈 Dashboard
- Vista general de estadísticas
- Cards interactivas con información consolidada
- Animaciones de números al cargar

#### 👥 Empleados
- Tabla con todos los empleados
- Datos actuales de 6 empleados de ejemplo
- Botón "Ver" para detalles completos
- Botón "Exportar a Excel" para descargar nómina

#### 🧮 Calculadora
- Selecciona un empleado en el dropdown
- Visualiza automáticamente:
  - Salario base
  - Descuentos detallados (Seguro Social, Impuesto Renta, Otros)
  - Total de descuentos
  - Salario neto final

## 👨‍💼 Datos de Empleados (Quemados)

| Cédula | Nombre | Puesto | Salario |
|--------|--------|--------|---------|
| 1001234567 | Carlos Rodríguez | Desarrollador Senior | $3,500,000 |
| 1002345678 | María García | Gerente de Proyecto | $4,200,000 |
| 1003456789 | Juan López | Analista | $2,800,000 |
| 1004567890 | Andrea Martínez | Diseñadora UI/UX | $3,100,000 |
| 1005678901 | Luis Sánchez | DevOps | $3,700,000 |
| 1006789012 | Sandra Torres | QA Tester | $2,500,000 |

## 💡 Ejemplos de Cálculo

### Para un salario de $3,000,000:
- **Salario Base**: $3,000,000
- **Seguro Social (10.5%)**: $315,000
- **Impuesto Renta (8%)**: $240,000
- **Otros Descuentos (2%)**: $60,000
- **Total Descuentos**: $615,000
- **Salario Neto**: $2,385,000

## 🎨 Diseño Técnico

### Colores Principales
- **Primario**: #6366f1 (Índigo)
- **Secundario**: #ec4899 (Rosa)
- **Acento**: #06b6d4 (Cian)
- **Fondo**: #0f172a (Azul muy oscuro)
- **Backgrounds cards**: #1e293b

### Animaciones
- Fade in/out
- Slide up/down
- Bounce
- Float
- Shake
- Scale y transform effects

### Responsive
- Desktop: Diseño completo
- Tablet: Menú convertido a horizontal
- Móvil: Optimizado para pantalla pequeña

## 🔒 Seguridad

⚠️ **NOTA**: Esta es una aplicación estática de demostración. En producción:
- Implementar autenticación segura en backend
- Usar HTTPS
- Validar datos en servidor
- Nunca guardar credenciales en cliente
- Implementar CSRF tokens

## 🌐 Compatible Con

- Chrome/Edge (versiones modernas)
- Firefox (versiones modernas)
- Safari (versiones modernas)
- Opera

## 📦 Dependencias Externas

- **Font Awesome 6.4.0**: CDN para iconos
- **SheetJS (XLSX.js)**: Para exportación a Excel

Ambas se cargan desde CDN, no requiere instalación.

## 🎯 Próximas Mejoras Posibles

- [ ] Integración con base de datos
- [ ] Sistema de login con autenticación real
- [ ] Edición de empleados
- [ ] Agregar/eliminar empleados
- [ ] Historial de nóminas
- [ ] Reportes avanzados
- [ ] PDF export
- [ ] Dark/Light mode toggle
- [ ] Multi-idioma
- [ ] Integración con API backend

## 👤 Autor

Aplicación de demostración de nóminas - 2026

## 📧 Contacto

Para preguntas o sugerencias, contacta al equipo de desarrollo.

---

**¡Disfruta del aplicativo! 🎉**
