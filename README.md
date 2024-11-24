# Discover Birdly 🐦

**Discover Birdly** es una aplicación que conecta a los usuarios con el mundo de las aves y sus ecosistemas. Proporciona herramientas para identificar aves, explorar información sobre hábitats, y promover el conocimiento y la conservación de la biodiversidad.

---

## 🚀 **Propósito del Proyecto**

Facilitar la interacción de los usuarios con información sobre aves y biodiversidad, mediante una API que permite:  
- Identificar aves por audio.
- Gestionar usuarios y sus listas de favoritos.
- Consultar hotspots y departamentos.
- Promover la conservación y el aprendizaje sobre la biodiversidad.

---

## 🛠️ **Características**

- **Gestión de Usuarios:** Crea, consulta, actualiza y elimina usuarios.
- **Autenticación:** Inicio de sesión y recuperación de contraseñas.
- **Información de Aves:** Consulta detalles y distribuciones.
- **Hotspots:** Encuentra puntos ideales para observar aves.
- **Geolocalización:** Datos de departamentos y municipios.

---

## 📁 **Estructura de Endpoints**

### **Autenticación (`/auth`)**
| Método | Endpoint                   | Descripción                                  |
|--------|----------------------------|----------------------------------------------|
| POST   | `/auth/login`              | Inicia sesión con las credenciales.          |
| POST   | `/auth/register`           | Registra un nuevo usuario.                  |
| POST   | `/auth/sendResetEmail/:email` | Envía un correo para restablecer contraseña.|
| POST   | `/auth/resetPassword/:token` | Restablece la contraseña con un token.      |

### **Gestión de Usuarios (`/api/user`)**
| Método | Endpoint                          | Descripción                                 |
|--------|-----------------------------------|---------------------------------------------|
| POST   | `/api/user`                       | Crea un nuevo usuario.                     |
| GET    | `/api/user/:username`             | Obtiene los datos de un usuario.           |
| GET    | `/api/user`                       | Lista todos los usuarios registrados.      |
| PUT    | `/api/user/:username`             | Actualiza la información de un usuario.    |
| DELETE | `/api/user/:username`             | Elimina un usuario específico.             |
| PUT    | `/api/userchange/:username`       | Cambia el nombre de usuario.               |
| POST   | `/api/user/favorite/:username`    | Agrega un ave a favoritos de un usuario.   |
| DELETE | `/api/user/favorite/:username`    | Elimina un ave de favoritos de un usuario. |
| GET    | `/api/user/favorite/:username`    | Obtiene la lista de favoritos de un usuario.|

### **Gestión de Aves (`/api/bird`)**
| Método | Endpoint                           | Descripción                                |
|--------|------------------------------------|--------------------------------------------|
| GET    | `/api/bird`                        | Lista todas las aves.                     |
| GET    | `/api/bird/:searchValue`           | Busca aves por nombre o característica.   |
| GET    | `/api/countBirdByMunicipality`     | Cuenta aves por municipio.                |
| POST   | `/api/bird/detectByAudio`          | Identifica aves mediante un archivo de audio.|

### **Gestión de Hotspots (`/api/hostpot`)**
| Método | Endpoint       | Descripción                              |
|--------|----------------|------------------------------------------|
| GET    | `/api/hostpot` | Lista hotspots disponibles.             |

### **Información Geográfica (`/info/department`)**
| Método | Endpoint           | Descripción                          |
|--------|--------------------|--------------------------------------|
| GET    | `/info/department` | Obtiene datos sobre los departamentos.|

---

## 🧑‍💻 **Requisitos**

1. **Node.js** v16+  
2. **Dependencias del proyecto:** Instálalas con:  
   ```bash
   npm install