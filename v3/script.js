const players = {
    'd72fba2e-2855-4b82-aa49-612ee5e13a9a': { number: '0',  name: 'David' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9b': { number: '5',  name: 'Boris' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9c': { number: '6',  name: 'Gian' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9d': { number: '7',  name: 'Tibe' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9e': { number: '1',  name: 'Alexander' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9f': { number: '2',  name: 'Felix' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa0': { number: '10', name: 'Jiliam-James' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa1': { number: '11', name: 'Enzo' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa2': { number: '12', name: 'Jonathan' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa3': { number: '13', name: 'Imme' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa4': { number: '16', name: 'Filippo' },
};

const teams = {
    'd72fba2e-2855-4b82-aa49-612ee5e13aa8': {
        name: 'ZZ Leiden M12-1',
        players: [
            'd72fba2e-2855-4b82-aa49-612ee5e13a9a',
            'd72fba2e-2855-4b82-aa49-612ee5e13a9b',
            'd72fba2e-2855-4b82-aa49-612ee5e13a9c',
            'd72fba2e-2855-4b82-aa49-612ee5e13a9d',
            'd72fba2e-2855-4b82-aa49-612ee5e13a9e',
            'd72fba2e-2855-4b82-aa49-612ee5e13a9f',
            'd72fba2e-2855-4b82-aa49-612ee5e13aa0',
            'd72fba2e-2855-4b82-aa49-612ee5e13aa1',
            'd72fba2e-2855-4b82-aa49-612ee5e13aa2',
            'd72fba2e-2855-4b82-aa49-612ee5e13aa3',
            'd72fba2e-2855-4b82-aa49-612ee5e13aa4',
        ],
    },
};

const games = {
    'd72fba2e-2855-4b82-aa49-612ee5e13aa8': {
        team: 'd72fba2e-2855-4b82-aa49-612ee5e13aa8',
        opponent: 'Heroes Den Bosch M12-1',
    },
}
function generateUuid() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

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
        const mso = document.createElement('div');
        mso.classList.add('material-symbols-outlined');
        mso.innerText = 'delete';
        li.append(mso);
        playerList.appendChild(li);
    });
};

function initTeamList() {
    const teamList = document.querySelector('#team-list');
    while (teamList.hasChildNodes()) {
        teamList.removeChild(teamList.firstChild);
    }
    Object.keys(teams).sort(function(a, b) {
        return (teams[a].name > teams[b].name ? 1 : -1);
    }).forEach((uuid) => {
        const team = teams[uuid];
        const li = document.createElement('div');
        li.classList.add('list-item');
        li.id = uuid;
        const lis = document.createElement('div');
        lis.classList.add('list-item-slider');
        const lt = document.createElement('div');
        lt.classList.add('list-team');
        const lnm = document.createElement('div');
        lnm.classList.add('list-name');
        lnm.innerText = team.name;
        lt.appendChild(lnm);
        lis.appendChild(lt);
        li.appendChild(lis);
        const mso = document.createElement('div');
        mso.classList.add('material-symbols-outlined');
        mso.innerText = 'delete';
        li.append(mso);
        teamList.appendChild(li);
    });
};

window.addEventListener('load', (event) => {
    initPlayerList();
    initTeamList();
});

const navigationMap = {
    0: 'players',
    1: 'teams',
    2: 'games',
    3: 'stats',
};

function addPlayer(event) {
    var e = event.target;
    console.log('Add player');
    document.querySelector('#player-number').value = '#'
    document.querySelector('#player-name').value = '...';
    document.querySelector('#player.modal').classList.toggle('visible');
}

function editPlayer(event) {
    var e = event.target;
    while (e.classList && !e.classList.contains('list-item')) {
        e = e.parentNode;
    }
    if (e.classList) {
        // TODO
        const uuid = e.id;
        const player = players[uuid];
        console.log('Edit player: ' + uuid);
        document.querySelector('#player-uuid').value = uuid;
        document.querySelector('#player-number').value = player.number;
        document.querySelector('#player-name').value = player.name;
        document.querySelector('#player.modal').classList.toggle('visible');
    }
}

function deletePlayer(event) {
    var e = event.target;
    while (e.classList && !e.classList.contains('list-item')) {
        e = e.parentNode;
    }
    if (e.classList) {
        if (Math.ceil(e.scrollLeft + e.offsetWidth) >= e.scrollWidth) {
            // TODO: DB delete
            console.log('Delete player: ' + e.id);
            e.parentNode.removeChild(e);
            delete players[e.id];
        }
    }
}

function okPlayer(event) {
    // TODO: DB update
    const uuid = document.querySelector('#player-uuid').value;
    const player = uuid ? players[uuid] : (
        players[generateUuid()] = { number: '', name: '' }
    );
    player.number = document.querySelector('#player-number').value;
    player.name = document.querySelector('#player-name').value;
    console.log(player);
    initPlayerList();
    cancelPlayer(event);
}

function cancelPlayer(event) {
    document.querySelector('#player.modal').classList.toggle('visible');
}

function addTeam(event) {
    var e = event.target;
    console.log('Add team');
    // TODO
}

function editTeam(event) {
    var e = event.target;
    console.log('Edit team');
    // TODO
}

function deleteTeam(event) {
    var e = event.target;
    while (e.classList && !e.classList.contains('list-item')) {
        e = e.parentNode;
    }
    if (e.classList) {
        if (Math.ceil(e.scrollLeft + e.offsetWidth) >= e.scrollWidth) {
            // TODO: DB delete
            console.log('Delete team: ' + e.id);
            e.parentNode.removeChild(e);
            delete teams[e.id];
        }
    }
}

function addGame(event) {
    var e = event.target;
    console.log('Add game');
    // TODO
}

function editGame(event) {
    // TODO
    var e = event.target;
    while (e.classList && !e.classList.contains('list-item')) {
        e = e.parentNode;
    }
    if (e.classList) {
        // TODO
        const uuid = e.id;
        const game = games[uuid];
        console.log('Edit game: ' + uuid);
        // document.querySelector('#player-uuid').value = uuid;
        // document.querySelector('#player-number').value = player.number;
        // document.querySelector('#player-name').value = player.name;
        document.querySelector('#game.modal').classList.toggle('visible');
    }
}

function deleteGame(event) {
    var e = event.target;
    while (e.classList && !e.classList.contains('list-item')) {
        e = e.parentNode;
    }
    if (e.classList) {
        if (Math.ceil(e.scrollLeft + e.offsetWidth) >= e.scrollWidth) {
            // TODO: DB delete
            console.log('Delete game: ' + e.id);
            e.parentNode.removeChild(e);
            delete games[e.id];
        }
    }
}

function closeGame(event) {
    document.querySelector('#game.modal').classList.toggle('visible');
}

var play;

function clickPlay(event) {
    var e = event.target;
    console.log(e.innerText);
    document.querySelector('#gamePlays').classList.toggle('visible');
    document.querySelector('#gamePlayers').classList.toggle('visible');
}

var player;

function clickPlayer(event) {
    var e = event.target;
    document.querySelector('#gamePlayers').classList.toggle('visible');
    document.querySelector('#gamePlays').classList.toggle('visible');
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
