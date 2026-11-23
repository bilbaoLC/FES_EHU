# Vibraciones atómicas en cadenas unidimensionales

## Objetivo del proyecto

Desarrollar una **aplicación web educativa, interactiva y rigurosa desde el punto de vista físico**, destinada a la enseñanza de Física del Estado Sólido. Permitirá estudiar las relaciones de dispersión y visualizar en tiempo real los desplazamientos longitudinales de los átomos en:

1. Una **cadena monoatómica unidimensional** de masa `m`, constante elástica `K` y parámetro de red `a`.
2. Una **cadena diatómica unidimensional de masas iguales** `m`, con constantes elásticas alternas **`K` y `G`** y parámetro de red `a`. Las posiciones atómicas en la celda de longitud `a` son 0 y `a/3`.

**Importante:** la cadena diatómica no tiene masas diferentes. La base contiene dos átomos idénticos; la diferencia es la alternancia de las constantes elásticas.

El objetivo es **consultar la aplicación directamente en una página web**, no crear un programa para descargar. Debe desarrollarse localmente en VS Code y después poder publicarse mediante **GitHub Pages**.

## Tecnología y ejecución

- Usar **HTML5, CSS3 y JavaScript moderno**, preferiblemente sin frameworks ni dependencias pesadas. La visualización de gráficas y cadenas puede hacerse con **SVG y/o Canvas**, procurando que se vea nítida al proyectar en clase.
- Implementar una **web estática**: sin backend, base de datos, credenciales, Python ni servicios externos para que funcione.
- La aplicación debe funcionar al abrirla a través de un servidor local de desarrollo (por ejemplo, VS Code Live Server o `python3 -m http.server`) y estar lista para GitHub Pages.
- Usar **rutas relativas** para recursos, de modo que funcione en una URL del tipo `https://usuario.github.io/nombre-del-repositorio/`.
- Diseño adaptable a ordenador, tablet y móvil, priorizando **proyección en pantalla grande y uso con ratón**.
- Mostrar textos y controles en **español**. Escribir las fórmulas mediante MathJax/KaTeX solo si se justifica; preferir una solución estática compatible con GitHub Pages y, si se necesita una librería externa de fórmulas, documentar su dependencia.
- No confundir este archivo de especificaciones con una aplicación terminada: **Codex debe implementar el código, probarlo y dejar instrucciones de publicación**.

## Diseño de la página

Aplicación de una sola página, con estética clara, ordenada y profesional, preferentemente fondo claro, elementos azules y buen contraste.

### Cabecera

Título: **Vibraciones atómicas en cadenas unidimensionales**.

Subtítulo: **Relaciones de dispersión y modos normales de vibración**.

Debajo: dos pestañas principales:
- **Cadena monoatómica**
- **Cadena diatómica (masas iguales; K y G)**

### Distribución en escritorio

**Columna izquierda (aprox. 35 %):**
1. Esquema estático de la cadena, con etiquetas `m`, `K` y, en la diatómica, `G`.
2. **Celdas primitivas señaladas** mediante recuadros verticales sutiles o franjas de fondo alternadas; flecha que indique la longitud `a`.
3. Fórmula de la relación de dispersión correspondiente y límites de la primera zona de Brillouin.
4. Controles: `k`, amplitud, velocidad y reproducción; para la diatómica, además, relación `G/K` y elección de rama.

**Columna derecha (aprox. 65 %):**
1. Gráfica amplia, clara e interactiva de **frecuencia angular `ω` frente a vector de onda `k`**.
2. Marcador muy visible sobre el punto seleccionado, sincronizado con el control de `k`; permitir también seleccionar `k` haciendo clic o arrastrando en la gráfica. En la cadena diatómica, permitir seleccionar la rama acústica u óptica.
3. Panel con los valores del modo (`k`, `ω`, rama y, cuando tenga sentido, velocidad de grupo).
4. Animación de los **desplazamientos longitudinales de los átomos**, con posiciones de equilibrio señaladas, y **celdas primitivas claramente visibles**.
5. Un breve panel didáctico que explique el modo seleccionado, especialmente para `k = 0` y en el borde de la primera zona de Brillouin.

En pantallas estrechas, apilar las secciones en un orden lógico sin perder controles o gráficas.

## Convenciones físicas y notación (obligatorias)

