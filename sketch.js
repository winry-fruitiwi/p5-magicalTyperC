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

    for (let i = 0; i < Object.keys(scryfall["data"]).length; i++) {
        // a string of data that contains scryfall data.
        let typingText = scryfall["data"][i].name
        typingText += " " + scryfall["data"][i].mana_cost
        typingText += "\n" + scryfall["data"][i].type_line
        typingText += "\n" + scryfall["data"][i].oracle_text

        if (scryfall["data"][i].flavor_text !== undefined) {
            typingText += "\n" + scryfall["data"][i].flavor_text
        }

        if (scryfall["data"][i].power !== undefined &&
            scryfall["data"][i].toughness !== undefined) {
            typingText += "\n" + scryfall["data"][i].power
            typingText += "/" + scryfall["data"][i].toughness
        }

        // print(typingText)
    }

    passage = new Passage("This unit's line wrapping works. This is supposed" +
        " to be a test message. Currently, typing is not supported, but you" +
        " will still see this message displayed. In my Github repository," +
        " this will also display, and with proper technology you may be" +
        " able to run this program. End of message, W-1000")
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