import { PI, omegaX, omegaY, frequency, displacement } from "./physics.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const state = { qx: PI / 2, qy: 0, branch: "x", amplitude: .14, speed: .8, playing: !reducedMotion, time: 0, last: performance.now(), cells: true, equilibrium: true, surfaceX: true, surfaceY: true, yaw: -.72, pitch: .55, zoom: 1 };
const surface = $("#surface"), bz = $("#brillouin"), lattice = $("#lattice");

function canvasContext(canvas) {
  const ratio = devicePixelRatio || 1, rect = canvas.getBoundingClientRect();
  if (canvas.width !== Math.round(rect.width * ratio) || canvas.height !== Math.round(rect.height * ratio)) {
    canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio);
  }
  const ctx = canvas.getContext("2d"); ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

const format = (value, digits = 2) => Math.abs(value) < 5e-7 ? "0" : value.toFixed(digits).replace(".", ",");
function piLabel(value) {
  if (Math.abs(value) < .005) return "0";
  if (Math.abs(Math.abs(value) - PI) < .005) return `${value < 0 ? "−" : ""}π`;
  return `${format(value / PI)}π`;
}

function project(qx, qy, om, width, height) {
  let x = qx / PI, y = qy / PI, z = om / 2;
  const cy = Math.cos(state.yaw), sy = Math.sin(state.yaw), cp = Math.cos(state.pitch), sp = Math.sin(state.pitch);
  const rx = x * cy - y * sy, ry = x * sy + y * cy;
  const rz = z * cp - ry * sp, depth = z * sp + ry * cp;
  const scale = Math.min(width, height) * .245 * state.zoom;
  return { x: width * .5 + rx * scale, y: height * .72 - rz * scale, depth };
}

function drawSurface() {
  const { ctx, width, height } = canvasContext(surface); ctx.clearRect(0, 0, width, height);
  const grid = 20, branches = [];
  if (state.surfaceX) branches.push({ key: "x", color: "rgba(23,104,206,.48)", line: "#1768ce" });
  if (state.surfaceY) branches.push({ key: "y", color: "rgba(239,112,66,.38)", line: "#ef7042" });
  const base = [[-PI,-PI],[PI,-PI],[PI,PI],[-PI,PI],[-PI,-PI]].map(([x,y]) => project(x,y,0,width,height));
  ctx.strokeStyle = "#8298ae"; ctx.lineWidth = 1.2; ctx.beginPath(); base.forEach((p,i) => i ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y)); ctx.stroke();
  const polygons = [];
  for (const branch of branches) for (let ix = 0; ix < grid; ix++) for (let iy = 0; iy < grid; iy++) {
    const x0 = -PI + 2 * PI * ix / grid, x1 = -PI + 2 * PI * (ix + 1) / grid, y0 = -PI + 2 * PI * iy / grid, y1 = -PI + 2 * PI * (iy + 1) / grid;
    const f = (x,y) => branch.key === "x" ? omegaX(x) : omegaY(y);
    const points = [[x0,y0],[x1,y0],[x1,y1],[x0,y1]].map(([x,y]) => project(x,y,f(x,y),width,height));
    polygons.push({ points, depth: points.reduce((s,p)=>s+p.depth,0)/4, branch });
  }
  polygons.sort((a,b)=>a.depth-b.depth).forEach(({points,branch}) => { ctx.fillStyle=branch.color;ctx.strokeStyle=branch.line;ctx.lineWidth=.38;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill();ctx.stroke(); });
  const axes = [{to:[PI,-PI,0],label:"kₓa",dx:8,dy:2},{to:[-PI,PI,0],label:"kᵧa",dx:-25,dy:10},{to:[-PI,-PI,2.25],label:"ω/√(K/m)",dx:-55,dy:-8}];
  const origin=project(-PI,-PI,0,width,height);ctx.font="12px system-ui";ctx.fillStyle="#10253e";ctx.strokeStyle="#10253e";ctx.lineWidth=1.3;
  axes.forEach(a=>{const p=project(...a.to,width,height);ctx.beginPath();ctx.moveTo(origin.x,origin.y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.fillText(a.label,p.x+a.dx,p.y+a.dy)});
  for (const branch of branches) { const om=branch.key==="x"?omegaX(state.qx):omegaY(state.qy), p=project(state.qx,state.qy,om,width,height);ctx.fillStyle=branch.line;ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,branch.key===state.branch?7:5,0,PI*2);ctx.fill();ctx.stroke(); }
}

