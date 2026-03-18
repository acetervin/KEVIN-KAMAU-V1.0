// ── THREE.JS DYNAMIC LOAD ─────────────────────────────
function loadThree(){
  var s=document.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload=initThree;
  s.onerror=function(){console.warn('Three.js failed to load');};
  document.head.appendChild(s);
}

// ── THREE.JS 3D ICOSAHEDRON ───────────────────────────
function initThree(){
  var wrap=document.getElementById('hero3d-wrap');
  var canvas=document.getElementById('geo-canvas');
  if(!wrap||!canvas)return;

  var W=wrap.clientWidth||420, H=wrap.clientHeight||420;
  var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(W,H);
  renderer.setClearColor(0x000000,0);

  var scene=new THREE.Scene();
  var camera=new THREE.PerspectiveCamera(45,W/H,0.1,100);
  camera.position.set(0,0,4.2);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff,0.4));
  var d1=new THREE.DirectionalLight(0xd4a84b,1.4);d1.position.set(3,4,5);scene.add(d1);
  var d2=new THREE.DirectionalLight(0x4477ff,0.5);d2.position.set(-4,-2,-3);scene.add(d2);
  var pt=new THREE.PointLight(0xe8c87a,1.2,12);pt.position.set(0,2,2);scene.add(pt);

  // Face labels
  var FACES=['HTML5','CSS3','JavaScript','Python','Java','React','Node.js','PostgreSQL','Firebase','Git','Tailwind','Figma','Cloud','DevOps','TypeScript','PHP','C++','MySQL','Linux','VSCode'];

  // Icosahedron with per-face colors
  var baseGeo=new THREE.IcosahedronGeometry(1.55,0);
  var geo=baseGeo.toNonIndexed();
  var fc=geo.attributes.position.count/3;
  var pal=[[0.831,0.659,0.294],[0.910,0.784,0.478],[0.094,0.094,0.094],[0.157,0.157,0.157],[0.200,0.200,0.200]];
  var cols=[];
  for(var f=0;f<fc;f++){var c=pal[f%pal.length];for(var v=0;v<3;v++)cols.push(c[0],c[1],c[2]);}
  geo.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));
  var mat=new THREE.MeshPhongMaterial({vertexColors:true,shininess:90,specular:new THREE.Color(0xd4a84b),transparent:true,opacity:0.94});
  var mesh=new THREE.Mesh(geo,mat);
  scene.add(mesh);

  // Wireframe
  var wmat=new THREE.MeshBasicMaterial({color:0xd4a84b,wireframe:true,transparent:true,opacity:0.16});
  var wmesh=new THREE.Mesh(new THREE.IcosahedronGeometry(1.57,0),wmat);
  scene.add(wmesh);

  // Particles
  var pg=new THREE.BufferGeometry();
  var pp=[];
  for(var i=0;i<280;i++)pp.push((Math.random()-.5)*10,(Math.random()-.5)*10,(Math.random()-.5)*10);
  pg.setAttribute('position',new THREE.Float32BufferAttribute(pp,3));
  var parts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xd4a84b,size:0.03,transparent:true,opacity:0.5}));
  scene.add(parts);

  // Interaction state
  var ray=new THREE.Raycaster();
  var mouse=new THREE.Vector2(-9,-9);
  var drag=false, autoRot=true;
  var prev={x:0,y:0}, vel={x:0,y:0};
  var label=document.getElementById('face-label');

  canvas.addEventListener('mousedown',function(e){drag=true;autoRot=false;prev.x=e.clientX;prev.y=e.clientY;});
  window.addEventListener('mouseup',function(e){
    if(!drag)return;
    var dx=e.clientX-prev.x, dy=e.clientY-prev.y;
    if(Math.abs(dx)<5&&Math.abs(dy)<5)handleClick(e);
    drag=false;
    setTimeout(function(){autoRot=true;},3000);
  });
  window.addEventListener('mousemove',function(e){
    if(!drag)return;
    var dx=e.clientX-prev.x, dy=e.clientY-prev.y;
    vel.y=dx*0.013;vel.x=dy*0.013;
    mesh.rotation.y+=vel.y;mesh.rotation.x+=vel.x;
    wmesh.rotation.copy(mesh.rotation);
    prev.x=e.clientX;prev.y=e.clientY;
  });

  var pt2=null;
  canvas.addEventListener('touchstart',function(e){e.preventDefault();pt2=e.touches[0];autoRot=false;},{passive:false});
  canvas.addEventListener('touchmove',function(e){e.preventDefault();if(!pt2)return;var t=e.touches[0];mesh.rotation.y+=(t.clientX-pt2.clientX)*0.013;mesh.rotation.x+=(t.clientY-pt2.clientY)*0.013;wmesh.rotation.copy(mesh.rotation);pt2=t;},{passive:false});
  canvas.addEventListener('touchend',function(){setTimeout(function(){autoRot=true;},3000);});

  wrap.addEventListener('mousemove',function(e){
    var r=canvas.getBoundingClientRect();
    mouse.x=((e.clientX-r.left)/r.width)*2-1;
    mouse.y=-((e.clientY-r.top)/r.height)*2+1;
  });
  wrap.addEventListener('mouseleave',function(){mouse.set(-9,-9);label.style.opacity='0';});

  function handleClick(e){
    var r=canvas.getBoundingClientRect();
    var m2=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
    var r2=new THREE.Raycaster();r2.setFromCamera(m2,camera);
    var hits=r2.intersectObject(mesh);
    if(hits.length>0){var fi=Math.floor(hits[0].faceIndex/3)%FACES.length;openGame(FACES[fi]);}
  }

  window.addEventListener('resize',function(){
    var nw=wrap.clientWidth,nh=wrap.clientHeight;
    if(nw<10)return;
    renderer.setSize(nw,nh);camera.aspect=nw/nh;camera.updateProjectionMatrix();
  });

  var clock=new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    var t=clock.getElapsedTime();
    if(autoRot){mesh.rotation.y+=0.004;mesh.rotation.x+=0.001;}
    else{vel.x*=0.92;vel.y*=0.92;}
    wmesh.rotation.copy(mesh.rotation);
    parts.rotation.y=t*0.04;
    ray.setFromCamera(mouse,camera);
    var hits=ray.intersectObject(mesh);
    if(hits.length>0){
      var fi=Math.floor(hits[0].faceIndex/3)%FACES.length;
      label.textContent='[ '+FACES[fi]+' ] — click to play';
      label.style.opacity='1';
      canvas.style.cursor='pointer';
    }else{label.style.opacity='0';canvas.style.cursor=drag?'grabbing':'grab';}
    pt.intensity=1.0+0.4*Math.sin(t*1.8);
    renderer.render(scene,camera);
  }
  animate();
}
