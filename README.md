## Características Técnicas
* **Formato de Lienzo:** 1080x1350 píxeles (Proporción vertical 4:5).
* **Renderizado de Máscara Vectorial:** Integración de SVG nativo de Affinity Designer superpuesto mediante HTML/CSS (`mix-blend-mode: multiply`) para asegurar tipografía vectorial 100% nítida en pantalla [1].
* **Diseño Responsivo:** Adaptación fluida mediante Media Queries de CSS. El cartel se escala de manera fija a `0.45` en computadores de escritorio y ocupa de forma automática el `90%` del ancho centrado en dispositivos móviles.
* **Paleta Cromática Dinámica:** Algoritmo que selecciona combinaciones de alta saturación y contraste (tonos marrones, rojos, amarillos y lilas) de forma aleatoria en cada recarga de página.
* **Exportación de Alta Definición:** Botón de descarga centrado en la base del navegador que extrae la matriz nativa de píxeles a resolución completa (1080x1350), evitando el engrosamiento de líneas o pixelado al exportar desde celulares.

## Estructura del Proyecto
```text
├── index.html               # Estructura del documento y diseño responsivo CSS
├── sketch_260519a.js        # Lógica de partículas, vectores y Perlin Noise en p5.js
└── data/
    └── mask.svg             # Máscara tipográfica y logotipos vectoriales
```

## Requisitos de Ejecución
Para visualizar el proyecto correctamente y evitar bloqueos de seguridad del navegador (CORS) con el archivo SVG local, se debe ejecutar el archivo `index.html` utilizando un servidor local (como *Live Server* en VS Code o similar).
