//THREEJS RELATED VARIABLES

var scene,
  camera,
  controls,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  shadowLight,
  backLight,
  light,
  renderer,
  clock,
  delta,
  container;
var rabbitRunnig = false;
//SCENE
var floor, carrot;

//SCREEN VARIABLES

var HEIGHT,
  WIDTH,
  windowHalfX,
  windowHalfY,
  mousePos = {
    x: 0,
    y: 0
  };
dist = 0;

function init() {
  //INIT THREE JS, SCREEN AND MOUSE EVENTS
  var textureLoader = new THREE.TextureLoader();
  scene = new THREE.Scene();
  //scene.background = textureLoader.load('../img/bg.jpg');
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 2000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.z = 350;
  camera.position.y = 150;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  clock = new THREE.Clock();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  //renderer.shadowMapEnabled = true;
  container = document.getElementById("world");
  container.appendChild(renderer.domElement);
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  //controls.autoRotate = true;

  var runTest = document.getElementById("run");
  runTest.addEventListener("click", function() {
    rabbitRunnig = !rabbitRunnig;
  });
  
  var jumpTest = document.getElementById("jump");
  jumpTest.addEventListener("click", function() {
    rabbit.jump();
  });

  var nodTest = document.getElementById("nod");
  nodTest.addEventListener("click", function() {
    rabbit.nod();
  });

  var grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  grid.receiveShadow = true;
  grid.position.y = -35;
  //scene.add(grid);

  /*  var ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(200, 200),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.position.y = -33;
  scene.add(ground); */
}

function onWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function createLights() {
  light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);

  shadowLight = new THREE.DirectionalLight(0xffffff, 0.8);
  shadowLight.position.set(200, 200, 200);
  shadowLight.castShadow = true;
  //shadowLight.shadowDarkness = .2;

  backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  backLight.position.set(-100, 200, 50);
  //backLight.shadowDarkness = .1;
  //backLight.castShadow = true;

  var ambientLight = new THREE.AmbientLight(0xf0f0f0);

  scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);
  //scene.add(ambientLight);
}

function createFloor() {
  floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1000, 500),
    new THREE.MeshBasicMaterial({
      color: 0xebe5e7
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -100;
  floor.receiveShadow = true;
  scene.add(floor);
}

function createCarrot() {
  carrot = new Carrot();
  scene.add(carrot.carrotMesh);
}

function createRabbit() {
  rabbit = new Rabbit();
  scene.add(rabbit.rabbitMesh);
}

Carrot = function() {
  this.carrotMesh = new THREE.Group();

  var carrotMat = new THREE.MeshLambertMaterial({
    color: 0xd9721e //0xdc5f45,//0xb43b29,//0xff5b49,
  });

  var leafMat = new THREE.MeshLambertMaterial({
    color: 0x339e33 //0x7abf8e,
  });

  var bodyGeom = new THREE.CylinderGeometry(5, 3, 12, 4, 1); //5, 3, 10, 4, 1
  bodyGeom.vertices[8].y += 2;
  bodyGeom.vertices[9].y -= 3;

  this.body = new THREE.Mesh(bodyGeom, carrotMat);

  var leafGeom = new THREE.CubeGeometry(5, 10, 1, 1);
  leafGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, 0));
  leafGeom.vertices[2].x -= 1;
  leafGeom.vertices[3].x -= 1;
  leafGeom.vertices[6].x += 1;
  leafGeom.vertices[7].x += 1;

  this.leaf1 = new THREE.Mesh(leafGeom, leafMat);
  this.leaf1.position.y = 7;
  this.leaf1.rotation.z = 0.3;
  this.leaf1.rotation.x = 0.2;

  this.leaf2 = this.leaf1.clone();
  this.leaf2.scale.set(1, 1.3, 1);
  this.leaf2.position.y = 7;
  this.leaf2.rotation.z = -0.3;
  this.leaf2.rotation.x = -0.2;

  this.carrotMesh.add(this.body);
  this.carrotMesh.add(this.leaf1);
  this.carrotMesh.add(this.leaf2);

  this.body.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  this.carrotMesh.scale.set(2, 2, 2);
  this.carrotMesh.position.set(-50, 0, 50);
};

