var Skybox;
var lights = [];

export default (Skybox = function() {
  //var textureLoader = new THREE.TextureLoader();
  var skycubeGeom = new THREE.CubeGeometry(3500, 3500, 3500);
  var skycubeSideMat = [
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("../img/st_rt.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("../img/st_lf.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("../img/st_up.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("../img/st_dn.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("../img/st_ft.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("../img/st_bk.png"),
      side: THREE.DoubleSide
    })
  ];
  var skyboxMat = new THREE.MeshFaceMaterial(skycubeSideMat);
  this.skyboxMesh = new THREE.Mesh(skycubeGeom, skyboxMat);
  this.skyboxMesh.position.set(0, 700, 450);

});
