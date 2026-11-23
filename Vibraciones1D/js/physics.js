export const TAU=Math.PI*2;
export function monoOmega(q){return 2*Math.abs(Math.sin(Math.PI*q/2))}
export function diOmega(q,g,branch){const s=Math.sqrt(Math.max(0,1+g*g+2*g*Math.cos(Math.PI*q)));return Math.sqrt(Math.max(0,1+g+(branch==='optical'?s:-s)))}
export function diEigenvector(q,g,branch){
 const lam=diOmega(q,g,branch)**2, z={re:1+g*Math.cos(Math.PI*q),im:-g*Math.sin(Math.PI*q)};
 const d=1+g-lam, mag=Math.hypot(z.re,z.im);
 // Matrix equation gives epsilon2=d/conj? First row: d e1-(1+g e^-ik)e2=0.
 let e2=mag>1e-12?{re:d*z.re/(mag*mag),im:-d*z.im/(mag*mag)}:{re:branch==='acoustic'?1:-1,im:0};
 const norm=Math.max(1,Math.hypot(e2.re,e2.im)); return [{re:1/norm,im:0},{re:e2.re/norm,im:e2.im/norm}];
}
export function groupVelocity(model,q,g,branch){
 if(Math.abs(Math.abs(q)-1)<1e-5)return 0;
 if(model==='mono'&&Math.abs(q)<1e-5)return null;
 if(model==='di'&&branch==='acoustic'&&Math.abs(q)<1e-5)return null;
 const h=1e-5, f=x=>model==='mono'?monoOmega(x):diOmega(x,g,branch);
 return (f(q+h)-f(q-h))/(2*h*Math.PI); // normalized dω/dk, a=1
}
export function realMode(e,q,n,w,t){const p=Math.PI*q*n-w*t;return e.re*Math.cos(p)-e.im*Math.sin(p)}
