var scene, renderer, camera;
var cube;
var controls;

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xffffff); //0x0c0c0c
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    scene.add(spotLight);

    var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    var cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0x1ec876
    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-55, 0, 0);
       scene.add (cube);


    var textureLoader = new THREE.TextureLoader();
    sphere3Texture = textureLoader.load('../img/suns/earth.jpg');
    sphere3Bump = textureLoader.load('../img/suns/earthbump.jpg');
    var geometrySphere3 = new THREE.SphereGeometry(30, 200, 200);
    var materialSphere3 = new THREE.MeshPhongMaterial({
        //color: 0xFFFF00,
        map: sphere3Texture,
        bumpMap: sphere3Bump,
        bumpScale: 0.05
        //transparent: true
        // wireframe: true
    });
    var sphere3 = new THREE.Mesh(geometrySphere3, materialSphere3);
    sphere3.position.x = 0;
    sphere3.position.y = 0;
    sphere3.position.z = 0;

    scene.add(sphere3);

        // PARTICLES
    var geometryParticles = new THREE.BufferGeometry();
    var vertices = [];
    for (var i = 0; i < 10000; i++) {
        vertices.push(THREE.Math.randFloatSpread(2000));
        vertices.push(THREE.Math.randFloatSpread(2000));
        vertices.push(THREE.Math.randFloatSpread(2000));
    }
    geometryParticles.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    var particles = new THREE.Points(geometryParticles, new THREE.PointsMaterial({
        color: 0x888888
    }));
    scene.add(particles);

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.y = 160;
    camera.position.z = 400;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    var gridXZ = new THREE.GridHelper(100, 10);
    gridXZ.setColors(new THREE.Color(0xff0000), new THREE.Color(0xffffff));
    scene.add(gridXZ);

}

function animate() {
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

//controls.enableDamping = true;
//controls.dampingFactor = 0.25;
//controls.enableZoom = true;
controls.autoRotate = true;
