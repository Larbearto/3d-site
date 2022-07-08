import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Setup
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer( {
  canvas: document.querySelector('#bg'),
} )

renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( window.innerWidth, window.innerHeight )
camera.position.setZ( 30 )

renderer.render( scene, camera )

// render == DRAW
// Torus

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 )
const material = new THREE.MeshStandardMaterial( { color: 0xff6347} )
const torus = new THREE.Mesh( geometry, material )

scene.add( torus )

// Lights

const pointLight = new THREE.PointLight( 0xffffff) // emits light in all directions as if you placed a light bulb in the scene
pointLight.position.set( 5, 5, 5 );

const ambientLight = new THREE.AmbientLight( 0xffffff) // like a flood light in a room and will light up everyting in the scene
scene.add( pointLight, ambientLight );

// Helpers

const lightHelper = new THREE.PointLightHelper( pointLight )
const gridHelper = new THREE.GridHelper( 200, 50 ) // draws a 2 dimensional grid through the scene
scene.add(lightHelper, gridHelper) // lightHelper shows us the position of a pointlight.

const controls = new OrbitControls(camera, renderer.domElement); // listens to dom events from the mouse and update the camera position accordingly.

// populate random stars in random positions

function addStar() {
  const geometry = new THREE.SphereGeometry( 0.25, 24, 24 ) // instantiating a sphere geometry with a radius of 0.25
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff } ) // the default material for the star
  const star = new THREE.Mesh( geometry, material )

  // randomly position the stars with an x,y,z position value for each star by filling an array with 3 random values, then map each value to the THREEjs randomFloatSpread function which is a helper function that randomly generates a number between negative and positive 100. We then take those numbers and set the position of the star then add it to the scene.
  const [ x, y, z ] = Array( 3 )
    .fill()
    .map( () => THREE.MathUtils.randFloatSpread( 100 ) )

  star.position.set( x, y, z )
  scene.add( star )
}

Array( 200 ).fill().forEach( addStar ) // how many random stars to create

// Background

const spaceTexture = new THREE.TextureLoader().load( 'space.jpg') // adds the background with loaded image.
scene.background = spaceTexture;

// Avatar - using Texture Mapping, taking a 2 dimensional pixels and mapping them to a 3d geometry.

const larryTexture = new THREE.TextureLoader().load( 'larry.jpg' ) // use the texture loader as an image

const larry = new THREE.Mesh( new THREE.BoxGeometry( 3, 3, 3 ), new THREE.MeshBasicMaterial( { map: larryTexture } ) ); // then create a meshthat contains a box geometry with a basic material

scene.add( larry );

// Moon

const moonTexture = new THREE.TextureLoader().load( 'moon.jpg' )
const normalTexture = new THREE.TextureLoader().load('moonground.jpg')

const moon = new THREE.Mesh(
  new THREE.SphereGeometry( 3, 32, 32 ),
  new THREE.MeshStandardMaterial( {
    map: moonTexture,
    normalMap: normalTexture,
  })
)

scene.add( moon );

moon.position.z = 30;
moon.position.setX( -10 );

larry.position.z = -5;
larry.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top
  moon.rotation.x += 0.05
  moon.rotation.y += 0.075
  moon.rotation.z += 0.05

  larry.rotation.x += 0.01
  larry.rotation.z += 0.01

  camera.position.z = t * -0.01
  camera.position.x = t * -0.0002
  camera.rotation.y = t * -0.0002
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame( animate ) // perform animation

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  controls.update() // makes sure the camera changes are updated within the ui.

  renderer.render( scene, camera) // Game loop
}

animate()