//RABBIT CONSTRUCTOR
Rabbit = function() {
  this.bodyInitPositions = [];
  this.runningCycle = 0;

  this.rabbitMesh = new THREE.Group();
  this.bodyMesh = new THREE.Group();
  this.headMesh = new THREE.Group();

  var bodyMat = new THREE.MeshLambertMaterial({
    color: 0x703f18
  });

  var tailMat = new THREE.MeshLambertMaterial({
    color: 0x8f8f8f
  });

  var nouseMat = new THREE.MeshLambertMaterial({
    color: 0xed716d
  });

  var mouthMat = new THREE.MeshLambertMaterial({
    color: 0xd14747
  });

  var mustacheMat = new THREE.MeshLambertMaterial({
    color: 0x000000
  });

  var eyeMat = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });

  var irisMat = new THREE.MeshLambertMaterial({
    color: 0x301817
  });

  var pawMat = new THREE.MeshLambertMaterial({
    color: 0x995c5a
  });

  var bodyGeom = new THREE.BoxGeometry(50, 50, 42, 1);
  var headGeom = new THREE.BoxGeometry(44, 44, 54, 1);

  var cheekGeom = new THREE.BoxGeometry(20, 20, 5, 1);

  var earGeom = new THREE.BoxGeometry(5, 60, 10, 1);
  earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, 0));
  earGeom.vertices[1].z += -7;
  earGeom.vertices[4].z += -7;
  earGeom.vertices[5].z += +1;
  earGeom.vertices[7].z += +1;
  earGeom.vertices[5].x += -5;
  earGeom.vertices[1].x += +5;

  var eyeGeom = new THREE.BoxGeometry(20, 20, 8, 1);
  var irisGeom = new THREE.BoxGeometry(8, 8, 8, 1);

  var mouthGeom = new THREE.BoxGeometry(8, 16, 4, 1);

  var mustacheGeom = new THREE.BoxGeometry(0.5, 1, 22, 1);
  var spotGeom = new THREE.BoxGeometry(1, 1, 1, 1);

  var legGeom = new THREE.BoxGeometry(33, 33, 10, 1);
  var pawGeom = new THREE.BoxGeometry(45, 10, 10, 1);
  pawGeom.vertices[2].z -= 1;
  pawGeom.vertices[3].z += 1;
  pawGeom.vertices[4].z -= 3;
  pawGeom.vertices[4].y += 3;
  pawGeom.vertices[5].z += 3;
  pawGeom.vertices[5].y += 3;
  pawGeom.vertices[6].z -= 3;
  pawGeom.vertices[7].z += 3;
  var pawFGeom = new THREE.BoxGeometry(20, 20, 20, 1);

  var tailGeom = new THREE.BoxGeometry(20, 20, 20, 1);
  tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -2));

  var nouseGeom = new THREE.BoxGeometry(20, 20, 15, 1);

  var tailGeom = new THREE.BoxGeometry(23, 23, 23, 1);
  tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -2));

  this.body = new THREE.Mesh(bodyGeom, bodyMat);
  this.bodyMesh.add(this.body);
  this.body.castShadow = true;

  this.head = new THREE.Mesh(headGeom, bodyMat);
  this.head.position.x = -30;
  this.head.position.y = 30;
  this.head.castShadow = true;

  this.cheekL = new THREE.Mesh(cheekGeom, tailMat);
  this.cheekL.position.x = -19;
  this.cheekL.position.y = 19;
  this.cheekL.position.z = 28;

  this.cheekR = this.cheekL.clone();
  this.cheekR.position.z = -this.cheekL.position.z;

  this.eyeL = new THREE.Mesh(eyeGeom, eyeMat);
  this.eyeL.position.x = -23;
  this.eyeL.position.y = 44;
  this.eyeL.position.z = 25;

  this.eyeR = this.eyeL.clone();
  this.eyeR.position.z = -this.eyeL.position.z;

  this.irisL = new THREE.Mesh(irisGeom, irisMat);
  this.irisL.position.x = -25;
  this.irisL.position.y = 40;
  this.irisL.position.z = 26;

  this.irisR = this.irisL.clone();
  this.irisR.position.z = -this.irisL.position.z;

  this.nouse = new THREE.Mesh(nouseGeom, nouseMat);
  this.nouse.position.x = -45;
  this.nouse.position.y = 45;

  this.mouth = new THREE.Mesh(mouthGeom, mouthMat);
  this.mouth.position.x = -50;
  this.mouth.position.y = 17;

  this.mustacheL1 = new THREE.Mesh(mustacheGeom, mustacheMat);
  this.mustacheL1.position.x = -52;
  this.mustacheL1.position.y = 13;
  this.mustacheL1.position.z = 25;
  this.mustacheL1.rotation.x = +0.1;

  this.mustacheR1 = this.mustacheL1.clone();
  this.mustacheR1.position.z = -this.mustacheL1.position.z;
  this.mustacheR1.position.y = 23;

  this.mustacheL2 = new THREE.Mesh(mustacheGeom, mustacheMat);
  this.mustacheL2.position.x = -52;
  this.mustacheL2.position.y = 23;
  this.mustacheL2.position.z = 25;
  this.mustacheL2.rotation.x = -0.1;

  this.mustacheR2 = this.mustacheL2.clone();
  this.mustacheR2.position.z = -this.mustacheL2.position.z;
  this.mustacheR2.position.y = 13;

  this.mustacheL3 = new THREE.Mesh(mustacheGeom, mustacheMat);
  this.mustacheL3.position.x = -52;
  this.mustacheL3.position.y = 18;
  this.mustacheL3.position.z = 25;

  this.mustacheR3 = this.mustacheL3.clone();
  this.mustacheR3.position.z = -this.mustacheL3.position.z;
  this.mustacheR3.position.y = 18;

  this.spotL1 = new THREE.Mesh(spotGeom, mustacheMat);
  this.spotL1.position.x = -46;
  this.spotL1.position.y = 25;
  this.spotL1.position.z = 27;

  this.spotR1 = this.spotL1.clone();
  this.spotR1.position.z = -this.spotL1.position.z;

  this.spotL2 = new THREE.Mesh(spotGeom, mustacheMat);
  this.spotL2.position.x = -42;
  this.spotL2.position.y = 22;
  this.spotL2.position.z = 27;

  this.spotR2 = this.spotL2.clone();
  this.spotR2.position.z = -this.spotL2.position.z;

  this.spotL3 = new THREE.Mesh(spotGeom, mustacheMat);
  this.spotL3.position.x = -48;
  this.spotL3.position.y = 18;
  this.spotL3.position.z = 27;

  this.spotR3 = this.spotL3.clone();
  this.spotR3.position.z = -this.spotL3.position.z;

  this.earR = new THREE.Mesh(earGeom, pawMat);
  this.earR.position.x = -9;
  this.earR.position.y = 72;
  this.earR.position.z = -13;
  this.earR.rotation.z = -0.1;

  this.earL = this.earR.clone();
  this.earL.position.z = -this.earR.position.z;
  this.earL.position.x = -19;
  this.earL.rotation.y = Math.PI;
  this.earL.rotation.z = -0.4;

  this.legL = new THREE.Mesh(legGeom, pawMat);
  this.legL.position.x = 14;
  this.legL.position.z = 25;
  this.legL.position.y = -2;

  this.legR = new THREE.Mesh(legGeom, pawMat);
  this.legR = this.legL.clone();
  this.legR.position.z = -this.legL.position.z;

  this.pawBL = new THREE.Mesh(pawGeom, pawMat);
  this.pawBL.position.x = 5;
  this.pawBL.position.y = -27;
  this.pawBL.position.z = 25;
  this.pawBL.rotation.z = 0.1;

  this.pawBR = new THREE.Mesh(pawGeom, pawMat);
  this.pawBR = this.pawBL.clone();
  this.pawBR.position.z = -this.pawBL.position.z;

  this.pawFL = new THREE.Mesh(pawFGeom, pawMat);
  this.pawFL.position.x = -30;
  this.pawFL.position.y = -7;
  this.pawFL.position.z = 25;

  this.pawFR = new THREE.Mesh(pawFGeom, pawMat);
  this.pawFR = this.pawFL.clone();
  this.pawFR.position.z = -this.pawFL.position.z;

  this.tail = new THREE.Mesh(tailGeom, tailMat);
  this.tail.position.x = 25;
  this.tail.position.y = 23;

  this.bodyMesh.add(this.legL);
  this.bodyMesh.add(this.legR);
  this.bodyMesh.add(this.pawBL);
  this.bodyMesh.add(this.pawBR);
  this.bodyMesh.add(this.pawFL);
  this.bodyMesh.add(this.pawFR);
  this.bodyMesh.add(this.tail);

  this.headMesh.add(this.eyeL);
  this.headMesh.add(this.eyeR);
  this.headMesh.add(this.irisL);
  this.headMesh.add(this.irisR);
  this.headMesh.add(this.mouth);
  this.headMesh.add(this.mustacheL1);
  this.headMesh.add(this.mustacheL2);
  this.headMesh.add(this.mustacheL3);
  this.headMesh.add(this.mustacheR1);
  this.headMesh.add(this.mustacheR2);
  this.headMesh.add(this.mustacheR3);
  this.headMesh.add(this.spotL1);
  this.headMesh.add(this.spotL2);
  this.headMesh.add(this.spotL3);
  this.headMesh.add(this.spotR1);
  this.headMesh.add(this.spotR2);
  this.headMesh.add(this.spotR3);
  this.headMesh.add(this.head);
  this.headMesh.add(this.cheekL);
  this.headMesh.add(this.cheekR);
  this.headMesh.add(this.nouse);
  this.headMesh.add(this.earL);
  this.headMesh.add(this.earR);

  this.rabbitMesh.add(this.bodyMesh);
  this.rabbitMesh.add(this.headMesh);
  this.rabbitMesh.rotation.y = -150;
};

