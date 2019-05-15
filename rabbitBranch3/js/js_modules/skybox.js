var Skybox;
var lights = [];

export default (Skybox = function() {
  //var textureLoader = new THREE.TextureLoader();
  var skycubeGeom = new THREE.CubeGeometry(5000, 5000, 5000);
  var skycubeSideMat = [
    new THREE.MeshBasicMaterial({
      color: 0xfffff, //map: new THREE.TextureLoader().load("../img/bgrabbit.jpg"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      color: 0xfffff, //map: new THREE.TextureLoader().load("../img/bgrabbit.jpg"), 
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("../img/bgg.png"),
      side: THREE.DoubleSide
    })
  ];
  var skyboxMat = new THREE.MeshFaceMaterial(skycubeSideMat);
  this.skyboxMesh = new THREE.Mesh(skycubeGeom, skyboxMat);
  this.skyboxMesh.position.set(0, 700, 450);

});
