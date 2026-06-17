// Asegúrate de incluir la librería dscc en tu entorno de despliegue local o vía tag si aplica
const dscc = require('@google/dscc');

// Función principal de renderizado
function drawVisualization(data) {
  // Limpiar el body para evitar duplicaciones en re-renders
  document.body.innerHTML = '';

  // 1. Extracción y validación de Datos
  const metricData = data.tables.DEFAULT;
  if (!metricData || metricData.length === 0) {
    showError("No hay datos disponibles.");
    return;
  }

  // Obtener el valor de la métrica formateada
  const row = metricData[0];
  const metricValue = row['metric'][0]; 
  
  // Obtener título dinámico si se define, si no usar el de la imagen por defecto
  const titleText = row['title'] ? row['title'][0] : "Matrículas encontradas";
  const subtitleText = "Total registros";

  // 2. Extracción de estilos configurables
  let iconName = "corporate_fare"; // Valor por defecto
  if (data.style && data.style.icon_name && data.style.icon_name.value) {
    iconName = data.style.icon_name.value;
  }

  // 3. Construcción del DOM (Estructura de la Tarjeta)
  const card = document.createElement('div');
  card.className = 'kpi-card';

  // Contenedor del Icono
  const iconContainer = document.createElement('div');
  iconContainer.className = 'icon-container';
  
  const icon = document.createElement('span');
  icon.className = 'material-icons-outlined';
  icon.textContent = iconName;
  
  iconContainer.appendChild(icon);

  // Contenedor de Textos
  const contentContainer = document.createElement('div');
  contentContainer.className = 'content-container';

  const title = document.createElement('h3');
  title.className = 'title-text';
  title.textContent = titleText;

  const value = document.createElement('div');
  value.className = 'value-text';
  value.textContent = formatNumber(metricValue);

  const subtitle = document.createElement('span');
  subtitle.className = 'subtitle-text';
  subtitle.textContent = subtitleText;

  contentContainer.appendChild(title);
  contentContainer.appendChild(value);
  contentContainer.appendChild(subtitle);

  // Ensamble final
  card.appendChild(iconContainer);
  card.appendChild(contentContainer);
  document.body.appendChild(card);
}

// Función auxiliar para formatear con separador de miles de acuerdo al estándar de la imagen
function formatNumber(value) {
  if (isNaN(value)) return value;
  return Number(value).toLocaleString('es-ES'); 
}

// Mensaje de error controlado en producción
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.color = '#red';
  errorDiv.style.fontFamily = 'sans-serif';
  errorDiv.style.padding = '10px';
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
}

// Suscribirse a las actualizaciones de datos de Looker Studio
dscc.subscribeToData(drawVisualization, { transform: dscc.objectTransform });