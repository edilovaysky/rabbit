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
  taskElem,
  toolsElem,
  workspaceElem,
  dragControls,
  skybox,
  bar;
var rabbitRunning = false;
var rabbitMoving = false;
var rabbitJumping = false;
var isTaskOpen = false;
var isToolsOpen = false;
//SCENE
var floor, rabbit;
var objects = [];
var drops = [];
var count = 0;
var carrot = [];

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
  var textureLoader = new THREE.TextureLoader();
  scene = new THREE.Scene();
  scene.background = textureLoader.load("../img/bgrabbit.jpg");
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
  camera.position.z = 2000;
  camera.position.y = 250;
  camera.position.x = 0;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  /* можно добавить вторую сцену со второй камерой
   camera2.position.copy( camera.position );
camera2.position.sub( controls.target );
camera2.position.setLength( CAM_DISTANCE );
camera2.lookAt( scene2.position ); */
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
  //controls.autoRotate = true;

  /* controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3; */
  onWindowResize();
  document.addEventListener("keydown", function(e) {
   e = e || window.event;
   if (e.keyCode == '65') {
     turnLeft();
   } else if (e.keyCode == "83") {
     rabbitMoving = true;
   } else if (e.keyCode == "68") {
     turnRight();
   }
    else if (e.keyCode == "32") {
      if (rabbitJumping == true) {
        return;
      }
      else if (rabbitJumping == false) {
        rabbit.jump();
        rabbitJumping = true;
      }
   }
  });

  document.addEventListener('keyup', function(e) {
    e = e || window.event;
    if (e.keyCode == '83') {
      rabbitMoving = false;
      rabbit.killMove();
      rabbit.nod();
    }
    if (e.keyCode == '32') { 
          setTimeout(() =>{
            rabbitJumping = false;
          }, 800);  
    }
  })

  var showTask = document.getElementById("show-task");
  showTask.addEventListener("click", function() {
    if (isTaskOpen == false) {
      taskElem = document.createElement("div");
      taskElem.className = "task-сlass";
      taskElem.id = "taskid";
      taskElem.innerHTML =
        "<h1> Заголовок задания </h1> <p>Описание задания которое необходимо выполнить юному программисту.</p>";
      tasks.appendChild(taskElem);
    }
    isTaskOpen = true;
  });

  var closeTask = document.getElementById("close-task");
  closeTask.addEventListener("click", function() {
    if (isTaskOpen == true) {
      tasks.removeChild(taskElem);
    }
    isTaskOpen = false;
  });

  var beginProgramming = document.getElementById("show-tools");
  beginProgramming.addEventListener("click", function() {
    if (isToolsOpen == false) {
      toolsElem = document.createElement("div");
      toolsElem.className = "tools-сlass";
      toolsElem.id = "toolsid";
      toolsElem.innerHTML =
        "<h1> Инструменты </h1> <h3>Действия</h3><h3>Математика</h3><h3>События</h3><h3>Циклы</h3><h3>Условия</h3>";
      tasks.appendChild(toolsElem);
      workspaceElem = document.createElement("div");
      workspaceElem.className = "workspace-class";
      workspaceElem.innerHTML = "place to recive draggable blocks";
      tasks.appendChild(workspaceElem);
    }
    isToolsOpen = true;
  });

  var stopProgramming = document.getElementById("close-tools");
  stopProgramming.addEventListener("click", function() {
    if (isToolsOpen == true) {
      tasks.removeChild(toolsElem);
      tasks.removeChild(workspaceElem);
    }
    isToolsOpen = false;
  });

  var runTest = document.getElementById("run");
  runTest.addEventListener("click", function() {
    rabbitRunning = !rabbitRunning;
    if (rabbitRunning == false) {
      //setTimeout(rabbit.killMove.bind(rabbit), 2000);
      rabbit.killMove();
      rabbit.nod();
    }
  });

  var jumpTest = document.getElementById("jump");
  jumpTest.addEventListener("click", function() {
    rabbitJumping = !rabbitJumping;
    rabbit.jump();
  });

  var moveTest = document.getElementById("moveTest");
  moveTest.addEventListener("click", function() {
    rabbitMoving = !rabbitMoving;
    if (rabbitMoving == true) {
      setTimeout(stopMove, 725);
    }
  });

  var right = document.getElementById("right");
  right.addEventListener("click", function() {
    turnRight();
  });

  var left = document.getElementById("left");
  left.addEventListener("click", function() {
    turnLeft();
  });

  var check = document.getElementById("check");
  check.addEventListener("click", function() {
    /*  console.log(
      rabbit.rabbitMesh.position
        .clone()
        .sub(floor.floorMesh.tree1.treeMesh.position.clone())
    ); */
    console.log(rabbit.rabbitMesh.position);
  });

  //scene.fog = new THREE.FogExp2(0xffffff, 0.00015);
  // if (rabbitMoving == true) {
  //rabbit.move();
  //rabbit.killNod();
  //}
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

  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
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
  for (let i = 0; i < 10; i++) {
    carrot[i] = new Carrot();
    scene.add(carrot[i].carrotMesh);
  }
}

