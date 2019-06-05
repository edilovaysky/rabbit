var Bar;
var textureLoader = new THREE.TextureLoader();
export default (Bar = function () {
    var barMats = [
      new THREE.MeshLambertMaterial({
        color: 0xdeb56a,
        side: THREE.DoubleSide
      }),
      new THREE.MeshLambertMaterial({
        color: 0xdeb56a,
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        map: textureLoader.load("../img/forward.png")
        //side: THREE.DoubleSide
      }),
      new THREE.MeshLambertMaterial({
        color: 0xdeb56a,
        side: THREE.DoubleSide
      }),
      new THREE.MeshLambertMaterial({
        color: 0xdeb56a,
        side: THREE.DoubleSide
      }),
      new THREE.MeshLambertMaterial({
        color: 0xdeb56a,
        side: THREE.DoubleSide
      })
    ];
    var barMat = barMats; //new THREE.MeshFaceMaterial(barMats);
    var barGeom = new THREE.BoxGeometry(40, 10, 15, 1);
    this.barMesh = new THREE.Mesh(barGeom, barMat);
    this.barMesh.position.set(-200, -0, 0);
});
