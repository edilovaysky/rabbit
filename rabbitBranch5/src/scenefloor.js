var Floor;
import Tree from './tree';
import Bridge from './bridge';
import LeafTree from './leaftree';

export default (Floor = function() {
  this.floorMesh = new THREE.Group();

  // LEFT FIELD
  var leftFieldMat = new THREE.MeshLambertMaterial({
    color: 0x75bd2d, //abd66a,
    side: THREE.DoubleSide,
  });
  var leftFieldGeom = new THREE.BoxGeometry(800, 30, 1800);
  this.leftFieldMesh = new THREE.Mesh(leftFieldGeom, leftFieldMat);
  this.leftFieldMesh.receiveShadow = true;
  this.leftFieldMesh.position.set(-500, -30, 0);

  // RIGHT FIELD
  this.rightFieldMesh = this.leftFieldMesh.clone();
  this.rightFieldMesh.receiveShadow = true;
  this.rightFieldMesh.position.set(500, -30, 0);

  //BOTTOM FIELD
  var bottomFieldGeom = new THREE.BoxGeometry(1500, 120, 1500);
  this.bottomFieldMesh = new THREE.Mesh(bottomFieldGeom, leftFieldMat);
  this.bottomFieldMesh.receiveShadow = true;
  this.bottomFieldMesh.position.set(0, -180, 0);
  //this.bottomFieldMesh.rotation.y = .3;

  var bottom1FieldGeom = new THREE.BoxGeometry(1300, 180, 1300);
  this.bottom1FieldMesh = new THREE.Mesh(bottom1FieldGeom, leftFieldMat);
  this.bottom1FieldMesh.receiveShadow = true;
  this.bottom1FieldMesh.position.set(0, -380, 0);
  //this.bottom1FieldMesh.rotation.y = -0.3;

  var bottom2FieldGeom = new THREE.BoxGeometry(800, 280, 800);
  this.bottom2FieldMesh = new THREE.Mesh(bottom2FieldGeom, leftFieldMat);
  this.bottom2FieldMesh.receiveShadow = true;
  this.bottom2FieldMesh.position.set(0, -680, 0);

  /*     var fieldMat = new THREE.MeshLambertMaterial({
      color: 0x2b6909,
      side: THREE.DoubleSide
    });

  var bottom3FieldGeom = new THREE.BoxGeometry(5800, 30, 5800);
  this.bottom3FieldMesh = new THREE.Mesh(bottom3FieldGeom, fieldMat);
  this.bottom3FieldMesh.receiveShadow = true;
  this.bottom3FieldMesh.position.set(0, -780, 0); */

  //STREAMGROUND
  var strGroundMat = new THREE.MeshLambertMaterial({
    color: 0x75bd2d,
    side: THREE.DoubleSide,
  });
  var strCroundGeom = new THREE.BoxGeometry(205, 10, 1800);
  this.strGroundMesh = new THREE.Mesh(strCroundGeom, strGroundMat);
  this.strGroundMesh.position.set(0, -40, 0);

  // STREAM
  var streamMat = new THREE.MeshLambertMaterial({
    color: 0x0941ba,
    side: THREE.DoubleSide,
  });
  var streamGeom = new THREE.BoxGeometry(200, 16, 1800);
  this.streamMesh = new THREE.Mesh(streamGeom, streamMat);
  //this.streamMesh.receiveShadow = true;
  this.streamMesh.position.set(0, -32, 0);

  //TREES
  var tree1 = new Tree(-100, 0, -100);
  var tree2 = new Tree(-150, 0, -180);
  var tree3 = new Tree(-100, 0, -220);
  var tree4 = new LeafTree(-400, 0, -400);
  var tree5 = new Tree(-878, 0, -878);
  var tree6 = new Tree(-810, 0, -810);
  var tree7 = new Tree(-740, 0, -870);
  var tree8 = new Tree(688, 0, -680);
  var tree9 = new Tree(-880, 0, 680);
  var tree10 = new Tree(-320, 0, 240);
  var tree11 = new LeafTree(-630, 0, 130);
  var tree12 = new LeafTree(-480, 0, 480);

  var tree13 = new Tree(100, 0, 100);
  var tree14 = new Tree(150, 0, 180);
  var tree15 = new Tree(100, 0, 220);
  var tree16 = new LeafTree(400, 0, 400);
  var tree17 = new Tree(880, 0, 830);
  var tree18 = new Tree(810, 0, 740);
  var tree19 = new Tree(740, 0, 820);
  var tree20 = new Tree(888, 0, 680);
  var tree21 = new LeafTree(878, 0, -680);
  var tree22 = new Tree(320, 0, -240);
  var tree23 = new Tree(630, 0, -130);
  var tree24 = new Tree(480, 0, -480);

  //BRIDGE
  this.bridge = new Bridge();

  //FLOR
  this.floorMesh.add(this.leftFieldMesh);
  this.floorMesh.add(this.rightFieldMesh);
  this.floorMesh.add(this.bottomFieldMesh);
  this.floorMesh.add(this.bottom1FieldMesh);
  this.floorMesh.add(this.bottom2FieldMesh);
  //this.floorMesh.add(this.bottom3FieldMesh);
  this.floorMesh.add(this.streamMesh);
  this.floorMesh.add(this.strGroundMesh);
  this.floorMesh.add(this.bridge.bridgeMesh);

  this.floorMesh.add(tree1.treeMesh);
  this.floorMesh.add(tree2.treeMesh);
  this.floorMesh.add(tree3.treeMesh);
  this.floorMesh.add(tree4.treeMesh);
  this.floorMesh.add(tree5.treeMesh);
  this.floorMesh.add(tree6.treeMesh);
  this.floorMesh.add(tree7.treeMesh);
  this.floorMesh.add(tree8.treeMesh);
  this.floorMesh.add(tree9.treeMesh);
  this.floorMesh.add(tree10.treeMesh);
  this.floorMesh.add(tree11.treeMesh);
  this.floorMesh.add(tree12.treeMesh);
  this.floorMesh.add(tree13.treeMesh);
  this.floorMesh.add(tree14.treeMesh);
  this.floorMesh.add(tree15.treeMesh);
  this.floorMesh.add(tree16.treeMesh);
  this.floorMesh.add(tree17.treeMesh);
  this.floorMesh.add(tree18.treeMesh);
  this.floorMesh.add(tree19.treeMesh);
  this.floorMesh.add(tree20.treeMesh);
  this.floorMesh.add(tree21.treeMesh);
  this.floorMesh.add(tree22.treeMesh);
  this.floorMesh.add(tree23.treeMesh);
  this.floorMesh.add(tree24.treeMesh);
  this.floorMesh.receiveShadow = true;
});