import Rabbit from "./rabbit";
function createRabbit() {
  rabbit = new Rabbit();
  scene.add(rabbit.rabbitMesh);
  rabbit.nod();
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
  this.geometry = new THREE.BoxGeometry(15, 50, 5);
  this.material = new THREE.MeshLambertMaterial({ color: 0x4493d4 });
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
  renderer.render(scene, camera);
}

function turnRight() {
  rabbit.rabbitMesh.rotation.y = rabbit.rabbitMesh.rotation.y - Math.PI / 2;
}

function turnLeft() {
  rabbit.rabbitMesh.rotation.y = rabbit.rabbitMesh.rotation.y + Math.PI / 2;
}

function stopMove() {
  rabbitMoving = false;
  rabbit.killMove();
  rabbit.nod();
}

function stopCamRotation() {
  controls.autoRotate = false;
}

function getCarrot(i, x) {
  setTimeout(() => {
    rabbit.jump();
  }, 500);
  carrot[i].carrotMesh.position.set(0 + x, 100, 800);
}

function checkCollision() {
  var rabbCarr1 = rabbit.rabbitMesh.position
    .clone()
    .sub(carrot[0].carrotMesh.position.clone());
  var rabbCarr2 = rabbit.rabbitMesh.position
    .clone()
    .sub(carrot[1].carrotMesh.position.clone());
  var rabbCarr3 = rabbit.rabbitMesh.position
    .clone()
    .sub(carrot[2].carrotMesh.position.clone());
  var rabbCarr4 = rabbit.rabbitMesh.position
    .clone()
    .sub(carrot[3].carrotMesh.position.clone());
  var rabbCarr5 = rabbit.rabbitMesh.position
    .clone()
    .sub(carrot[4].carrotMesh.position.clone());
  var rabbCarr6 = rabbit.rabbitMesh.position
    .clone()
    .sub(carrot[5].carrotMesh.position.clone());
  var rabbCarr7 = rabbit.rabbitMesh.position
    .clone()
    .sub(carrot[6].carrotMesh.position.clone());
  var rabbCarr8 = rabbit.rabbitMesh.position
    .clone()
    .sub(carrot[7].carrotMesh.position.clone());
  var rabbCarr9 = rabbit.rabbitMesh.position
    .clone()
    .sub(carrot[8].carrotMesh.position.clone());
  var rabbCarr10 = rabbit.rabbitMesh.position
    .clone()
    .sub(carrot[9].carrotMesh.position.clone());

  if (rabbCarr1.length() <= 25) {
    getCarrot(0, 0);
  }
  if (rabbCarr2.length() <= 25) {
    getCarrot(1, 20);
  }
  if (rabbCarr3.length() <= 25) {
    getCarrot(2, 40);
  }
  if (rabbCarr4.length() <= 25) {
    getCarrot(3, 60);
  }
  if (rabbCarr5.length() <= 25) {
    getCarrot(4, 80);
  }
  if (rabbCarr6.length() <= 25) {
    getCarrot(5, 100);
  }
  if (rabbCarr7.length() <= 25) {
    getCarrot(6, 120);
  }
  if (rabbCarr8.length() <= 25) {
    getCarrot(7, 140);
  }
  if (rabbCarr9.length() <= 25) {
    getCarrot(8, 160);
  }
  if (rabbCarr10.length() <= 25) {
    getCarrot(9, 180);
  }
  /*  if (rabbit.rabbitMesh.position == ) {
    alert('stop')
  } */
  var rabbFloor = floor.floorMesh.position
    .clone()
    .sub(rabbit.rabbitMesh.position.clone());
  //console.log(rabbFloor.x);
  //console.log(rabbFloor.z);
  if (
    rabbFloor.x <= -900 ||
    rabbFloor.x >= 900 ||
    rabbFloor.z <= -900 ||
    rabbFloor.z >= 900
  ) {
    rabbit.fall();
  }
}

function loop() {
  if (rabbitMoving == true) {
    checkCollision();
    rabbit.killNod();
    rabbit.move();
  }
  if (rabbitRunning == true) {
    rabbit.killNod();
    rabbit.run();
  }

  if (controls) controls.update();

  //CREATE DROPS
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
  render();
  requestAnimationFrame(loop);
}

init();
createLights();
//createSkybox();
//createDrags();
//createBar();
createFloor();
createCarrot();
//console.log(carrot[0].carrotMesh.position.x, carrot[1].carrotMesh.position.x);
carrot.forEach(carrot => {
  carrot.carrotMesh.position.set(
    170 * Math.random() * 3 + 300,
    -12,
    700 * Math.random() * 1.2 - 300
  );
});

createRabbit();
rabbit.blink();
loop();
window.onload = function() {
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.1;
  camera.position.z = 800;
  TweenMax.to(camera.position, 1.2, {
    z: 100,
    ease: Power0.easeIn
  });
  setTimeout(stopCamRotation, 4700);
  camera.position.z = 1600;
};

