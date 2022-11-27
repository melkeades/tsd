import './styles/style.styl'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger '
import $ from 'jquery'
import * as THREE from 'three'

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

//get scroll value
lenis.on('scroll', ({ scroll }) => {
  // console.log({ scroll, limit, velocity, direction, progress })
  lenisScroll = scroll
})
function onReady() {
  ScrollTrigger.create({
    markers: true,
    trigger: '.sec',
    start: '30% center',
    end: '80% center',
    animation: gsap
      .timeline({ defaults: { ease: 'none' } })
      .fromTo('#w_img', { yPercent: -30 }, { yPercent: -70 })
      .fromTo('#svg_fg', { yPercent: -40 }, { yPercent: 180 }),
    // animation: gsap.timeline().to('#w_img', { yPercent: -80 }),
    toggleActions: 'play reverse restart reverse',
    scrub: 1,
  })
}

if (document.readyState !== 'loading') {
  onReady()
} else {
  document.addEventListener('DOMContentLoaded', function () {
    onReady()
  })
}