- `n` es el índice entero de la celda primitiva.
- `a` representa **siempre la longitud de la celda primitiva** (parámetro de red).
- `k` es el número de onda y `ω` la frecuencia angular (no confundir con frecuencia ordinaria `f`).
- `m` es la masa de todos los átomos.
- `K` es una constante elástica positiva.
- `G` es la segunda constante elástica positiva que alterna con `K` en la cadena diatómica.
- Considerar **vibraciones longitudinales**, aproximación armónica e interacción **solo con los primeros vecinos**.
- No incluir fuerzas disipativas, condiciones de contorno complejas ni modos transversales.
- Primera zona de Brillouin de ambos modelos: **`−π/a ≤ k ≤ π/a`**.
- Pueden visualizarse cadenas finitas suficientemente largas para representar modos de la cadena infinita; no obligar a que cada `k` seleccionado sea un modo discreto de una cadena finita.

### 1. Cadena monoatómica

Cada celda primitiva contiene **un átomo** de masa `m`; los átomos están separados por `a`, con enlaces de constante `K`.

**Relación de dispersión exacta:**

\[
\boxed{\omega(k)=2\sqrt{\frac{K}{m}}\left|\sin\left(\frac{ka}{2}\right)\right|}
\]

**Desplazamiento complejo del átomo de la celda `n`:**

\[
\boxed{u(na,t)=\varepsilon e^{i(kna-\omega t)}}
\]

La posición que se dibuja debe utilizar **la parte real**, no un número complejo:

\[
x_n(t)=na+\operatorname{Re}\!\left[\varepsilon e^{i(kna-\omega t)}\right].
\]

Para una amplitud `ε` real y positiva, esto equivale a `x_n(t) = na + ε cos(kna − ωt)`. Mostrar la expresión compleja anterior tal como está definida, y aclarar discretamente que la animación representa su parte real.

**Casos didácticos:**
- `k = 0`: `ω = 0`; corresponde a una traslación rígida, no a una oscilación en el tiempo. Debe verse correctamente en la animación.
- `k = ±π/a`: átomos vecinos con desplazamientos de signo alternante; pendiente de la rama y velocidad de grupo nulas en el borde.

### 2. Cadena diatómica con masas iguales y constantes alternas

La **celda primitiva tiene longitud `a` y contiene dos átomos idénticos de masa `m`**:
- átomo `A_n` en equilibrio en `x = na`;
- átomo `B_n` en equilibrio en `x = na + a/2`.

Alternar las constantes de enlace así:

`... —G— A_n —K— B_n —G— A_(n+1) —K— B_(n+1) —G— ...`

Dibujar el patrón alternante `K, G, K, G` y delimitar visualmente las celdas `[na, (n+1)a)`; cada celda contiene un átomo `A` y un átomo `B`. Usar colores o contornos que distingan los **sitios A/B sin sugerir que sus masas sean diferentes**.

**Relación de dispersión exacta, en la forma con coseno exigida (NO sustituirla en la interfaz por la forma con seno):**

\[
\boxed{\omega_{\pm}^{2}(k)=\frac{K+G}{m}\pm\frac{1}{m}\sqrt{K^{2}+G^{2}+2KG\cos(ka)}}
\]

- `ω₋(k)`: **rama acústica**.
- `ω₊(k)`: **rama óptica**.

Para calcular y graficar las frecuencias, tomar la **raíz cuadrada no negativa** de `ω²`. Por estabilidad numérica, limitar a cero diminutos valores negativos que aparezcan por errores de redondeo.

**Dependencia temporal y espacial de los desplazamientos de los dos átomos:**

\[
\boxed{u_1(na,t)=\varepsilon_1e^{i(kna-\omega t)}}
\]

\[
\boxed{u_2(na,t)=\varepsilon_2e^{i(kna-\omega t)}}
\]

Estas expresiones usan la **misma fase de Bloch referida al origen de la celda**; la posición de equilibrio de `B_n` sigue siendo `na+a/2`. Las amplitudes complejas `ε₁` y `ε₂` **no se eligen arbitrariamente**: forman el autovector del modo normal seleccionado.

**Matriz dinámica para la convención elegida:**

\[
 m\omega^2
 \begin{pmatrix}\varepsilon_1\\\varepsilon_2\end{pmatrix}
 =
 \begin{pmatrix}
 K+G & -(K+Ge^{-ika})\\
 -(K+Ge^{ika}) & K+G
 \end{pmatrix}
 \begin{pmatrix}\varepsilon_1\\\varepsilon_2\end{pmatrix}.
\]

