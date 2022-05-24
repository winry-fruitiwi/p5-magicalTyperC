// stops error generation for constants I don't use. I can choose to take it
// away if I really want to check.

// noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols, GrazieInspection

class Passage {
    constructor(text) {
        // the passage text, plus a space at the end to stop a bug in word wrap.
        this.text = text + " "
        // the index of the character we're typing in our passage. Not yet used.
        this.index = 0
        // a list of boolean values marking if the character was correct
        this.correctList = []

        // these are the constants!

        // the top margin for all text and the bounding box.
        this.TOP_MARGIN = 50

        // the x-position of the bounding box
        this.X_MARGIN = 50

        // the place where the text starts relative to the bounding box
        this.TEXT_START_X = 50

        // the distance from the top of the bounding box to the tallest
        // character in the current font, which is consola.
        this.DIST_FROM_BOX_TOP = 100 - textAscent() - this.TOP_MARGIN

        // the position of x where we wrap the line. Ziatora's card's width
        // is around 480 pixels, but I'm probably going to scale it down by
        // a factor of 2. That means I need 240 pixels of space. I'd like
        // another 80 just so that I can have a border of 40 pixels around
        // Ziatora's image and then have that be where the text wraps.
        // UPDATE: Actually, the card's width will be resized to 340.
        this.LINE_WRAP_X_POS = width - 420

        // this is where the text starts. Ideally I'd like 50 pixels of space.
        this.TEXT_START = new p5.Vector(
            this.X_MARGIN + this.TEXT_START_X,
            this.TOP_MARGIN + this.DIST_FROM_BOX_TOP
        )

        // the spacing between lines, where the constant is an extra buffer.
        this.DIST_BETWEEN_LINES = 10 + textAscent() + textDescent()
    }


    // displays the passage
    render() {
        // set the font size
        textSize(24)

        // this is where our text will be drawn. It can always be modified.
        let cursor = this.TEXT_START.copy()

        // a list of character positions, for use while showing the current
        // word bar. Later you can retrieve a character and get its position.
        let charPosList = []

        for (let i = 0; i < this.text.length; i++) {
            // retrieve our current character and display it
            let currentChar = this.text[i]

            // append the current position to our character position list
            charPosList.push(cursor.copy())

            if (i === this.index) {
                strokeWeight(2.5)
                stroke(0, 0, 100)
                line(
                    cursor.x,
                    cursor.y + 3,
                    cursor.x + textWidth(currentChar),
                    cursor.y + 3
                )

                noStroke()

                // set the last delimiter to the current character if it's a
                // space, which will help with displaying the current word bar.
                if (this.text[this.index] === ' ')
                    this.lastDelimiter = this.index
            }

            // if the current letter will go past our line wrap x position,
            // we need to wrap our text around. Currently, my program is
            // incapable of retaining words and spacing. Later, I'll fix that.
            // if (textWidth(currentChar) + cursor.x >= this.LINE_WRAP_X_POS) {
            //     this.#wrapCursor(cursor)
            // } // This is character wrap. Now I'll work on word wrap.

            fill(0, 0, 100)
            text(currentChar, cursor.x, cursor.y)

            // if the correct list contains my index, check correctList[i].
            if (i < this.correctList.length) {
                if (this.correctList[i] === true) {
                    fill(89, 100, 78, 30)
                } else {
                    fill(0, 66, 78, 30)
                }

                rect(
                    cursor.x,
                    cursor.y - textAscent() - 1,
                    textWidth(currentChar),
                    textAscent() + textDescent() + 1,
                    3
                )
            }

            if (currentChar === "\n") {
                this.#wrapCursor(cursor)
                continue
            }

            // if the current letter is a space, we can find the next space.
            if (currentChar === " ") {
                // if we don't increment i by one, this will return i
                let nextSpace = this.text.indexOf(" ", i + 1)

                // find the substring from our current delimiter to the next
                let currentWord = this.text.substring(
                    i, nextSpace
                )

                if (textWidth(currentWord) + cursor.x >= this.LINE_WRAP_X_POS) {
                    this.#wrapCursor(cursor)

                    // prevents extra unnecessary wrapping
                    continue
                }
            }

            // increment our cursor's x-position.
            cursor.x += textWidth(currentChar) + 1
        }


        this.#showCurrentWordBar(charPosList)
    }


    // have we finished the current passage?
    finished() {

    }


    // return whatever character we're at based on our index
    getCurrentChar() {
        return this.text[this.index]
    }


    // advance after pushing true onto this.correctList
    setCorrect() {
        this.correctList.push(true)
        this.advance()
    }


    // advance after pushing false onto our correctList
    setIncorrect() {
        this.correctList.push(false)
        this.advance()
    }


    // advance our current character
    advance() {
        this.index++
    }


    /* from here, there will only be private methods */


    // increase y, reset x
    #wrapCursor(cursor) {
        cursor.x = this.TEXT_START.x
        cursor.y += this.DIST_BETWEEN_LINES + 2
    }


    // show the bar over our current word
    #showCurrentWordBar(charPosList) {
        /* find the two spaces/newlines on either side of the index. */

        // find the indices of the last space and the last newline.
        let lastSpace = this.text.lastIndexOf(' ', this.index - 1)
        let lastNewline = this.text.lastIndexOf('\n', this.index - 1)

        // then we find which number is smaller using the max function!
        // However, we can shorten the algorithm from 7 lines to 3 by adding
        // one to the result. This clever hack happens to work; if neither a
        // space nor newline exists behind the index, then max will return
        // -1 and adding one will make it 0. Otherwise, it'll return one
        // plus whichever index was larger.
        let leftDelimiterPlusOne = max(lastNewline, lastSpace) + 1

        // find the next space and newline, then compare the two indices
        // using min
        let nextSpace = this.text.indexOf(' ', this.index)
        let nextNewline = this.text.indexOf('\n', this.index)

        // we have to check if the next space or the next newline does not
        // exist! Otherwise, if one value is -1, the result of min will be -1.
        if (nextSpace === -1) {
            nextSpace = this.text.length - 1
        }

        if (nextNewline === -1) {
            nextNewline = this.text.length - 1
        }

        let rightDelimiter = min(nextSpace, nextNewline)

        /* find the current word, including the right delimiter */


        // the left delimiter exclusion/inclusion takes care of itself.
        let charPosLeftDelimiter = charPosList[leftDelimiterPlusOne]

        // find the character position of the right delimiter, then add the
        // text width of a space to the right delimiter because that's not
        // included otherwise.
        let charPosRightDelimiter = charPosList[rightDelimiter]
        charPosRightDelimiter.x += textWidth(' ')

        stroke(0, 0, 100)
        strokeWeight(3)

        // draw a line from the x-position of the left delimiter to the
        // x-position of the right delimiter. However, the y-coordinate
        // should be the y-coordinate of the index to avoid diagonal lines.
        // Also I should subtract a text ascent because the line will start at
        // the base of the text instead of hovering above.

        let indexPositionY = charPosList[this.index].y - textAscent() - 5

        line(
            charPosLeftDelimiter.x,
            indexPositionY,
            charPosRightDelimiter.x,
            indexPositionY
        )

        noStroke() // reset the stroke so that it doesn't carry over
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
