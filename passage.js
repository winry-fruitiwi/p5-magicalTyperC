class Passage {
    constructor(text) {
        // the passage text
        this.text = text
        // the index of the character we're typing in our passage
        this.index = 0
        // a list of boolean values marking if the character was correct
        this.correctList = []

        // these are the comments!
    }


    // displays the passage
    render() {
        // this is a shell, so I'm only initiating the variables and functions.
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