function drawBZ() {
  const { ctx, width, height } = canvasContext(bz), pad = 45, size = Math.min(width - 2*pad, height - 2*pad), left=(width-size)/2, top=(height-size)/2;
  ctx.clearRect(0,0,width,height);ctx.fillStyle="#edf5fc";ctx.fillRect(left,top,size,size);ctx.strokeStyle="#1768ce";ctx.lineWidth=2;ctx.strokeRect(left,top,size,size);
  const map=(x,y)=>({x:left+(x+PI)/(2*PI)*size,y:top+(PI-y)/(2*PI)*size});
  ctx.strokeStyle="#c1d2e2";ctx.lineWidth=1;ctx.beginPath();let p=map(0,-PI);ctx.moveTo(p.x,p.y);p=map(0,PI);ctx.lineTo(p.x,p.y);p=map(-PI,0);ctx.moveTo(p.x,p.y);p=map(PI,0);ctx.lineTo(p.x,p.y);ctx.stroke();
  const route=[[0,0],[PI,0],[PI,PI],[0,0]].map(([x,y])=>map(x,y));ctx.setLineDash([6,5]);ctx.strokeStyle="#ef7042";ctx.lineWidth=2;ctx.beginPath();route.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.setLineDash([]);
  ctx.font="bold 12px system-ui";ctx.fillStyle="#10253e";[[0,0,"Γ"],[PI,0,"X"],[PI,PI,"M"]].forEach(([x,y,t])=>{const p=map(x,y);ctx.beginPath();ctx.arc(p.x,p.y,4,0,PI*2);ctx.fill();ctx.fillText(t,p.x+7,p.y-7)});
  const marker=map(state.qx,state.qy);ctx.fillStyle=state.branch==="x"?"#1768ce":"#ef7042";ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.beginPath();ctx.arc(marker.x,marker.y,8,0,PI*2);ctx.fill();ctx.stroke();
  ctx.font="12px system-ui";ctx.fillStyle="#61758a";ctx.textAlign="center";ctx.fillText("kₓa",left+size/2,top+size+32);ctx.save();ctx.translate(left-30,top+size/2);ctx.rotate(-PI/2);ctx.fillText("kᵧa",0,0);ctx.restore();bz._mapping={left,top,size};
}

