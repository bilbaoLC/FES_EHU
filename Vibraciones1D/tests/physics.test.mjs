import assert from'node:assert/strict';import{monoOmega,diOmega,diEigenvector}from'../js/physics.js';
const near=(a,b,e=1e-9)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
near(monoOmega(0),0);near(monoOmega(1),2);near(diOmega(0,.6,'acoustic'),0);near(diOmega(0,.6,'optical'),Math.sqrt(3.2));near(diOmega(1,1,'acoustic'),Math.sqrt(2));near(diOmega(1,1,'optical'),Math.sqrt(2));
for(const g of [.1,.6,1,2])for(const q of [-1,-.43,0,.37,1])for(const b of['acoustic','optical']){const w=diOmega(q,g,b),[a,c]=diEigenvector(q,g,b),ka=Math.PI*q;const z={re:1+g*Math.cos(ka),im:-g*Math.sin(ka)},d=1+g-w*w;near(d*a.re-(z.re*c.re-z.im*c.im),0,1e-7);near(d*a.im-(z.re*c.im+z.im*c.re),0,1e-7);assert.ok(Number.isFinite(c.re+c.im))}
console.log('Pruebas físicas superadas');
