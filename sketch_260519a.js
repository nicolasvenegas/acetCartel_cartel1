let particulas = [];
const TOTAL_PARTICULAS = 400; // Cantidad para rellenar bien todo el espacio
let escalaRuido = 0.003;      // Modificado levemente para un ruido más quebrado

// Variables globales para guardar los colores aleatorios de cada recarga
let colorFondo;
let paletaLineas = [];

function setup() {
  let canvas = createCanvas(1080, 1350);
  canvas.parent(document.querySelector('.contenedor-cartel'));

  // 1. SELECCIÓN DE PALETA ALEATORIA AL RECARGAR LA PÁGINA
  // Paletas rediseñadas completamente en tonos marrones, rojos, amarillos y lila
  let opcionesPaletas = [
    {
      fondo: [252, 249, 242], // Fondo marfil limpio
      lineas: [
        [140, 40, 30],   // Rojo óxido profundo
        [102, 51, 153],  // Lila / Violeta intenso
        [220, 160, 10],  // Amarillo ocre cálido
        [90, 55, 40]     // Marrón tierra oscuro
      ]
    },
    {
      fondo: [242, 238, 245], // Fondo lila muy pálido editorial
      lineas: [
        [185, 20, 50],   // Rojo carmín vivo
        [75, 30, 95],    // Lila oscuro / Berenjena
        [240, 190, 20],  // Amarillo oro saturado
        [120, 80, 65]    // Marrón café
      ]
    },
    {
      fondo: [248, 245, 235], // Fondo crema cálido
      lineas: [
        [210, 45, 0],    // Rojo terracota encendido
        [130, 80, 150],  // Lila medio elegante
        [255, 210, 40],  // Amarillo vibrante
        [70, 40, 30]     // Marrón chocolate profundo
      ]
    }
  ];

  // Elegimos una de las tres paletas al azar en cada recarga
  let paletaElegida = random(opcionesPaletas);
  colorFondo = paletaElegida.fondo;
  paletaLineas = paletaElegida.lines ? paletaElegida.lines : paletaElegida.lineas;

  // Creamos las partículas una por una
  for (let i = 0; i < TOTAL_PARTICULAS; i++) {
    particulas.push(new Particula());
  }

  // Pintamos el fondo inicial con el color elegido para esta sesión
  background(colorFondo[0], colorFondo[1], colorFondo[2]);
}

function draw() {
  // El rastro sutil ahora usa las variables dinámicas del fondo elegido
  background(colorFondo[0], colorFondo[1], colorFondo[2], 4); 

  // Movemos y dibujamos cada partícula de la lista
  for (let p of particulas) {
    p.aplicarRuido();
    p.actualizar();
    p.mostrar();
    p.envolver();
  }
}

// Clase básica de Partícula basada en Vectores (Nature of Code)
class Particula {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.posPrevia = this.pos.copy();
    
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxVel = 3; // Subido levemente de 2 a 3 para acentuar los cambios de dirección
    
    // Cada partícula guarda un grosor aleatorio individual para romper la monotonía
    this.grosor = random(1.0, 3.5); 

    // Cada partícula elige al azar uno de los colores de la paleta seleccionada
    this.colorBase = random(paletaLineas);
  }

  actualizar() {
    this.posPrevia.set(this.pos); 
    
    this.vel.add(this.acc);       
    this.vel.limit(this.maxVel);   
    this.pos.add(this.vel);       
    
    this.acc.mult(0);             
  }

  aplicarFuerza(fuerza) {
    this.acc.add(fuerza);
  }

  // Ruido modificado para generar quiebres angulosos y tramos más rectos/accidentados
  aplicarRuido() {
    // Al multiplicar el ángulo por una constante mayor (6.5) rompemos la fluidez circular
    // y forzamos al Perlin Noise a generar saltos de dirección bruscos y esquinas marcadas
    let angulo = noise(this.pos.x * escalaRuido, this.pos.y * escalaRuido) * TWO_PI * 6.5;
    
    let fuerzaRuido = p5.Vector.fromAngle(angulo);
    fuerzaRuido.setMag(0.25); // Más potencia de empuje para que el cambio de dirección sea inmediato
    
    this.aplicarFuerza(fuerzaRuido);
  }

  envolver() {
    if (this.pos.x < 0) { this.pos.x = width; this.posPrevia.x = width; }
    if (this.pos.x > width) { this.pos.x = 0; this.posPrevia.x = 0; }
    if (this.pos.y < 0) { this.pos.y = height; this.posPrevia.y = height; }
    if (this.pos.y > height) { this.pos.y = 0; this.posPrevia.y = 0; }
  }

  mostrar() {
    // Aplicamos el color de la paleta con un 180 de opacidad para lograr tramas ricas
    stroke(this.colorBase[0], this.colorBase[1], this.colorBase[2], 180); 
    strokeWeight(this.grosor); // Usa el grosor variable asignado en su nacimiento             
    
    line(this.posPrevia.x, this.posPrevia.y, this.pos.x, this.pos.y);
  }
}

// Función que ejecuta el botón HTML al hacer clic
function procesarDescarga() {
  // 1. Creamos el canvas temporal oculto de 1080x1350
  let canvasFinal = document.createElement('canvas');
  canvasFinal.width = 1080;
  canvasFinal.height = 1350;
  let ctx = canvasFinal.getContext('2d');

  // 2. Copiamos el fondo animado actual de p5.js
  let canvasP5 = document.querySelector('canvas');
  ctx.drawImage(canvasP5, 0, 0);

  // 3. Obtenemos el SVG vectorial nítido del HTML
  let imgSVG = document.querySelector('.mascara-vectorial');

  // 4. Dibujamos el SVG encima en su tamaño nativo completo
  ctx.drawImage(imgSVG, 0, 0, 1080, 1350);

  // 5. Forzamos la descarga del PNG en alta definición
  let enlace = document.createElement('a');
  enlace.download = 'cartel_26mayo2026.png';
  enlace.href = canvasFinal.toDataURL('image/png');
  enlace.click();
}

// Mantenemos la tecla 'S' llamando a la misma función para tener ambos métodos
function keyPressed() {
  if (key === 's' || key === 'S') {
    procesarDescarga();
  }
}
