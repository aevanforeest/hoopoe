const navigationMap = {
    0: 'players',
    1: 'teams',
    2: 'games',
};

function onClickAddPlayer(event) {
    var e = event.target;
    // TODO
    console.log('Add player');
}

function onClickPlayer(event) {
    var e = event.target;
    // bubble up to .list-item
    while (!e.classList.contains('list-item') && e) {
        e = e.parentNode;
    }
    if (e) {
        // TODO
        console.log('Edit player: ' + e);
    }
}

function onTouchEndPlayer(event) {
    var e = event.target;
    // bubble up to .list-item
    while (!e.classList.contains('list-item') && e) {
        e = e.parentNode;
    }
    if (e) {
        if (Math.ceil(e.scrollLeft + e.offsetWidth) >= e.scrollWidth) {
            // TODO
            console.log('Delete player: ' + e);
        }
    }
}

function onClickNavigationBar(event) {
    var e = event.target;
    // bubble up to .navigation-item
    while (!e.classList.contains('navigation-item') && e) {
        e = e.parentNode;
    }
    if (e) {
        document.querySelector('.navigation-item.active').classList.toggle('active');
        e.classList.toggle('active');
        document.querySelector('.page.visible').classList.toggle('visible');
        document.querySelector('#' + navigationMap[[...e.parentNode.children].indexOf(e)]).classList.toggle('visible');
    }
}
