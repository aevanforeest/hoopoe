const players = {
    'd72fba2e-2855-4b82-aa49-612ee5e13a9a': { number: 4,  name: 'David' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9b': { number: 5,  name: 'Boris' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9c': { number: 6,  name: 'Gian' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9d': { number: 7,  name: 'Tibe' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9e': { number: 8,  name: 'Alexander' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9f': { number: 9,  name: 'Felix' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa0': { number: 10, name: 'Jiliam-James' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa1': { number: 11, name: 'Enzo' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa2': { number: 12, name: 'Jonathan' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa3': { number: 13, name: 'Imme' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa4': { number: 15, name: 'Filippo' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa5': { number: 14, name: 'Dennis' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa6': { number: 14, name: 'Jip' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa7': { number: 14, name: 'Lucas' },
};

// function generateUuid() {
//     var dt = new Date().getTime();
//     var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = (dt + Math.random() * 16) % 16 | 0;
//         dt = Math.floor(dt / 16);
//         return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//     });
//     return uuid;
// }

function initPlayerList() {
    const playerList = document.querySelector('#player-list');
    while (playerList.hasChildNodes()) {
        playerList.removeChild(playerList.firstChild);
    }
    Object.keys(players).sort(function(a, b) {
        return (players[a].name > players[b].name ? 1 : -1);
    }).forEach((uuid) => {
        const player = players[uuid];
        const li = document.createElement('div');
        li.classList.add('list-item');
        li.id = uuid;
        const lis = document.createElement('div');
        lis.classList.add('list-item-slider');
        const lp = document.createElement('div');
        lp.classList.add('list-player');
        const lnr = document.createElement('div');
        lnr.classList.add('list-number');
        lnr.innerText = player.number;
        lp.appendChild(lnr);
        const lnm = document.createElement('div');
        lnm.classList.add('list-name');
        lnm.innerText = player.name;
        lp.appendChild(lnm);
        lis.appendChild(lp);
        li.appendChild(lis);
        const i = document.createElement('i');
        i.classList.add('bx', 'bx-trash');
        li.append(i);
        playerList.appendChild(li);
    });
};

window.addEventListener('load', (event) => {
    initPlayerList();
});

const navigationMap = {
    0: 'players',
    1: 'teams',
    2: 'games',
    3: 'stats',
};

function addPlayer(event) {
    var e = event.target;
    // TODO
    console.log('Add player');
}

function editPlayer(event) {
    var e = event.target;
    while (e.classList && !e.classList.contains('list-item')) {
        e = e.parentNode;
    }
    if (e.classList) {
        // TODO
        console.log('Edit player: ' + e.id);
    }
}

function deletePlayer(event) {
    var e = event.target;
    while (e.classList && !e.classList.contains('list-item')) {
        e = e.parentNode;
    }
    if (e.classList) {
        if (Math.ceil(e.scrollLeft + e.offsetWidth) >= e.scrollWidth) {
            // TODO
            console.log('Delete player: ' + e.id);
            delete players[e.id];
            initPlayerList();
        }
    }
}

function onClickNavigationBar(event) {
    var e = event.target;
    while (e.classList && !e.classList.contains('navigation-item')) {
        e = e.parentNode;
    }
    if (e.classList) {
        document.querySelector('.navigation-item.active').classList.toggle('active');
        e.classList.toggle('active');
        document.querySelector('.page.visible').classList.toggle('visible');
        document.querySelector('#' + navigationMap[[...e.parentNode.children].indexOf(e)]).classList.toggle('visible');
    }
}
