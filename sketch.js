/**
 *  @author
 *  @date 2022.05.
 *
 *  notes:
 *      keep track of current "location" in card list
 *      left arrow: subtract 1
 *      right arrow: add 1
 *      up arrow: add 10
 *      down arrow: subtract 10
 *
 *  symbols to be typed in cards:
 *      • = *
 *      — = -
 */


let font, scryfall
let instructions
// the passage
let passage
let correct, incorrect
let cardImgURL
let cardImg, cardList = []
let currentCardIndex = 8
const CARD_IMG_WIDTH = 340
const CARD_HORIZONTAL_MARGIN = 50

// debug text
let debugText = "Hi! This hasn't been set yet."

function preload() {
    // request string
    let req = "https://api.scryfall.com/cards/search?q=set:woe"

    font = loadFont('data/consola.ttf')
    scryfall = loadJSON(req)
    correct = loadSound("data/correct.wav")
    incorrect = loadSound("data/incorrect.wav")
}

function updateCard() {
    passage = new Passage(cardList[currentCardIndex]["typing_text"])

    cardImgURL = cardList[currentCardIndex]['png']
    cardImg = loadImage(cardImgURL)

    // print(cardList[currentCardIndex]['collector_number'])
}

// callback function for loadJSON
function gotData(data) {
    cardList = cardList.concat(initializeCardList(data))

    if (data["has_more"]) {
        loadJSON(data["next_page"])
    }
}

function initializeCardList(data) {
    let cardList = []

    // a list of all Magic cards in the scryfall data set
    for (let i = 0; i < Object.keys(data["data"]).length; i++) {

        let currentData = data["data"][i]

        if (currentData['rarity'] === 'common' || currentData['rarity'] === 'uncommon') {
            print(currentData['name'])
            // an object composing of all the card data I'll need, and you can
            // just access its values!
            let card = {
                'name': currentData['name'],
                'mana_cost': currentData['mana_cost'],
                'type_line': currentData['type_line'],
                'oracle_text': currentData['oracle_text'],
                'png': currentData['image_uris']['png']
            }

            // a string of data that contains scryfall data.
            let typingText = currentData['name']
            typingText += " " + currentData['mana_cost']
            typingText += "\n" + currentData['type_line']
            typingText += "\n" + currentData['oracle_text']

            if (currentData['flavor_text'] !== undefined) {
                typingText += "\n" + currentData['flavor_text']
                card['flavor_text'] = currentData['flavor_text']
            }

            if (currentData['power'] !== undefined &&
                currentData['toughness'] !== undefined) {
                typingText += "\n" + currentData['power']
                typingText += "/" + currentData['toughness']
                card['power'] = currentData['power']
                card['toughness'] = currentData['toughness']
            }

            // typingText += "\n" + currentData['collector_number']
            card['collector_number'] = currentData['collector_number']

            card["typing_text"] = typingText

            // print(typingText)

            cardList.push(card)
        }
    }

    return cardList
}

// a sorting method that compares two cards' collector ID.
function sortByCollectorID(a, b) {
    let aCollectorID = a['collector_number']
    let bCollectorID = b['collector_number']

    // subtract the two IDs and return the result
    return aCollectorID - bCollectorID
}

function setup() {
    let cnv = createCanvas(1280, 640)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        [1,2,3,4,5] → no function
        pressing escape freezes sketch
        adjusting sound leads to incorrect key presses
        use numpad keys to navigate the card list
        bullet points can be typed with *
        dashes can be typed with a hyphen
        </pre>`)

    cardList = initializeCardList(scryfall)

    if (scryfall["has_more"]) {
        loadJSON(scryfall["next_page"], gotData)
    }

    updateCard()
}


function draw() {
    background(234, 34, 24)
    if (cardList) {
        if (passage) {
            passage.render()

            // resize the card image. the second argument being 0 means
            // "proportionally scale me, please!", not "make me a straight line!"
            cardImg.resize(CARD_IMG_WIDTH, 0)


            // this is where the image of the card you're typing is displayed!
            const IMAGE_START_POS = new p5.Vector(
                passage.LINE_WRAP_X_POS + CARD_HORIZONTAL_MARGIN,
                passage.TEXT_START.y
            )

            push()

            translate(IMAGE_START_POS.x, IMAGE_START_POS.y)

            image(cardImg, 0, 0)
            pop()
        }

        displayDebugCorner()
    }
}


/** 🧹 shows debugging info using text() 🧹 */
function displayDebugCorner() {
    textSize(14)
    const LEFT_MARGIN = 10
    const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
    const LINE_SPACING = 2
    const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING
    fill(0, 0, 100, 100) /* white */
    noStroke()


    text(`frameCount: ${frameCount}`,
        LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT)
    text(`debug text: ${debugText}`,
        LEFT_MARGIN, DEBUG_Y_OFFSET)
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === ESCAPE) {
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
        return
    }

    if (keyCode === 100 || keyCode === LEFT_ARROW) { /* numpad 4/left arrow */
        currentCardIndex--
        currentCardIndex = constrain(
            currentCardIndex, 0, cardList.length - 1
        )

        updateCard()
        return
    }

    if (keyCode === 101 || keyCode === 93) { /* numpad 5 or context menu */
        currentCardIndex = int(random(0, cardList.length - 1))

        updateCard()
        return
    }

    if (keyCode === 104 || keyCode === UP_ARROW) { /* numpad 8/up arrow */
        currentCardIndex -= 10
        currentCardIndex = constrain(
            currentCardIndex, 0, cardList.length - 1
        )

        updateCard()
        return
    }

    if (keyCode === 98 || keyCode === DOWN_ARROW) { /* numpad 2/down arrow */
        currentCardIndex += 10
        currentCardIndex = constrain(
            currentCardIndex, 0, cardList.length - 1
        )

        updateCard()
        return
    }

    if (keyCode === 102 || keyCode === RIGHT_ARROW) { /* numpad 6 */
        currentCardIndex++
        currentCardIndex = constrain(
            currentCardIndex, 0, cardList.length - 1
        )

        updateCard()
        return
    }

    if (keyCode === SHIFT ||
        keyCode === ALT ||
        keyCode === CONTROL ||
        keyCode === TAB ||
        keyCode === ESCAPE
    ) {
        return
    }

    else if (keyCode === ENTER) {
        key = "\n"
    }

    if (key === passage.getCurrentChar()) {
        correct.play()
        passage.setCorrect()
    }
    else {
        incorrect.play()
        passage.setIncorrect()
    }
}

// prevents the context menu from showing up, even when the document
// context menu key is pressed (which I use for scrolling the card list).
document.oncontextmenu = function() {
    return false;
}
