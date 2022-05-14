/**
 *  @author
 *  @date 2022.05.
 *
 *
 */
let font, scryfall
let instructions
// the passage
let passage

function preload() {
    font = loadFont('data/consola.ttf')
    scryfall = loadJSON('json/scryfall-snc.json')
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
            'oracle_text': currentData['oracle_text']
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

        print(typingText)

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
    let cnv = createCanvas(900, 600)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        [1,2,3,4,5] → no function
        z → freeze sketch</pre>`)

    let cardList = initializeCardList()

    print(cardList)

    cardList.sort(sortByCollectorID)

    // a random index of my card list
    let randomCardIndex = int(random(0, cardList.length))

    passage = new Passage(cardList[randomCardIndex]["typing_text"])
}


function draw() {
    background(234, 34, 24)
    passage.render()

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
    text(`frameRate: ${frameRate().toFixed(1)}`,
        LEFT_MARGIN, DEBUG_Y_OFFSET)
}


function keyPressed() {
    /* stop sketch */
    if (key === 'z') {
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }
}