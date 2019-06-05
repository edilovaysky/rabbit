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
var isGetCarrot = false;
var toggleSetCarrot = true;

var floor, rabbit;
var objects = [];
var drops = [];
var count = 0;
var carrot = [];
var apple = [];
var carrots = [];
var apples = [];
var roundCount = 0;

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
    if (e.keyCode == "65") {
      turnLeft();
    } else if (e.keyCode == "83") {
      rabbitMoving = true;
    } else if (e.keyCode == "68") {
      turnRight();
    } else if (e.keyCode == "32") {
      if (rabbitJumping == true) {
        return;
      } else if (rabbitJumping == false) {
        rabbit.jump();
        rabbitJumping = true;
      }
    }
  });

  document.addEventListener("keyup", function(e) {
    e = e || window.event;
    if (e.keyCode == "83") {
      rabbitMoving = false;
      rabbit.killMove();
      rabbit.nod();
    }
    if (e.keyCode == "32") {
      setTimeout(() => {
        rabbitJumping = false;
      }, 800);
    }
  });

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
    isGetCarrot = !isGetCarrot;
  });

  //scene.fog = new THREE.FogExp2(0xffffff, 0.0005);
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

  ambientLight = new THREE.AmbientLight(0xf0f0f0, 0.05);

  scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);
  scene.add(ambientLight);
}

import Floor from "./scenefloor";
function createFloor() {
  floor = new Floor();
  scene.add(floor.floorMesh);
}

import Carrot from "./carrot";
function createCarrot() {
  for (let i = 0; i < 25; i++) {
    carrot[i] = new Carrot();
    scene.add(carrot[i].carrotMesh);
  }
}
import Apple from "./apples";
function createApples() {
  for (let i = 0; i < 25; i++) {
    apple[i] = new Apple();
    scene.add(apple[i].appleMesh);
    apples.push(apple[i].appleMesh);
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
  this.material = new THREE.MeshLambertMaterial({ color: 0x0941ba });
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

function setCarrot() {
  if (toggleSetCarrot === true) {
    setTimeout(() => {
      carrot.forEach(carrot => {
        carrot.carrotMesh.position.set(
          170 * Math.random() * 3 + 300,
          -12,
          1400 * Math.random() * 1.2 - 900
        );
      });
    }, 500);
  }
}

function getCarrot(i, x) {
  setTimeout(() => {
    rabbit.jump();
  }, 500);
  carrot[i].carrotMesh.position.set(0 + x, -10, 910);
}

function getApple(i, x) {
  setTimeout(() => {
    rabbit.jump();
  }, 500);
  apple[i].appleMesh.position.set(-20 + x, -10, 910);
  apple[i].appleMesh.rotation.set(0, 0, 0.1);
}

function checkCollision() {
  //COLLISION WITH CARROTS
  for (let i = 0; i < 25; i++) {
    var rabbCarr = rabbit.rabbitMesh.position
      .clone()
      .sub(carrot[i].carrotMesh.position.clone());
    if (rabbCarr.length() <= 25) {
      getCarrot(i, i * 20);
      carrots.push(carrot[i].carrotMesh);
    }
  }
  //COLLISION WITH APPLES
  for (let i = 0; i < apples.length; i++) {
    var rabbApple = rabbit.rabbitMesh.position
      .clone()
      .sub(apple[i].appleMesh.position.clone());
    if (rabbApple.length() <= 25) {
      getApple(i, -i * 20);
    }
  }
  //IF END OF FLOOR
  var rabbFloor = floor.floorMesh.position
    .clone()
    .sub(rabbit.rabbitMesh.position.clone());
  if (
    rabbFloor.x <= -900 ||
    rabbFloor.x >= 900 ||
    rabbFloor.z <= -900 ||
    rabbFloor.z >= 900
  ) {
    rabbit.fall();
  }
  //IF END OF STREAM
  var rabbStream = rabbit.rabbitMesh.position
    .clone()
    .sub(floor.streamMesh.position.clone());
  if (
    (rabbStream.x >= -97 &&
      rabbStream.x <= 97 &&
      rabbStream.z >= -900 &&
      rabbStream.z <= 688) ||
    (rabbStream.x >= -97 && rabbStream.x <= 97 && rabbStream.z >= 712)
  ) {
    rabbit.fall();
  }
}

function checkPlay(arr) {
  let count = roundCount;
  if (arr.length === 2) {
    roundCount++;
    //console.log(roundCount);
    for (let i = 0; i <= 2; i++) {
      arr.shift(arr[i]);
    }
  }
  if (roundCount > count) {
    console.log(roundCount);
    console.log(count);
    return (toggleSetCarrot = true);
  }
  console.log(toggleSetCarrot);
  if ((toggleSetCarrot = true)) {
    //  setCarrot();

    setTimeout(() => {
      count++;
    }, 1200);
  }
  return (toggleSetCarrot = false);
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
  checkPlay(carrots);
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
setCarrot();

createApples();
apple.forEach(apple => {
  apple.appleMesh.position.set(
    -170 * Math.random() * 3 + -200,
    -11,
    700 * Math.random() * 1.2 - 400
  );
  apple.appleMesh.rotation.x = Math.sin(Math.random() * 10);
  apple.appleMesh.rotation.y = Math.sin(Math.random() * 10);
  apple.appleMesh.rotation.z = Math.sin(Math.random() * 10);
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
console.log(roundCount);
