

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
let currentWord = "";
let databaseWord = "";

window.onload = function() {
    fetch('http://localhost:3000/random-word')
        .then(response => response.text())
        .then(word => {
            console.log(word); // Log the word to the console
            const wordDiv = document.querySelector('#word');
            console.log(wordDiv); // Log the div to the console
            wordDiv.innerText = word; // Set the text content of the div
            databaseWord = word;
        });
};

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/Forest.png'
    }
)

//Declare player and enemy sprites
const player = new Fighter({
    position:{
        x: 35,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/Ronin/Sprites/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 160
    },
    sprites: {
        idle: {
            imageSrc: './assets/Ronin/Sprites/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/Ronin/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/Ronin/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/Ronin/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/Ronin/Sprites/Attack1.png',
            framesMax: 6
        }
        }

    });

    const enemy = new Fighter({
        position:{
            x: 400,
            y: 100
        },
        velocity: {
            x: 0,
            y: 0
        },
        offset: {
            x: 0,
            y: 0
        },
        // imageSrc: './assets/Oni/Sprites/Idle.png',
        // framesMax: 4,
        // scale: 2.5,
        // offset: {
        //     x: 215,
        //     y: 160
        // },
        // sprites: {
        //     idle: {
        //         imageSrc: './assets/Oni/Sprites/Idle.png',
        //         framesMax: 4
        //     },
        //     run: {
        //         imageSrc: './assets/Oni/Sprites/Run.png',
        //         framesMax: 8
        //     },
        //     jump: {
        //         imageSrc: './assets/Oni/Sprites/Jump.png',
        //         framesMax: 2
        //     },
        //     fall: {
        //         imageSrc: './assets/Oni/Sprites/Fall.png',
        //         framesMax: 2
        //     },
        //     attack1: {
        //         imageSrc: './assets/Oni/Sprites/Attack1.png',
        //         framesMax: 4
        //     }
           // }
    
        });

//Populate player and enemy on screen
player.draw();

enemy.draw();

//Populate letter blocks on screen
let blocks = []; // This should be your actual array of existing blocks

// Function to create a new block
setInterval(() => {
    let block = new Letter({
        position: { x: Math.random() * 1024, y: 0 }, // Random x position, start at top of canvas
        color: 'black', // Replace with the actual color
        existingBlocks: blocks, // Pass the blocks array
        velocity: { x: 0, y: 1 }, // Replace with the actual velocity
        databaseWord: databaseWord
    });

    blocks.push(block); // Add the block to the blocks array
}, 5000);



const keys = {
    a: {
        pressed:false
    },
    d: {
        pressed:false
    },
    w: {
        pressed:false
    },
    right: {
        pressed:false
    }, 
    left: {
        pressed:false
    },
    up: {
        pressed:false
    }
}
let lastKey;
let enemyLastKey;

//countdown()
let currentIndex = 0;
function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.draw();
    player.update();
   // enemy.update();

   for (let i = blocks.length - 1; i >= 0; i--) {
    let block = blocks[i];
    block.update();
    block.draw(context);

    // If the block has fallen off the screen, remove it from the array
    if (block.position.y > canvas.height) {
        console.log(`Removing block at index ${i} with position ${block.position.y}`);
        blocks.splice(i, 1);
    }
}

    player.velocity.x = 0;
    enemy.velocity.x = 0;

//Player movement
    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run')
    }
    else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    }
    else if(keys.w.pressed && player.lastKey === 'w') {
        player.velocity.y = -10
    } else {
        player.switchSprite('idle')
    }

    //Jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    
//Enemy movement
    if(keys.right.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }
    else if(keys.left.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }
    else if(keys.up.pressed && enemy.lastKey === 'ArrowUp') {
        enemy.velocity.y = -10
    }

    //Jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //Detect for collision
    // if(rectCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking) {
    //     console.log('hit')
    //     player.isAttacking = false;
    //     enemy.health -= 10;
    //     document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    // }
    
    let hitBlockIndex = -1;
    
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        if (player.hits(block) && player.isAttacking) {
            console.log('hit', block.letter)
            player.isAttacking = false;
    
            if (block.letter === databaseWord[currentIndex]) {
                console.log(databaseWord[1])
                currentWord += block.letter;
                console.log(currentWord);
                currentIndex++;
    
                if (currentWord === databaseWord) {
                    console.log("Word spelled correctly!");
                    winner()
                    // Reset the current word and index
                    currentWord = "";
                    currentIndex = 0;
                }
            } else {
                console.log("Incorrect letter!");
                // Reset the current word and index
                enemy.health -= 10;
                document.querySelector('#enemyHealth').style.width = enemy.health + '%';
                player.health -= 10;
                document.querySelector('#playerHealth').style.width = player.health + '%';
                currentWord = "";
                currentIndex = 0;
            }

            if(enemy.health <= 0 || player.health <= 0) {
                loser()
            }
    
            // Store the index of the block that was hit
            hitBlockIndex = i;
            // Stop the loop as we've found the block that was hit
            break;
        }
    }
    
    // If a block was hit, remove it from the blocks array
    if (hitBlockIndex !== -1) {
        blocks.splice(hitBlockIndex, 1);
    }

    // if(rectCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking) {
    //     console.log(' enemy hit')
    //     enemy.isAttacking = false;
    //     player.health -= 10;
    //     document.querySelector('#playerHealth').style.width = player.health + '%';
    // }

    //end game if health is 0
    if(enemy.health <= 0 || player.health <= 0) {
        loser()
    }

}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break
        case 'w':
            keys.w.pressed = true;
            player.lastKey = 'w';
            break
        case 's':
            player.attack();
            break
    }

    switch (event.key) {
        case 'ArrowRight':
            keys.right.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break   
        case 'ArrowLeft':
            keys.left.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break
        case 'ArrowUp':
            keys.up.pressed = true;
            enemy.lastKey = 'ArrowUp';
            break 
        case 'ArrowDown':
            enemy.attack();
            break
    }
         
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            break
        case 'w':
            keys.w.pressed = false;
            break
    }

    switch (event.key) {
        case 'ArrowRight':
            keys.right.pressed = false;
            break   
        case 'ArrowLeft':
            keys.left.pressed = false;
            break
        case 'ArrowUp':
            keys.up.pressed = false;
            break 
    }
});
