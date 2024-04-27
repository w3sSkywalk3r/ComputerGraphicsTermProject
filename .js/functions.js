
function rectCollision({rectangle1, rectangle2}) {
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        && rectangle1.isAttacking
    )
}



function winner() {
    document.querySelector('#displayText').style.display = 'flex'
        document.querySelector('#displayText').innerText = 'WINNER'
}

function loser() {
    document.querySelector('#displayText').style.display = 'flex'
    document.querySelector('#displayText').innerText = 'LOSER'
}

//Decrease countdown timer
// let timer = 60;
// let timerId
// function countfdown() {
//     if (timer > 0) {
//         timerId = setTimeout(countdown, 1000)
//         timer--;
//         document.querySelector('#timer').innerText = timer;
//     }

//     if(timer === 0) {
//         winner({player, enemy})
//     }
// }
