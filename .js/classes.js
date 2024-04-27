
class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}) {
        this.position = position;
        this.width = 50;
        this.height = 150
        this.image = new Image();
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    //Draw player and enemy sprites and attackBox
    draw() {
        context.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width/this.framesMax), 
            0, 
            this.image.width/this.framesMax, 
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width/this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++;
        if(this.framesElapsed % this.framesHold === 0) {
            if(this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
    }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({position,
         velocity, 
         color = 'red', 
         imageSrc,
         scale=1, 
         framesMax=1,
         offset = {x: 0, y: 0},
         sprites    
        })
        {
            super({imageSrc, framesMax, position, offset, scale})
            this.lastKey;
            this.velocity = velocity;
            this.width = 50;
            this.height = 150
            this.attackBox = {
                position: {
                    x: this.position.x,
                    y: this.position.y
                },
                offset,
                width: 100,
                height: 50
            }
            this.color = color
            this.isAttacking = false;
            this.health = 100;
            this.framesCurrent = 0
            this.framesElapsed = 0
            this.framesHold = 5
            this.sprites = sprites

            for(const sprite in this.sprites) {
                sprites[sprite].image = new Image();
                sprites[sprite].image.src = sprites[sprite].imageSrc
            }
            console.log(this.sprites)
        }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height - 75) {
            this.velocity.y = 0;
            this.position.y = 351
        } else
        {
            this.velocity.y += gravity;
        }

        this.animateFrames()
    }

    hits(letter) {
        const fighterRight = this.attackBox.position.x + this.attackBox.offset.x;
        const fighterBottom = this.attackBox.position.y;;
        const letterRight = letter.position.x + letter.width;
        const letterBottom = letter.position.y + letter.height;

        if(fighterRight < letter.position.x || this.position.x > letterRight || fighterBottom < letter.position.y || this.position.y > letterBottom) {
            return false;
        }

        return true;
    }
    
    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }

    switchSprite(sprite) {
        if(this.image === this.sprites.attack1.image 
            && this.framesCurrent < this.sprites.attack1.framesMax - 1) return
        switch(sprite) {
            case 'idle':
                if(this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'run':
                if(this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jump':
                if(this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'fall':
                if(this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'attack1':
                if(this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
    }
    }
}

class Letter {
    constructor({letter, position, color = 'black', existingBlocks, velocity, databaseWord}) {
        this.width = 50;
        this.height = 50;
        this.letter = this.getRandomLetter(databaseWord);
        this.position = this.getRandomPosition(existingBlocks);
        this.color = color;
        this.velocity = velocity
    }

    getRandomLetter(databaseWord) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const repeatFactor = 3;
        const randomWord = databaseWord.repeat(repeatFactor);
        const combinedLetters = letters.slice(0, letters.length - randomWord.length) + randomWord;
        return combinedLetters[Math.floor(Math.random() * combinedLetters.length)];
    }

    getRandomPosition(existingBlocks) {
        let position;
        do {
            position = {
                x: Math.random() * 1024, // replace canvasWidth with the width of your canvas
                y: 0 // assuming the block is generated at the top of the screen
            };
        } while (this.isColliding(position, existingBlocks));
        return position;
    }

    isColliding(position, existingBlocks) {
        for (let block of existingBlocks) {
            if (Math.abs(block.position.x - position.x) < 50) {
                return true;
            }
        }
        return false;
    }

    draw() {
        // Draw the rectangle
        context.fillStyle = 'white'; // Change this to the color you want for the block
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    
        // Draw the letter
        context.font = '30px Arial';
        context.fillStyle = this.color;
        let textWidth = context.measureText(this.letter).width;
        let x = this.position.x + this.width / 2 - textWidth / 2;
        let y = this.position.y + this.height / 2 + 10; // Adjust 10 as needed
        context.fillText(this.letter, x, y);
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x = this.position.x
    }
}