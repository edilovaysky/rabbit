var Apple;
export default (Apple = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.appleMesh = new THREE.Group();

  var appleMat = new THREE.MeshLambertMaterial({
    color: 0xffff00 //fad000 //0xdc5f45,//0xb43b29,//0xff5b49,
  });

  var stalkMat = new THREE.MeshLambertMaterial({
    color: 0x339e33 //0x7abf8e,
  });

  var sideMat = new THREE.MeshLambertMaterial({
    color: 0xff2600 //0x7abf8e,
  });

  var bodyGeom = new THREE.CylinderGeometry(4, 3, 8, 6, 1); //5, 3, 10, 4, 1
  bodyGeom.vertices[8].y += 1;
  bodyGeom.vertices[9].y += .1;

  this.body = new THREE.Mesh(bodyGeom, appleMat);

  var stalkGeom = new THREE.CubeGeometry(2, 6, 1, 1);
  stalkGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, 0));
  stalkGeom.vertices[2].x -= 1;
  stalkGeom.vertices[3].x -= 1;
  stalkGeom.vertices[6].x += 1;
  stalkGeom.vertices[7].x += 1;

  this.stalk = new THREE.Mesh(stalkGeom, stalkMat);
  this.stalk.position.set(1, 1, 0);
  this.stalk.rotation.z = 0.3;
  this.stalk.rotation.x = 0.1;

  /* this.leaf2 = this.leaf1.clone();
  this.leaf2.scale.set(1, 1.3, 1);
  this.leaf2.position.y = 7;
  this.leaf2.rotation.z = -0.3;
  this.leaf2.rotation.x = -0.2; */
   var sideGeom = new THREE.CylinderGeometry(2, 2, 4); //5, 3, 10, 4, 1
   //sideGeom.vertices[8].y += 1;
   //sideGeom.vertices[9].y += 0.1;
   this.side = new THREE.Mesh(sideGeom, sideMat);
   this.side.position.set(Math.random(), 1, 1.65);
   this.side.rotation.x = .13;

  this.appleMesh.add(this.body);
  this.appleMesh.add(this.stalk);
  this.appleMesh.add(this.side);

  this.body.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

 // this.appleMesh.scale.set(3, 3, 3);
  this.appleMesh.position.set(this.x, this.y, this.z);
});
