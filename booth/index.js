const THREE = require('three')
const Physijs = require('physijs-browserify')(THREE)

const origin = document.location.origin;
Physijs.scripts.worker = origin+'/libs/physi-worker.js';
Physijs.scripts.ammo = origin+'/libs/ammo.js';

var initScene, render, renderer, scene, camera, light;

// scale in inches

const floor = new Physijs.BoxMesh(
    new THREE.CubeGeometry(120, 1, 120),
    new THREE.MeshBasicMaterial({ color: 0x888888 }),
    0 // mass
);
floor.name = 'floor';

const table = require('./models/table')

initScene = function() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('viewport').appendChild( renderer.domElement );

    scene = new Physijs.Scene;

    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set(120, 100, 120);
    camera.lookAt(table.position);
    scene.add(camera);
    light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.castShadow = true;
    scene.add(light);

    scene.add(floor);
    table.position.set(0,29,0);
    scene.add(table);

    requestAnimationFrame(render);
};

render = function() {
    scene.simulate(); // run physics
    renderer.render(scene, camera); // render the scene
    requestAnimationFrame(render);
};

window.onload = initScene();

setInterval(function(){
    console.log(new Date())
}, 100);