//BLINKING

Rabbit.prototype.blink = function() {
  var _this = this;
  var sp = 0.5 + Math.random();
  if (Math.random() > 0.2)
    TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp / 8, {
      y: 0,
      ease: Power1.easeInOut,
      yoyo: true,
      repeat: 3
      /*   onComplete: function () {
          _this.blink()
      } */
    });
};

//JUMPING

Rabbit.prototype.jump = function() {
  // if (this.status == "jumping") return;
  //this.status = "jumping";
  var _this = this;
  var speed = 10;
  var totalSpeed = 10 / speed;
  var jumpHeight = 150;

  TweenMax.to(this.earL.rotation, totalSpeed, {
    z: "+=.3",
    ease: Back.easeOut,
    yoyo: true,
    repeat: 1
  });
  TweenMax.to(this.earR.rotation, totalSpeed, {
    z: "-=.3",
    ease: Back.easeOut,
    yoyo: true,
    repeat: 1
  });

  TweenMax.to(this.pawFL.rotation, totalSpeed, {
    z: "-=.7",
    ease: Back.easeOut,
    yoyo: true,
    repeat: 1
  });
  TweenMax.to(this.pawFR.rotation, totalSpeed, {
    z: "-=.7",
    ease: Back.easeOut,
    yoyo: true,
    repeat: 1
  });
  TweenMax.to(this.pawBL.rotation, totalSpeed, {
    z: "+=.7",
    ease: Back.easeOut,
    yoyo: true,
    repeat: 1
  });
  TweenMax.to(this.pawBR.rotation, totalSpeed, {
    z: "+=.7",
    ease: Back.easeOut,
    yoyo: true,
    repeat: 1
  });

  TweenMax.to(this.tail.rotation, totalSpeed, {
    z: "+=1",
    ease: Back.easeOut,
    yoyo: true,
    repeat: 1
  });

  TweenMax.to(this.mouth.rotation, totalSpeed, {
    z: 0.5,
    ease: Back.easeOut,
    yoyo: true,
    repeat: 1
  });

  TweenMax.to(this.rabbitMesh.position, totalSpeed / 2, {
    y: jumpHeight,
    ease: Power2.easeOut,
    yoyo: true,
    repeat: 1
  });
  TweenMax.to(this.rabbitMesh.position, totalSpeed / 2, {
    y: 0,
    ease: Power4.easeIn,
    delay: totalSpeed / 6,
    yoyo: true,
    repeat: 2
    /*   onComplete: function() {
      //t = 0;
      _this.blink();
    } */
  });
};

