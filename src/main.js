import './styles/style.styl'
import Lenis from '@studio-freight/lenis'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger '
import $ from 'jquery'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const gui = new dat.GUI()

const loader = new GLTFLoader()

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical', // vertical, horizontal
  gestureDirection: 'vertical', // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1.2,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

gsap.registerPlugin(ScrollTrigger)

let lenisScroll = 0
let lenisDirection = 0

//get scroll value
lenis.on('scroll', ({ scroll, direction }) => {
  // console.log({ scroll, limit, velocity, direction, progress })
  lenisScroll = scroll
  lenisDirection = direction
})

loader.load('https://uploads-ssl.webflow.com/637ceab05a548aedae987489/6383916473b91e995d8dbb2e_Swish_LowPoly.txt', (gltf) => {
  scene.add(gltf.scene)
  gui.add(gltf.scene.rotation, 'x').min(0).max(9)
  gui.add(gltf.scene.rotation, 'y').min(0).max(9)
  gui.add(gltf.scene.rotation, 'z').min(0).max(9)
})

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#wwImgCan'),
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0xffffff, 0)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30)

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
// // const material = new THREE.MeshBasicMaterial({ color: 0x999, wireframe: true })
// const material = new THREE.MeshStandardMaterial({ color: 0x99999 })
// const torus = new THREE.Mesh(geometry, material)
// scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5, 5, 5)
const ambientLight = new THREE.AmbientLight(0xfff)
scene.add(pointLight, ambientLight)

const controls = new OrbitControls(camera, renderer.domElement)

function animate() {
  requestAnimationFrame(animate)
  // torus.rotation.y += 0.005
  controls.update()
  renderer.render(scene, camera)
}

animate()

function moveCamera() {
  // torus.rotateOnAxis.y += lenisDirection / 1
}

function onReady() {
  ScrollTrigger.create({
    markers: true,
    trigger: '.sec',
    start: '30% center',
    end: '80% center',
    animation: gsap
      .timeline({ defaults: { ease: 'none' } })
      .fromTo('#wImg', { yPercent: -45 }, { yPercent: -75 })
      .fromTo('#wwImgCan', { yPercent: -30 }, { yPercent: -65 }, '<')
      .to('.svg_fg', { yPercent: -50 }, '<'),
    // .fromTo('#svg_fg', { yPercent: -40 }, { yPercent: 180 }),
    // animation: gsap.timeline().to('#w_img', { yPercent: -80 }),
    toggleActions: 'play reverse restart reverse',
    scrub: 1,
    onUpdate: () => {
      console.log('qwe')
      // moveCamera()
    },
  })
}

if (document.readyState !== 'loading') {
  onReady()
} else {
  document.addEventListener('DOMContentLoaded', function () {
    onReady()
  })
}