function drawLattice() {
  const {ctx,width,height}=canvasContext(lattice), count=11, margin=36, available=Math.min(width-2*margin,height-2*margin), step=available/(count-1), ox=(width-available)/2, oy=(height-available)/2, visual=state.amplitude*step*2.1;
  ctx.clearRect(0,0,width,height);
  if(state.cells){ctx.setLineDash([3,4]);ctx.strokeStyle="#c9d7e4";ctx.lineWidth=1;for(let i=0;i<count-1;i++)for(let j=0;j<count-1;j++)ctx.strokeRect(ox+(i+.5)*step,oy+(j+.5)*step,step,step);ctx.setLineDash([]);ctx.fillStyle="rgba(23,104,206,.07)";ctx.fillRect(ox+4.5*step,oy+4.5*step,step,step);ctx.strokeStyle="#1768ce";ctx.lineWidth=2;ctx.strokeRect(ox+4.5*step,oy+4.5*step,step,step)}
  const position=(i,j)=>{const d=displacement(i-5,j-5,state.time,{...state,amplitude:visual});return{x:ox+i*step+d.x,y:oy+j*step-d.y}};
  ctx.strokeStyle="#91a8bd";ctx.lineWidth=1.2;for(let i=0;i<count;i++)for(let j=0;j<count;j++){const p=position(i,j);if(i<count-1){const q=position(i+1,j);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}if(j<count-1){const q=position(i,j+1);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}
  for(let i=0;i<count;i++)for(let j=0;j<count;j++){const eq={x:ox+i*step,y:oy+j*step},p=position(i,j);if(state.equilibrium){ctx.strokeStyle="#afbdca";ctx.lineWidth=1;ctx.beginPath();ctx.arc(eq.x,eq.y,4.2,0,PI*2);ctx.stroke()}ctx.fillStyle=state.branch==="x"?"#1768ce":"#ef7042";ctx.beginPath();ctx.arc(p.x,p.y,5.5,0,PI*2);ctx.fill()}
  const anchor={x:ox+5*step,y:oy+5*step};ctx.strokeStyle="#10253e";ctx.fillStyle="#10253e";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(anchor.x,anchor.y);ctx.lineTo(anchor.x+step,anchor.y);ctx.moveTo(anchor.x,anchor.y);ctx.lineTo(anchor.x,anchor.y-step);ctx.stroke();ctx.font="bold 11px system-ui";ctx.fillText("a₁",anchor.x+step*.65,anchor.y-5);ctx.fillText("a₂",anchor.x+5,anchor.y-step*.65);
}

function explanation() {
  const om=frequency(state.qx,state.qy,state.branch), atGamma=Math.hypot(state.qx,state.qy)<.015, atX=Math.abs(state.qx-PI)<.015&&Math.abs(state.qy)<.015, atM=Math.abs(state.qx-PI)<.015&&Math.abs(state.qy-PI)<.015;
  let title="Onda plana con polarización cartesiana",text=`Los átomos se desplazan solo en ${state.branch}, mientras la fase cambia como qₓnₓ + qᵧnᵧ. Esta polarización no es necesariamente longitudinal ni transversal respecto de k.`;
  if(atGamma){title="Traslación uniforme en Γ";text="Todas las celdas tienen la misma fase y Ω = 0: el desplazamiento permanece estático en este modo ideal."}
  else if(atX){title="Punto X del borde de zona";text=state.branch==="x"?"Las filas vecinas a lo largo de x se mueven en oposición y Ωₓ = 2.":"Ωᵧ = 0 aunque k sea no nulo: es un modo blando transversal sin rigidez en este modelo."}
  else if(atM){title="Punto M, esquina de la zona";text="Ambas polarizaciones están degeneradas con Ω = 2; el autovector cartesiano seleccionado sigue siendo válido."}
  else if(om<.005){title="Modo blando de frecuencia cero";text=`La polarización ${state.branch} no deforma los resortes alineados con ella a primer orden para este vector de onda. El desplazamiento es estático: no se introduce ninguna frecuencia ficticia.`}
  $("#explanationTitle").textContent=title;$("#explanation").textContent=text;
}

function update() {
  const om=frequency(state.qx,state.qy,state.branch);$("#qx").value=state.qx;$("#qy").value=state.qy;$("#qxOut").textContent=piLabel(state.qx);$("#qyOut").textContent=piLabel(state.qy);$("#ampOut").textContent=`${format(state.amplitude*100,0)} % de a`;$("#speedOut").textContent=`${format(state.speed,1)}×`;$("#readK").textContent=`(${piLabel(state.qx)}, ${piLabel(state.qy)}) / a`;$("#readOmega").textContent=format(om,3);$("#readPolarization").textContent=state.branch==="x"?"εₓ = (1, 0)":"εᵧ = (0, 1)";$("#readPhase").textContent=`${format(state.qx/PI)}π nₓ + ${format(state.qy/PI)}π nᵧ`;$("#play").textContent=state.playing?"Pausar":"Reproducir";$("#motionStatus").textContent=state.playing?"Reproduciendo":"Pausado";$$('[data-branch]').forEach(b=>b.classList.toggle("active",b.dataset.branch===state.branch));explanation();drawSurface();drawBZ();drawLattice();
}

$("#qx").addEventListener("input",e=>{state.qx=+e.target.value;update()});$("#qy").addEventListener("input",e=>{state.qy=+e.target.value;update()});$("#amplitude").addEventListener("input",e=>{state.amplitude=+e.target.value;update()});$("#speed").addEventListener("input",e=>{state.speed=+e.target.value;update()});$$('[data-branch]').forEach(b=>b.addEventListener("click",()=>{state.branch=b.dataset.branch;update()}));
const points={G:[0,0],X:[PI,0],M:[PI,PI]};$$('[data-point]').forEach(b=>b.addEventListener("click",()=>{[state.qx,state.qy]=points[b.dataset.point];update()}));$("#play").addEventListener("click",()=>{state.playing=!state.playing;update()});$("#reset").addEventListener("click",()=>{state.time=0;update()});$("#showCells").addEventListener("change",e=>{state.cells=e.target.checked;drawLattice()});$("#showEquilibrium").addEventListener("change",e=>{state.equilibrium=e.target.checked;drawLattice()});$("#showSurfaceX").addEventListener("change",e=>{state.surfaceX=e.target.checked;drawSurface()});$("#showSurfaceY").addEventListener("change",e=>{state.surfaceY=e.target.checked;drawSurface()});

let surfaceDrag=null;surface.addEventListener("pointerdown",e=>{surfaceDrag={x:e.clientX,y:e.clientY,yaw:state.yaw,pitch:state.pitch};surface.setPointerCapture(e.pointerId)});surface.addEventListener("pointermove",e=>{if(!surfaceDrag)return;state.yaw=surfaceDrag.yaw+(e.clientX-surfaceDrag.x)*.008;state.pitch=Math.max(.12,Math.min(1.3,surfaceDrag.pitch+(e.clientY-surfaceDrag.y)*.006));drawSurface()});surface.addEventListener("pointerup",()=>surfaceDrag=null);surface.addEventListener("wheel",e=>{e.preventDefault();state.zoom=Math.max(.6,Math.min(1.7,state.zoom*(e.deltaY>0?.92:1.08)));drawSurface()},{passive:false});surface.addEventListener("dblclick",()=>{state.yaw=-.72;state.pitch=.55;state.zoom=1;drawSurface()});
let bzDrag=false;function pickBZ(e){const r=bz.getBoundingClientRect(),m=bz._mapping;state.qx=Math.max(-PI,Math.min(PI,((e.clientX-r.left-m.left)/m.size)*2*PI-PI));state.qy=Math.max(-PI,Math.min(PI,PI-((e.clientY-r.top-m.top)/m.size)*2*PI));update()}bz.addEventListener("pointerdown",e=>{bzDrag=true;bz.setPointerCapture(e.pointerId);pickBZ(e)});bz.addEventListener("pointermove",e=>{if(bzDrag)pickBZ(e)});bz.addEventListener("pointerup",()=>bzDrag=false);
addEventListener("resize",update);function frame(now){const dt=Math.min(.05,(now-state.last)/1000);state.last=now;if(state.playing)state.time+=dt*state.speed*2;drawLattice();requestAnimationFrame(frame)}update();requestAnimationFrame(frame);