//NODING

Rabbit.prototype.nod = function() {
  var _this = this;
  var sp = 0.5 + Math.random();

  // HEAD
  var tHeadRotY = -Math.PI / 6 + (Math.random() * Math.PI) / 3;
  TweenMax.to(this.headMesh.rotation, sp, {
    y: tHeadRotY,
    ease: Power4.easeInOut,
    onComplete: function() {
      _this.nod();
    }
  });

  // EARS
  var tEarLRotZ = (Math.random() * Math.PI) / 8;
  var tEarRRotZ = (Math.random() * Math.PI) / 8;

  TweenMax.to(this.earL.rotation, sp, { z: tEarLRotZ, ease: Power4.easeInOut });
  TweenMax.to(this.earR.rotation, sp, { z: tEarRRotZ, ease: Power4.easeInOut });

  // MOUTH
  var tMouthRot = (Math.random() * Math.PI) / 8;
  TweenMax.to(this.mouth.rotation, sp, {
    z: tMouthRot,
    ease: Power1.easeInOut
  });

  //NOUSE
  TweenMax.to([this.nouse.scale], sp / 8, {
    y: 0.6,
    ease: Elastic.easeInOut,
    yoyo: true,
    repeat: 3
  });

  //EYES
  if (Math.random() > 0.2)
    TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp / 8, {
      y: 0,
      ease: Power1.easeInOut,
      yoyo: true,
      repeat: 1
    });
};

