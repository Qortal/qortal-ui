export default config => {
    // console.log(config)
    // console.log('=====================================')
    return {
        particles: {
            number: {
                value: 38,
                density: { enable: true, value_area: 1104.8066982851817 }
            },
            // color: { value: '#64ffda' },
            color: { value: config.styles.theme.colors.primary },
            shape: {
                type: 'polygon',
                // stroke: { width: 0, color: '#64ffda' },
                stroke: { width: 0, color: config.styles.theme.colors.primary },
                polygon: { nb_sides: 6 }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.1,
                    opacity_min: 0,
                    sync: true
                }
            },
            size: {
                value: 10,
                random: true,
                anim: { enable: true, speed: 6, size_min: 1, sync: false }
            },
            line_linked: {
                enable: true,
                distance: 150,
                // color: '#64ffda',
                color: config.styles.theme.colors.primary,
                opacity: 0.2,
                width: 0
            },
            move: {
                enable: true,
                // enable: false,
                speed: 4,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'bounce',
                bounce: false,
                attract: { enable: false, rotateX: 600, rotateY: 1200 }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'bubble' },
                onclick: { enable: true, mode: 'repulse' },
                resize: true
            },
            modes: {
                grab: { distance: 250, line_linked: { opacity: 1 } },
                bubble: {
                    distance: 100,
                    size: 15,
                    duration: 0.6,
                    opacity: 0.05,
                    speed: 6
                },
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 1 },
                remove: { particles_nb: 2 }
            }
        },
        retina_detect: true
    }
}
