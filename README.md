# Proyecto: Manejo y Evaluación de Grupos de Empresas

# MTIS

## Descripción

Este proyecto tiene como objetivo principal proporcionar una solución integral para la **gestión** y **evaluación** de grupos empresariales. A través de una plataforma centralizada, se busca facilitar el análisis de datos financieros, operativos y de rendimiento de múltiples empresas dentro de un mismo grupo, con el fin de optimizar la toma de decisiones estratégicas.

## Funcionalidades

- **Gestión de Empresas:** Creación, edición y eliminación de empresas dentro del grupo empresarial.
- **Evaluación de Rendimiento:** Análisis de indicadores clave de desempeño (KPI) como rentabilidad, eficiencia operativa, y crecimiento.
- **Comparación entre Empresas:** Herramientas para la comparación entre empresas del grupo, incluyendo gráficos y reportes personalizados.
- **Simulación de Escenarios:** Funcionalidad para simular escenarios futuros basados en datos históricos y variables ajustables.
- **Generación de Reportes:** Creación de reportes financieros detallados para cada empresa, exportables en formato PDF o Excel.
- **Gestión de Usuarios:** Módulo de autenticación y permisos para controlar el acceso a diferentes funcionalidades según el rol del usuario.

## Tecnologías Utilizadas

- **Backend:** Node.js con Express
- **Frontend:** React.js
- **Base de Datos:** postegres
- **Autenticación:** JWT (JSON Web Tokens)
- **Pruebas:** Jest y Selenium

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/MauriNestor/BackendTIS.git
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno:

   Crea un archivo `.env` en el directorio raíz del proyecto y define las siguientes variables:

   ```
   DB_CONNECTION=mongodb://localhost:27017/nombre-db
   JWT_SECRET=tu_clave_secreta
   ```

4. Inicia el servidor:

   ```bash
   npm start
   ```

## Uso

Una vez que el servidor esté en funcionamiento, puedes acceder a la aplicación a través de `http://localhost:3000`. Asegúrate de tener una cuenta de usuario con los permisos adecuados para acceder a las funcionalidades de gestión y evaluación.

## Contribuciones

Las contribuciones a este proyecto son bienvenidas. Si deseas contribuir, por favor, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b nombre-rama`).
3. Realiza tus cambios y haz commits.
4. Envía un pull request.

## Licencia

Este proyecto está licenciado bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

# Leo mrk