//RUNNING

Rabbit.prototype.run = function() {
  var speed = 6;
  var maxSpeed = 48;
  var s = Math.min(speed, maxSpeed);
  //delta = Math.random(); //clock.getDelta();
  this.runningCycle += delta * s * 0.7;
  this.runningCycle = this.runningCycle % (Math.PI * 2);
  var t = this.runningCycle;

  var amp = 4;
  var disp = 0.2;

  // BODY

  this.rabbitMesh.position.y = 6 + Math.sin(t - Math.PI / 2) * amp;
  this.rabbitMesh.rotation.z = 0.2 + Math.sin(t - Math.PI / 2) * amp * 0.1;

  this.bodyMesh.rotation.z = Math.sin(t - Math.PI / 2) * amp * 0.1;
  this.bodyMesh.position.y = 7 + Math.sin(t - Math.PI / 2) * amp * 0.5;

  // MOUTH
  this.mouth.rotation.z = Math.PI / 16 + Math.cos(t) * amp * 0.05;

  // HEAD
  this.headMesh.position.x = 2 + Math.sin(t - Math.PI / 2) * amp * 0.5;
  this.headMesh.position.y = 8 + Math.cos(t - Math.PI / 2) * amp * 0.7;
  this.headMesh.rotation.z = -0.2 + Math.sin(t + Math.PI) * amp * 0.1;

  // EARS
  this.earL.rotation.z = Math.cos(-Math.PI / 2 + t) * (amp * 0.2) * 0.3;
  this.earR.rotation.z = Math.cos(-Math.PI / 2 + 0.2 + t) * (amp * 0.3) * 0.3;
  // EYES
  this.eyeR.scale.y = this.eyeL.scale.y =
    0.5 + Math.abs(Math.cos(-Math.PI / 4 + t * 0.5)) * 0.6;

  // TAIL
  this.tail.rotation.z = Math.cos(Math.PI / 2 + t) * amp * 0.3;

  // FRONT RIGHT PAW
  this.pawFR.position.y = (1.5 + Math.sin(t) * amp) - 15;
  this.pawFR.rotation.z = (Math.cos(t) * Math.PI) / 4;

  this.pawFR.position.x = (6 - Math.cos(t) * amp * 2) - 40;

  // FRONT LEFT PAW

  this.pawFL.position.y = (1.5 + Math.sin(disp + t) * amp) - 15;
  this.pawFL.rotation.z = (Math.cos(t) * Math.PI) / 4;

  this.pawFL.position.x = (6 - Math.cos(disp + t) * amp * 2) -40;

  // BACK RIGHT PAW
  this.pawBR.position.y = (1.5 + Math.sin(Math.PI + t) * amp) - 30;
  this.pawBR.rotation.z = (Math.cos(t + Math.PI * 1.5) * Math.PI) / 3;

  this.pawBR.position.x = (-Math.cos(Math.PI + t) * amp) + 10;

  // BACK LEFT PAW
  this.pawBL.position.y = (1.5 + Math.sin(Math.PI + t) * amp) - 30;
  this.pawBL.rotation.z = (Math.cos(t + Math.PI * 1.5) * Math.PI) / 3;

  this.pawBL.position.x = (-Math.cos(Math.PI + t) * amp) + 10;
};

function render() {
  delta = clock.getDelta();
  if (rabbitRunnig == true) {
    rabbit.run();
  } 
  if (controls) controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

init();
createLights();
//createFloor();
createCarrot();
createRabbit();
rabbit.blink();
rabbit.rabbitMesh.scale.set(0.5, 0.5, 0.5);
render();
