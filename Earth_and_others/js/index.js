    var textureLoader = new THREE.TextureLoader();
    var scene = new THREE.Scene();
    //scene.background = new THREE.Color( 0xf0f0f0 ); 0x050505 

/*     var daeLoader = new THREE.ColladaLoader();

     function loadCollada(collada) {
         scene.add(collada.scene);
     }

     daeLoader.load('../img/book.DAE', loadCollada); */
    
/*     var newLoder = new THREE.OBJLoader();
    newLoder.load(
      "../img/obj.obj",
      function(object) {
        scene.add(object);
        object.scale.x = 0.2;
        object.scale.y = 0.2;
        object.scale.z = 0.2;
        object.position.y = 100;
      },
      function(xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function(error) {
        console.log("An error happened");
      }
    ); */


   /*  var raycaster;
    var mouse = new THREE.Vector2();
    var intersection = null;

    var threshold = 0.1; */


    // SPHERE FOR MOUSE
    var mouseSpheres = [];
    var mouseSpheresIndex = 0;
    let sphereGeometry = new THREE.SphereBufferGeometry(0.1, 32, 32);
    let sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });
    for (let i = 0; i < 40; i++) {

        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
        mouseSpheres.push(sphere);

    }



    var camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.y = 160;
    camera.position.z = 400;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    //    camera.position.set(0, 0, 100);
    //    camera.lookAt(new THREE.Vector3(0, -25, -100));

    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    //renderer.setClearColor(0xEEEEEE);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

  /*   raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = threshold;

    //window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    function onDocumentMouseMove(event) {

        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    } */

    //    var gridXZ = new THREE.GridHelper(100, 10);
    //    gridXZ.setColors(new THREE.Color(0xff0000), new THREE.Color(0xffffff));



    // ADDING LIGHTS
    var ambientLight = new THREE.AmbientLight(0xf0f0f0);
    var spotLight = new THREE.SpotLight(0xffffff);



    //LINE
    var materialLine = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    // сделаем точки для двух линий, которые проведены между каждой последующей парой вершин
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    geometry.vertices.push(new THREE.Vector3(10, 0, 0));
    geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    geometry.vertices.push(new THREE.Vector3(-10, -10, 0));
    geometry.vertices.push(new THREE.Vector3(10, -10, 0));
    geometry.vertices.push(new THREE.Vector3(10, 0, 0));
    //у нас есть геометрия линий и материал линий поэтому создадим линию
    var line = new THREE.Line(geometry, materialLine);
    line.position.x = -150;
    line.position.y = 0;
    line.position.z = -170;



    // CUBE
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xFFFF00,
        wireframe: true
    });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = -150;
    cube.position.y = 0;
    cube.position.z = 200;


    // PARTICLES
    var geometryParticles = new THREE.BufferGeometry();
    var vertices = [];
    for (var i = 0; i < 100000; i++) {
        vertices.push(THREE.Math.randFloatSpread(2000)); //x
        vertices.push(THREE.Math.randFloatSpread(2000)); //y
        vertices.push(THREE.Math.randFloatSpread(2000)); //z
    }


    particleTexrutre = textureLoader.load('../img/suns/star3.png');

    geometryParticles.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    var particles = new THREE.Points(geometryParticles, new THREE.PointsMaterial({
        // color: 0x888888,
        map: particleTexrutre
    }));

    //PARTICLESBRIGHT
    particlesBrightTexrutre = textureLoader.load('../img/suns/starBright.png');
    var geometryParticlesBright = new THREE.BufferGeometry();
    var vertices = [];
    for (var i = 0; i < 100000; i++) {
        vertices.push(THREE.Math.randFloatSpread(2000)); //x
        vertices.push(THREE.Math.randFloatSpread(2000)); //y
        vertices.push(THREE.Math.randFloatSpread(2000)); //z
    }
    geometryParticlesBright.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    var particlesBright = new THREE.Points(geometryParticlesBright, new THREE.PointsMaterial({
        //color: 0xf0f0f0
        map: particlesBrightTexrutre
    }));


    // CYLINDER
    var geometryCylinder = new THREE.CylinderGeometry(8, 8, 16);
    var materialCylinder = new THREE.MeshBasicMaterial({
        color: 0x0000ff
    });
    var cylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
    cylinder.position.x = 155;
    cylinder.position.y = 0;
    cylinder.position.z = 150;

    //PLANET EARTH
    planetTexture = textureLoader.load('../img/suns/earth.jpg');
    planetBump = textureLoader.load('../img/suns/earthbump.jpg');
    specMap = textureLoader.load('../img/suns/earthbump2.jpg');
    var geometryPlanet = new THREE.SphereGeometry(30, 200, 200);
    var materialPlanet = new THREE.MeshPhongMaterial({
        //color: 0xFFFF00,
        map: planetTexture,
        bumpMap: planetBump,
        bumpScale: 0.05,
        specularMap: specMap,
        specular: new THREE.Color('grey')
        //transparent: true
        //wireframe: true
    });
    var planet = new THREE.Mesh(geometryPlanet, materialPlanet);
    planet.position.x = 0;
    planet.position.y = 0;
    planet.position.z = 0;

    // TORUS
    var geometryTorus = new THREE.TorusGeometry(6, 2, 3);
    var materialTorus = new THREE.MeshBasicMaterial({
        color: 0x0000ff
    });
    var torus = new THREE.Mesh(geometryTorus, materialTorus);
    torus.position.x = -200;
    torus.position.y = 0;
    torus.position.z = 0;

    //FACESSPHERE
    var geometrySphere = new THREE.SphereGeometry(10, 10, 10);
    var materialSphere = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        vertexColors: THREE.FaceColors
    });
    var facesSphere = new THREE.Mesh(geometrySphere, materialSphere);
    facesSphere.position.x = 150;
    facesSphere.position.y = 0;
    facesSphere.position.z = -150;
    //PAINT THE FACES OF SPHERE
    for (var i = 0; i < geometrySphere.faces.length; i++) {
        geometrySphere.faces[i].color.setRGB(Math.random(), Math.random(), Math.random());
    }

    //GUISPHERE
    var geometrySphere = new THREE.SphereGeometry(20, 10, 10);
    var materialSphere = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
    });
    var guiSphere = new THREE.Mesh(geometrySphere, materialSphere);
    //sphere.rotation.x = -0.5 * Math.PI;
    guiSphere.position.x = 0;
    guiSphere.position.y = -200;
    guiSphere.position.z = 0;

    //GUI CONTROLER
    var ball = {
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0
    }
    var gui = new dat.GUI();
    gui.add(ball, 'positionX').min(-5).max(5).step(0.1);
    gui.add(ball, 'positionY').min(-5).max(5).step(0.1);
    gui.add(ball, 'positionZ').min(-5).max(5).step(0.1);
    gui.add(ball, 'rotationX').min(-0.2).max(0.2).step(0.001);
    gui.add(ball, 'rotationY').min(-0.2).max(0.2).step(0.001);
    gui.add(ball, 'rotationZ').min(-0.2).max(0.2).step(0.001);


    function loopGui() {
        guiSphere.position.x += ball.positionX;
        guiSphere.position.y += ball.positionY;
        guiSphere.position.z += ball.positionZ;
        guiSphere.rotation.x += ball.rotationX;
        guiSphere.rotation.y += ball.rotationY;
        guiSphere.rotation.z += ball.rotationZ;
        renderer.render(scene, camera);
        requestAnimationFrame(function () {
            loopGui();
        });
    };


    var toggle = 0;
    var render = function () {
        controls.update();
        requestAnimationFrame(render);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;

        line.rotation.x += 0.01;
        line.rotation.y += 0.05;
        line.rotation.z += 0.01;

        cylinder.rotation.x += 0.01;
        cylinder.rotation.y += 0.01;
        cylinder.rotation.z += 0.05;

        torus.rotation.x += 0.05;
        torus.rotation.y += 0.01;
        torus.rotation.z += 0.01;

        //planet.rotation.x += 0.01;
        planet.rotation.y += 0.01;
        //planet.rotation.z += 0.01;

        facesSphere.rotation.x += 0.01
        facesSphere.rotation.y += 0.01

       /*  raycaster.setFromCamera(mouse, camera);
        var intersections = raycaster.intersectObjects(particles);
        intersection = (intersections.length) > 0 ? intersections[0] : null;


        if (toggle > 0.02 && intersection !== null) {

            mouseSpheres[mouseSpheresIndex].position.copy(intersection.point);
            mouseSpheres[mouseSpheresIndex].scale.set(1, 1, 1);
            mouseSpheresIndex = (mouseSpheresIndex + 1) % mouseSpheres.length;

            toggle = 0;

        }

        for (var i = 0; i < mouseSpheres.length; i++) {

            var sphere = mouseSpheres[i];
            sphere.scale.multiplyScalar(0.98);
            sphere.scale.clampScalar(0.01, 1);

        }
        
        var clock = new THREE.Clock();
        toggle += clock.getDelta();

        renderer.render(scene, camera); */
    };

    //controls.enableDamping = true;
    //controls.dampingFactor = 1.25;
    //controls.enableZoom = true;
    controls.autoRotate = true;

    function init() {
        //scene.add(gridXZ);
        scene.add(spotLight);
        scene.add(ambientLight);
        scene.add(particles);
        //scene.add(particlesBright);
        scene.add(cube);
        scene.add(line);
        scene.add(cylinder);
        scene.add(planet);
        scene.add(torus);
        scene.add(facesSphere);
        scene.add(guiSphere);
        render();
        loopGui();
    };

    window.onload = init();
