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
  ambientLight,
  light,
  renderer,
  container,
  clock,
  dragControls,
  skybox,
  bar;
var rabbitRunnig = false;
//SCENE
var floor, carrot, rabbit;
var objects = [];
var drops = [];
var count = 0;

//SCREEN VARIABLES

var HEIGHT,
  WIDTH,
  windowHalfX,
  windowHalfY,
  mousePos = {
    x: 0,
    y: 0
  };
//dist = 0;

function init() {
  //INIT THREE JS, SCREEN AND MOUSE EVENTS
  //var textureLoader = new THREE.TextureLoader();
  scene = new THREE.Scene();
  //scene.background = textureLoader.load('../img/bgrabbit.jpg');
  //scene.fog = new THREE.Fog(0xc1c1f5, 100, 3000);
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 3000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.z = 1350;
  camera.position.y = 250;
  camera.position.x = 550;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  clock = new THREE.Clock();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.Enabled = true;
  container = document.getElementById("world");
  container.appendChild(renderer.domElement);
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.15;
  controls.enableZoom = true;
  // controls.autoRotate = true;

  /* controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3; */

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

  //scene.fog = new THREE.FogExp2(0xffffff, 0.00015);
}

import Skybox from "./skybox";
function createSkybox() {
  skybox = new Skybox();
  scene.add(skybox.skyboxMesh);
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
  light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.4);

  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(200, 200, 200);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 3000;

  backLight = new THREE.DirectionalLight(0xffffff, 0.08, 500); //color of light, intensitive of light, distance to source of light
  backLight.position.set(-100, 200, 50);
  backLight.castShadow = true;

  ambientLight = new THREE.AmbientLight(0xf0f0f0, 0.1);

  scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);
  //scene.add(ambientLight);
}

import Floor from "./scenefloor";
function createFloor() {
  floor = new Floor();
  scene.add(floor.floorMesh);
}

import Carrot from "./carrot";
function createCarrot() {
  carrot = new Carrot();
  scene.add(carrot.carrotMesh);
}

import Rabbit from "./rabbit";
function createRabbit() {
  rabbit = new Rabbit();
  scene.add(rabbit.rabbitMesh);
}

import Bar from "./bars";
function createBar() {
  bar = new Bar();
  scene.add(bar.barMesh);
  objects.push(bar.barMesh);
}

function createDrags() {
  dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
  dragControls.addEventListener("dragstart", function() {
    controls.enabled = false;
  });
  dragControls.addEventListener("dragend", function() {
    controls.enabled = true;
  });
}

var Drop = function() {
  this.geometry = new THREE.BoxGeometry(25, 50, 10);
  this.material = new THREE.MeshLambertMaterial({ color: 0x70b7e3 });
  this.drop = new THREE.Mesh(this.geometry, this.material);
  this.drop.position.set(
    (Math.random() - 0.5) * 200,
    -50,
    900 + Math.random(1, 50) * 10
  );
  //this.drop.rotation.x = Math.PI/2;
  scene.add(this.drop);
  this.speed = 0;
  this.lifespan = Math.random() * 50 + 50;

  this.update = function() {
    this.speed += 0.07;
    this.lifespan--;
    this.drop.position.x += (5 - this.drop.position.x) / 70;
    this.drop.position.y -= this.speed;
  };
};

function render() {
  if (rabbitRunnig == true) {
    rabbit.run();
  }
  if (controls) controls.update();
  if (count % 3 == 0) {
    for (var i = 0; i < 7; i++) {
      drops.push(new Drop());
    }
  }
  count++;
  for (var i = 0; i < drops.length; i++) {
    drops[i].update();
    if (drops[i].lifespan < 0) {
      scene.remove(scene.getObjectById(drops[i].drop.id));
      drops.splice(i, 1);
    }
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

init();
createLights();
//createSkybox();
createDrags();
createBar();
createFloor();
createCarrot();
carrot.carrotMesh.position.set(-150, -12, 30);
createRabbit();
rabbit.blink();
render();
