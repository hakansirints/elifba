# Page-turn renderer

StPageFlip / page-flip 2.0.7, MIT licensed.
Source: https://github.com/Nodlik/StPageFlip

`page-flip.browser.js` and `LICENSE` are copied from the npm package locked in
`package-lock.json`. When updating the dependency, update these two files together.
The reader hosts this renderer in a temporary iframe, which is removed at the end
of each turn so its animation loop and event listeners are disposed with it.