Usar los **autovectores propios correctos** de esta matriz para calcular los movimientos relativos de los átomos. Esto incluye el **desfase complejo** entre los subretículos para valores generales de `k`; **no imponer simplemente movimientos en fase/contrafase en todo el intervalo**. La animación muestra las partes reales de los desplazamientos complejos, correctamente normalizados a una amplitud visual común. Manejar de manera estable los casos degenerados (en particular, `K = G` y `k = ±π/a`), sin valores `NaN` ni saltos espurios de fase al mover sliders.

**Casos didácticos:**
- `k = 0`, rama acústica: traslación rígida (`ω = 0`).
- `k = 0`, rama óptica: dos átomos de la celda vibrando en oposición de fase.
- `k = ±π/a`: comportamiento en el borde de la zona de Brillouin y apertura de la brecha entre ramas si `K ≠ G`.
- `K = G`: se cierra la separación entre ramas en el borde de la zona reducida; explicar el **plegamiento de bandas** de la cadena monoatómica equivalente, con distancia real entre vecinos `a/2`.

## Controles interactivos

**En ambos modelos:**

1. **Slider de `k`** en el rango `−π/a` a `+π/a`, con valores extremos y `0` destacados. Mostrar también un valor numérico, preferiblemente `ka/π` (por ejemplo, `k = 0,60π/a`). Ajustar el punto sobre la curva y el modo animado inmediatamente.
2. **Control de amplitud** de desplazamiento **visual**, relativa a `a`; utilizar amplitudes moderadas para que las esferas no se superpongan ni se interpreten como deformaciones enormes.
3. **Control de velocidad de reproducción** (factor temporal visual), que no debe cambiar los valores físicos de la relación de dispersión.
4. **Reproducir/pausar** y **reiniciar fase temporal**.
5. **Mostrar/ocultar posiciones de equilibrio** y **mostrar/ocultar celdas primitivas**; ambos activados inicialmente.
6. Idealmente, botón o selector para acceder directamente a `k=0` y `k=±π/a`.

**Solo en la cadena diatómica:**

7. **Selector de rama:** acústica / óptica, con ambas siempre dibujadas en la gráfica y la seleccionada destacada.
8. **Slider de relación `G/K`** con `K > 0` fijo como referencia (por ejemplo, de `0,1` a `2,0`, con `1` marcado y valor numérico). Actualizar curvas, frecuencias, autovectores y animación en tiempo real.

Para evitar unidades arbitrarias, fijar por defecto `a=1`, `m=1`, `K=1` **solo como unidades de referencia internas**. Representar por defecto los ejes en términos adimensionales:
- eje horizontal: `ka/π` (de `−1` a `+1`);
- eje vertical: `ω / √(K/m)`.

En el modelo monoatómico puede utilizarse la **misma normalización vertical** para mantener la coherencia entre pestañas. Etiquetar claramente todos los ejes y no mezclar normalizaciones en distintos paneles. Mostrar la fórmula física general con `a`, `m`, `K` y `G`.

## Requisitos de las gráficas

- Graficar la relación de dispersión **calculada**, no una curva dibujada a mano ni un conjunto de datos aproximados.
- En el modelo diatómico, dos ramas continuas y con leyenda (acústica y óptica); cuando `G = K`, deben tocarse exactamente en el borde de zona.
- Marcador de color contrastado en el modo elegido y guía visual hasta su valor de `k`.
- El marcador debe sincronizarse con los controles y el clic sobre la gráfica.
- Escalas correctas y etiquetas legibles incluso durante una proyección.
- Actualizar con suavidad, sin recrear innecesariamente toda la interfaz.

## Requisitos de la animación

