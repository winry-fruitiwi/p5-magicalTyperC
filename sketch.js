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
let cardImg, cardList
let currentCardIndex

// debug text
let debugText

function preload() {
    font = loadFont('data/consola.ttf')
    scryfall = loadJSON('json/scryfall-snc.json')
    correct = loadSound("data/correct.wav")
    incorrect = loadSound("data/incorrect.wav")
}

function updateCard() {
    passage = new Passage(cardList[currentCardIndex]["typing_text"])

    cardImgURL = cardList[currentCardIndex]['png']
    cardImg = loadImage(cardImgURL)

    // print(cardList[currentCardIndex]['collector_number'])
}

function initializeCardList() {
    // a list of all Magic cards in the scryfall data set
    let cardList = []

    for (let i = 0; i < Object.keys(scryfall["data"]).length; i++) {
        let currentData = scryfall["data"][i]

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
        typingText += " " + currentData['mana_cost'] + "\n"
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
        use numpad keys to navigate the card list</pre>`)

    cardList = initializeCardList()

    // print(cardList)

    cardList.sort(sortByCollectorID)

    // a random index of my card list
    currentCardIndex = int(random(0, cardList.length))

    updateCard()
}


function draw() {
    background(234, 34, 24)
    passage.render()

    cardImg.resize(340, 0)


    // this is where the image of the card you're typing is displayed!
    const IMAGE_START_POS = new p5.Vector(
        passage.LINE_WRAP_X_POS + 10,
        passage.TOP_MARGIN
    )

    push()

    translate(IMAGE_START_POS.x, IMAGE_START_POS.y)

    image(cardImg, 0, 0)
    pop()

    displayDebugCorner()
}


/** 🧹 shows debugging info using text() 🧹 */
function displayDebugCorner() {
    textSize(14)
    const LEFT_MARGIN = 10
    const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
    const LINE_SPACING = 2
    const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING
    fill(0, 0, 100, 100) /* white */
    strokeWeight(0)


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
    }

    if (keyCode === 100) { /* numpad 4 */
        currentCardIndex--
        currentCardIndex = constrain(
            currentCardIndex, 0, scryfall["data"].length - 1
        )

        updateCard()
        return
    }

    if (keyCode === 101) { /* numpad 5 */
        currentCardIndex = int(random(0, scryfall["data"].length - 1))

        updateCard()
        return
    }

    if (keyCode === 104) { /* numpad 8 */
        currentCardIndex += 10
        currentCardIndex = constrain(
            currentCardIndex, 0, scryfall["data"].length - 1
        )

        updateCard()
        return
    }

    if (keyCode === 98) { /* numpad 2 */
        currentCardIndex -= 10
        currentCardIndex = constrain(
            currentCardIndex, 0, scryfall["data"].length - 1
        )

        updateCard()
        return
    }

    if (keyCode === 102) { /* numpad 6 */
        currentCardIndex++
        currentCardIndex = constrain(
            currentCardIndex, 0, scryfall["data"].length - 1
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
    } else if (keyCode === ENTER) {
        key = "\n"
    }

    if (key === passage.getCurrentChar()) {
        correct.play()
        passage.setCorrect()
    } else {
        incorrect.play()
        passage.setIncorrect()
    }
}
