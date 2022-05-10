class Passage {
    constructor(text) {
        // the passage text
        this.text = text
        // the index of the character we're typing in our passage
        this.index = 0
        // a list of boolean values marking if the character was correct
        this.correctList = []

        // these are the constants!

        // the top margin for all text and the bounding box.
        this.TOP_MARGIN = 50

        // the x-position of the bounding box
        this.SIDE_MARGIN = 50

        // the place where the text starts relative to the bounding box
        this.TEXT_START_X = 50

        // this is where the text starts. Ideally I'd like 50 pixels of space.
        this.TEXT_START = new p5.Vector(
            this.TOP_MARGIN - textAscent(),
            this.SIDE_MARGIN + this.TEXT_START_X
        )
    }


    // displays the passage
    render() {

    }


    // have we finished the current passage?
    finished() {

    }


    // return whatever index we're at
    getCurrentChar() {

    }


    // advance after pushing true onto this.correctList
    setCorrect() {

    }


    // advance after pushing false onto our correctList
    setIncorrect() {

    }


    // advance our current character
    advance() {

    }


    /* from here, there will only be private methods */

    // increase y, reset x
    #wrapCursor() {

    }


    // show the bar over our current word
    #showCurrentWordBar(char_pos) {

    }


    // show the cursor of the letter we're currently on
    #showTextCursor(char_pos) {

    }


    // wrap cursor if position is over LINE_WRAP_X_POS
    #handleNewLines() {

    }


    #showHighlightBox(i, cursor) {

    }
}