- Dibujar al menos **12–20 átomos** en la vista de escritorio y adaptar su número al espacio disponible en pantallas pequeñas.
- Incluir una **referencia a las posiciones de equilibrio** (puntos o círculos fantasma y líneas guía discretas).
- Dibujar los **límites de varias celdas primitivas** e indicar claramente `a`, de forma correcta para cada modelo. En la diatómica, dos átomos por celda; en la monoatómica, uno.
- Los desplazamientos se representan **horizontalmente**, nunca como oscilaciones verticales.
- Si aparecen flechas de desplazamiento, que su sentido y magnitud correspondan al **desplazamiento instantáneo real** respecto del equilibrio.
- Emplear `requestAnimationFrame` o equivalente, con integración temporal basada en tiempo transcurrido (no en número de fotogramas), para una animación fluida.
- `Pausar` debe congelar el estado temporal y `Reiniciar` debe restablecer la fase a `t=0`.
- Si se modifica `k`, `G/K` o la rama, el desplazamiento debe recalcularse inmediatamente sin perder la estabilidad numérica.
- El propósito es mostrar los **modos normales físicamente correctos**, no un efecto animado decorativo.

## Panel explicativo

Mostrar la fórmula de los desplazamientos al lado o debajo de la animación, usando `u(na,t)` en la cadena monoatómica y `u₁(na,t)`, `u₂(na,t)` en la diatómica. Explicar en una línea que la animación representa la parte real.

El panel debe incluir, según el modelo:
- valor seleccionado de `k`;
- frecuencia `ω` normalizada;
- rama seleccionada en la diatómica;
- relación `G/K`;
- información contextual breve y precisa sobre el modo normal;
- opcionalmente, velocidad de grupo `v_g = dω/dk`, calculada con cuidado: en el punto de traslación `k=0` y otros puntos con singularidades/degeneraciones, no mostrar una derivada matemática engañosa; distinguir derivadas laterales si es necesario.

**No mostrar fórmulas de longitud de onda, velocidad de fase ni velocidad de grupo si no están calculadas con la convención y las condiciones físicas correctas.**

## Calidad, accesibilidad y pruebas

- Interfaz sin errores de consola y sin dependencias de servidores externos para la lógica física.
- Sliders accesibles mediante teclado, botones con etiquetas claras y buen contraste.
- Respetar `prefers-reduced-motion` cuando sea posible, con animación pausada inicialmente si está activado.
- Validar numéricamente las frecuencias frente a las fórmulas analíticas.
- **Probar expresamente** ambos modelos en `k=0`, `k=±π/a`, `G/K=1` y valores intermedios.
- Verificar en el modelo diatómico que los desplazamientos satisfacen las ecuaciones de movimiento para varios valores de `k` y relaciones `G/K`, no solo en puntos de alta simetría.
- Verificar que la definición de celda primitiva coincide con las distancias representadas y con el intervalo de Brillouin.
- Comprobar comportamiento en Firefox y Chrome/Chromium.
- No incluir botones o controles que no funcionen.

## Estructura de archivos sugerida

```text
vibraciones-1d/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── physics.js        # Dispersiones y autovectores
│   ├── plots.js          # Gráficas interactivas
│   ├── animation.js      # Animación de los átomos y celdas primitivas
│   └── app.js            # Estado, controles y sincronización
└── assets/               # Solo si hace falta
```

Se permite simplificar la estructura si el resultado final es más claro y mantenible.

## Entregables y criterios de aceptación

Codex debe:

1. Crear la página funcional y todos sus archivos fuente.
2. Implementar los dos modelos usando **exactamente las relaciones de dispersión indicadas**, en especial la expresión **con `cos(ka)`** para la diatómica.
3. Implementar las animaciones con las **expresiones complejas de desplazamiento y los autovectores correctos**, mostrando las partes reales.
4. Señalar las **celdas primitivas en ambos casos**.
5. Comprobar las funciones principales y los casos límite, corregir fallos y dejar una experiencia visual cuidada.
6. Incluir instrucciones breves para ejecutar localmente y para publicar en GitHub Pages: crear un repositorio, subir los archivos, activar **Settings → Pages**, seleccionar la rama y la carpeta raíz, y consultar la URL pública. No debe requerirse que los visitantes descarguen el repositorio.

**Prioridad:** rigor físico > claridad didáctica > facilidad de uso > estética. No introducir modelos adicionales, dimensiones extra, constantes de interacción no solicitadas ni masas distintas en la cadena diatómica.

## Ejecución y publicación

Desde la raíz, ejecutar `python3 -m http.server 8000` y abrir `http://localhost:8000`. Las pruebas numéricas se ejecutan con `node tests/physics.test.mjs`.

Para publicar: crear un repositorio en GitHub, subir estos archivos y, en **Settings → Pages**, elegir la rama principal y la carpeta raíz (`/`). GitHub mostrará la URL pública; los visitantes acceden directamente desde el navegador.
