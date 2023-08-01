'use strict'

// TODO: Render the cinema (7x15 with middle path)
// TODO: implement the Seat selection flow
// TODO: Popup shows the seat identier - e.g.: 3-5 or 7-15
// TODO: Popup should contain seat price (for now 4$ to all) 
// TODO: allow booking the seat ('S', 'X', 'B')
// TODO: Uplift your model - each seat should have its own price... 
// TODO: in seat details, show available seats around 
// TODO: Upload to GitHub Pages

var gCinema
var gElSelectedSeat = null
let gMarkedTimeOut;

function onInit() {
    gCinema = createCinema()
    renderCinema()
}

function createCinema() {
    const cinema = []
    for (var i = 0; i < 6; i++) {
        cinema[i] = []
        for (var j = 0; j < 10; j++) {
            const cell = {
                isSeat: (j !== 7 && j !== 2 && i !== 3)
            }
            if (cell.isSeat) {
                cell.price = 5 + i
                cell.isBooked = false
                cell.isMarked = false
            }
            cinema[i][j] = cell
        }
    }
    cinema[4][4].isBooked = true
    return cinema
}

function renderCinema() {
    var strHTML = ''
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            const cell = gCinema[i][j]
            var className = (cell.isSeat) ? 'seat' : ''
            if (cell.isBooked) {
                className += ' booked'
            }
            let title = `Seat: ${i + 1}, ${j + 1}`

            if (!cell.isSeat) {
                title = `Pass: ${i + 1}, ${j + 1}`
            }

            strHTML += `\t<td data-i="${i}" data-j="${j}"
             title="${title}" class="cell ${className}" 
                            onclick="onCellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }

    const elSeats = document.querySelector('.cinema-seats')
    elSeats.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    const cell = gCinema[i][j]
    if (!cell.isSeat || cell.isBooked) return

    elCell.classList.add('selected')

    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
        removeMarkedSeats()
    }

    gElSelectedSeat = (gElSelectedSeat !== elCell) ? elCell : null

    if (gElSelectedSeat) {
        showSeatDetails({ i, j })
    } else {
        removeMarkedSeats()
        hideSeatDetails()
    }
}

function showSeatDetails(pos) {
    const elPopup = document.querySelector('.popup')
    const seat = gCinema[pos.i][pos.j]
    elPopup.querySelector('h2 span').innerText = `${pos.i + 1}-${pos.j + 1}`
    elPopup.querySelector('h3 span').innerText = `${seat.price}`
    elPopup.querySelector('h4 span').innerText = countAvailableSeatsAround(gCinema, pos.i, pos.j)
    const elBtn = elPopup.querySelector('.book-seat')
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j
    elPopup.hidden = false
}

function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
}

function onBookSeat(elBtn) {
    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j

    gCinema[i][j].isBooked = true
    renderCinema()
    hideSeatDetails()
}

function countAvailableSeatsAround(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isSeat && !currCell.isBooked) count++
        }
    }
    return count
}

function highlightAvailableSeatsAround() {

    let rowIdx = +gElSelectedSeat.dataset.i
    let colIdx = +gElSelectedSeat.dataset.j

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gCinema.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gCinema[i].length) continue
            const cell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            var currCell = gCinema[i][j]
            if (currCell.isSeat && !currCell.isBooked) {
                gCinema[i][j].isMarked = true
                cell.classList.add('marked')
                console.log('marked');
            }
        }
    }
    gMarkedTimeOut = setTimeout(removeMarkedSeats, 2500)
}

function removeMarkedSeats() {
    for (let i = 0; i < gCinema.length; i++) {
        for (let j = 0; j < gCinema[i].length; j++) {
            const cell = gCinema[i][j]
            if (cell.isMarked) {
                const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                cell.isMarked = false
                elCell.classList.remove('marked')
            }
        }
    }
    clearInterval(gMarkedTimeOut)
}

function closePopUp() {
    hideSeatDetails()
    removeMarkedSeats()
    gElSelectedSeat = null
    renderCinema()
}

