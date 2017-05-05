const THREE = require('three')
const Physijs = require('physijs-browserify')(THREE)

const origin = document.location.origin;
Physijs.scripts.worker = origin+'/libs/physi-worker.js';
Physijs.scripts.ammo = origin+'/libs/ammo.js';

// scale in inches

const tableDepth = 30;
const tableThickness = 2;
const tableLength = 6*12;
const tableHeight = 29;

const table = new Physijs.BoxMesh(
    new THREE.CubeGeometry(tableDepth, tableThickness, tableLength),
    new THREE.MeshBasicMaterial({ color: 0x666666 }),
    100 // mass
)

const tableLeg1 = new Physijs.BoxMesh(
    new THREE.CubeGeometry(20, tableHeight-tableThickness, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    1 // mass
)
const tableLeg2 = new Physijs.BoxMesh(
    new THREE.CubeGeometry(20, tableHeight-tableThickness, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    1 // mass
)
table.add(tableLeg1)
table.add(tableLeg2)
tableLeg1.position.set(0,(tableHeight - tableThickness)/-2,3*12-8);
tableLeg2.position.set(0,(tableHeight - tableThickness)/-2,-3*12+8);
table.name = 'table'

table.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    console.log(this, other_object, relative_velocity, relative_rotation, contact_normal)
});

module.exports = table;

