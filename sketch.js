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
    let cnv = createCanvas(600, 300)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        [1,2,3,4,5] → no function
        z → freeze sketch</pre>`)

    passage = new Passage("hi!")

    for (let i = 0; i < Object.keys(scryfall["data"]).length; i++) {
        // a string of data that contains scryfall data.
        let typingText = scryfall["data"][i].name
        typingText += " " + scryfall["data"][i].mana_cost
        typingText += "\n" + scryfall["data"][i].oracle_text

        if (scryfall["data"][i].flavor_text !== undefined) {
            typingText += "\n" + scryfall["data"][i].flavor_text
        }

        if (scryfall["data"][i].power !== undefined &&
            scryfall["data"][i].toughness !== undefined) {
            typingText += "\n" + scryfall["data"][i].power + "/" + scryfall["data"][i].toughness
        }

        print(typingText)

        // switch between border_crop and art_crop for different aspects of art.
        // print(`${scryfall["data"][i].name} ${scryfall["data"][i]["image_uris"].border_crop}`)
    }
}


function draw() {
    background(234, 34, 24)


    displayDebugCorner()
}


/** 🧹 shows debugging info using text() 🧹 */
function displayDebugCorner() {
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