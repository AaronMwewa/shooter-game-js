const canvasEl = document.querySelector('canvas')
const c = canvasEl.getContext('2d')
    //html elements
const smallScoreEl = document.querySelector('#smallScore')
const bigScoreEl = document.querySelector('.bigScore-el')
const boxEl = document.querySelector('.box')
const StartGameBtn = document.querySelector('.start')
let score = 0
canvasEl.width = 1400; //window.innerWidth
canvasEl.height = 720; //window.innerHeight
locationX = canvasEl.width / 2
locationY = canvasEl.height / 2

class Player {
    constructor(radius, color) {
        this.x = locationX
        this.y = locationY
        this.color = color
        this.radius = radius
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 360, false)
        c.fillStyle = this.color
        c.fill()

    }
}
class Bullets {
    constructor(x, y, radius, color, velocity) {
        this.x = x //canvasEl.width / 2
        this.y = y //canvasEl.height / 2
        this.color = color
        this.radius = radius
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 360, false)
        c.fillStyle = this.color
        c.fill()

    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}
class Target {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 360, false)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}
class Particle {
    constructor(x, y, color, velocity) {
        this.x = x
        this.y = y
        this.radius = 2
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 360, false)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw()
        let friction = 0.9
        this.velocity *= friction
        this.velocity *= friction
    }
}
//creating player
let player1 = new Player(15, 'white')
let bulletsArray = []
let targetsArray = []
    //let particlesArray = []

//clicking in order to create bullets to shoot

addEventListener('click', (event) => {
    let bulletSpeed = 5
    let angle = Math.atan2(event.clientY - locationY, event.clientX - locationX)
    let CurrentVelocity = {
        x: Math.cos(angle) * bulletSpeed,
        y: Math.sin(angle) * bulletSpeed
    }
    bulletsArray.push(new Bullets(locationX, locationY, 5, 'white', CurrentVelocity))
})

function drawBulletsOnScreen() {
    bulletsArray.forEach((bullet, index) => {
        bullet.update()
            // removing bullet from screen
        if (bullet.x - bullet.radius < 0 ||
            bullet.x - bullet.radius > canvasEl.width ||
            bullet.y - bullet.radius < 0 ||
            bullet.y - bullet.radius > canvasEl.height) {
            bulletsArray.splice(index, 1)
        }
    })
}

function createTargets() {
    setInterval(() => {
        // generating random cordinates for the targets
        let radius = (Math.random() * 25) + 15
        let XCor = 0
        let YCor = 0
        let targetSpeed = 1
        let color = `hsl(${Math.random()*360},50%,70%)`
        if (Math.random() < .5) {
            XCor = Math.random() < .5 ? 0 - radius : canvasEl.width + radius
            YCor = Math.random() * canvasEl.height
        } else {
            XCor = Math.random() * canvasEl.width
            YCor = Math.random() < .5 ? 0 - radius : canvasEl.height + radius

        }
        let angle = Math.atan2(locationY - YCor, locationX - XCor)
        let tragetVelocity = {
            x: Math.cos(angle) * targetSpeed,
            y: Math.sin(angle) * targetSpeed
        }
        targetsArray.push(new Target(XCor, YCor, radius, color, tragetVelocity))


    }, 1000)
}

function drawTargetOnScreen() {
    targetsArray.forEach((tar) => {
        tar.update()

    })


}

function checkingImpacts() {
    //checking weather target hits player or bullet
    targetsArray.forEach((target, indexTarget) => {
        let hitPlayer = Math.hypot(player1.x - target.x, player1.y - target.y)
        if (hitPlayer - target.radius - player1.radius < 1) {
            // stop animation of the game
            cancelAnimationFrame(animationFrame)
            boxEl.style.display = 'flex'

        }
        bulletsArray.forEach((bullet, indexBullet) => {
            let hitBullet = Math.hypot(bullet.x - target.x, bullet.y - target.y)
            if (hitBullet - target.radius - bullet.radius < 1) {
                targetsArray.splice(indexTarget, 1)
                bulletsArray.splice(indexBullet, 1)
                score += 100
                smallScoreEl.innerHTML = score
                bigScoreEl.innerHTML = score
                    //   //  particlesArray.forEach((particle) => {
                    //         // for (let i = 0; i = 5; i++) {

                //         //     particlesArray.push(new Particle(XCor, YCor, color, { x: Math.random() - .5, y: Math.random() - .5 }))
                //         // }
                //         // particle.update()
                //     })
            }

        })
    })
}

function clearGAme() {
    //sets game to zero
    player1 = new Player(15, 'white')
    bulletsArray = []
    targetsArray = []
    score = 0
    bigScoreEl.innerHTML = 0
    smallScoreEl.innerHTML = 0


}

let animationFrame
    //animating game elements
function animate() {
    animationFrame = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0,0,0,0.2)'
    c.fillRect(0, 0, canvasEl.width, canvasEl.height)
    player1.draw()
    drawBulletsOnScreen()
    drawTargetOnScreen()
    checkingImpacts()

}
//all the function that run the game will be placed here
function GameBois() {
    createTargets()
    animate()
}

StartGameBtn.addEventListener('click', function() {
    clearGAme()
    GameBois()
    boxEl.style.display = 'none'
    console.log('started')
})