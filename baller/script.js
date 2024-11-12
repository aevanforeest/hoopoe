/* database ******************************************************************/

// TODO: database
const players = {
    'd72fba2e-2855-4b82-aa49-612ee5e13a9a': { number:4, name:'David' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9b': { number:5, name:'Boris' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9c': { number:6, name:'Gian' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9d': { number:7, name:'Tibe' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9e': { number:8, name:'Alexander' },
    'd72fba2e-2855-4b82-aa49-612ee5e13a9f': { number:9, name:'Felix' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa0': { number:10, name:'Jiliam-James' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa1': { number:11, name:'Enzo' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa2': { number:12, name:'Jonathan' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa3': { number:13, name:'Imme' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa4': { number:15, name:'Filippo' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa5': { number:14, name:'Dennis' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa6': { number:14, name:'Jip' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa7': { number:14, name:'Lucas' },
};

// TODO: database
const teams = {
    'd72fba2e-2855-4b82-aa49-612ee5e13aa5': {
        name:'ZZ Leiden M12-1',
        players:[
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
    'd72fba2e-2855-4b82-aa49-612ee5e13aa6': {
        name:'BS Leiden M16-3',
        players:[
        ],
    },
};

const games = {
    'd72fba2e-2855-4b82-aa49-612ee5e13aa7': {
        team:'d72fba2e-2855-4b82-aa49-612ee5e13aa5',
        opponent:'Lokomotief M12-1',
        home:true,
        date:'2024-11-10',
        plays:{
            'Q1': {
                'd72fba2e-2855-4b82-aa49-612ee5e13aa8': {
                    player:'',
                    play:'2PM',
                },
            },
            'Q2': {

            }
        }
    },
};

const PLAY_2_POINTS_MADE = { key:'2PM' };
const PLAY_2_POINTS_MISSED = { key:'2P-' };
const PLAY_3_POINTS_MADE = { key:'3PM' };
const PLAY_3_POINTS_MISSED = { key:'3P-' };
const PLAY_FREE_THROW_MADE = { key:'FTM' };
const PLAY_FREE_THROW_MISSED = { key:'FT-' };
const PLAY_OFFENSIVE_REBOUND = { key:'ORB' };
const PLAY_DEFENSIVE_REBOUND = { key:'DRB' };
const PLAY_FOUL_COMMITTED = { key:'FLC' };
const PLAY_FOUL_DRAWN = { key:'FLD' };
const PLAY_ASSIST = { key:'AST' };
const PLAY_STEAL = { key:'STL' };
const PLAY_TURNOVER = { key:'TOV' };
const PLAY_BLOCK = { key:'BLK' };

const SWIPE_TO_DELETE = 0.60;

/* generic functions *********************************************************/

function generateUuid() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const pages = document.querySelectorAll('.page');

function slideToPage(page) {
    const p = document.querySelector('#page-' + page);
    if (p) {
        pages.forEach((page) => {
            page.style.transform = `translateX(${-p.offsetLeft}px)`;
        });
    }
    const na = document.querySelector('.menu-item.active');
    if (na) { na.classList.toggle('active'); }
    const n = document.querySelector('#menu-' + page);
    if (n) { n.classList.toggle('active'); }
}

function showModal(modal) {
    const mc = document.querySelector('.modal-container');
    mc.classList.add('visible');
    const m = document.querySelector('#modal-' + modal);
    m.classList.add('visible');
}

function hideModal(modal) {
    const mc = document.querySelector('.modal-container');
    mc.classList.remove('visible');
    const m = document.querySelector('#modal-' + modal);
    m.classList.remove('visible');
}

/* players *******************************************************************/

function initPlayerList() {
    const playerList = document.querySelector('#player-list');
    while (playerList.hasChildNodes()) {
        playerList.removeChild(playerList.firstChild);
    }

    // sorted by player number
    Object.keys(players).sort(function(a, b) {
        return players[a].number - players[b].number;
    }).forEach((uuid) => {
        const player = players[uuid];
    // for (const [uuid, player] of Object.entries(players)) {
        const sc = document.createElement('div');
        sc.classList.add('swipe-container');
        sc.id = uuid;
        const si = document.createElement('div');
        si.classList.add('swipe-item');
        si.innerText = player.name + ' (' + player.number + ')';
        sc.appendChild(si);
        const sa = document.createElement('div');
        sa.classList.add('swipe-action');
        const ia = document.createElement('i');
        ia.classList.add('bx', 'bx-arrow-to-left');
        sa.appendChild(ia);
        const it = document.createElement('i');
        it.classList.add('bx', 'bx-trash');
        sa.appendChild(it);
        sc.appendChild(sa);
        playerList.appendChild(sc);
    // }
    });
}

function addPlayer(event) {
    const uuid = generateUuid();
    players[uuid] = { name:'', number: '' };
    openPlayerModal(uuid);
}

function editPlayer(event) {
    const sc = event.target.parentNode;
    const uuid = sc.id;
    openPlayerModal(uuid);
}

function openPlayerModal(uuid) {
    document.querySelector('#player-uuid').value = uuid;
    document.querySelector('#player-name').value = players[uuid].name;
    document.querySelector('#player-number').value = players[uuid].number;
    showModal('player');
}

function closePlayerModal(save) {
    if (save) {
        const uuid = document.querySelector('#player-uuid').value;
        const player = players[uuid];
        player.name = document.querySelector('#player-name').value;
        player.number = document.querySelector('#player-number').value;
        // TODO: database
        initPlayerList();
    }
    hideModal('player');
}

function swipePlayer(event) {
    const sc = event.target.parentNode;
    const uuid = sc.id;
    if (sc.scrollLeft > sc.clientWidth * SWIPE_TO_DELETE) {
        event.target.parentNode.remove();
        delete players[uuid];
        // TODO: database
    }
}

/* teams *********************************************************************/

function initTeamList() {
    const teamList = document.querySelector('#team-list');
    while (teamList.hasChildNodes()) {
        teamList.removeChild(teamList.firstChild);
    }
    for (const [uuid, team] of Object.entries(teams)) {
        const sc = document.createElement('div');
        sc.classList.add('swipe-container');
        sc.id = uuid;
        const si = document.createElement('div');
        si.classList.add('swipe-item');
        si.innerText = team.name;
        sc.appendChild(si);
        const sa = document.createElement('div');
        sa.classList.add('swipe-action');
        const ia = document.createElement('i');
        ia.classList.add('bx', 'bx-arrow-to-left');
        sa.appendChild(ia);
        const it = document.createElement('i');
        it.classList.add('bx', 'bx-trash');
        sa.appendChild(it);
        sc.appendChild(sa);
        teamList.appendChild(sc);
    }
}

function addTeam(event) {
    const uuid = generateUuid();
    teams[uuid] = { name:'', players:[] };
    openTeamModal(uuid);
}

function editTeam(event) {
    const sc = event.target.parentNode;
    const uuid = sc.id;
    openTeamModal(uuid);
}

function openTeamModal(uuid) {
    const team = teams[uuid];
    document.querySelector('#team-uuid').value = uuid;
    document.querySelector('#team-name').value = teams[uuid].name;

    const teamPlayerList = document.querySelector('#team-player-list');
    while (teamPlayerList.hasChildNodes()) {
        teamPlayerList.removeChild(teamPlayerList.firstChild);
    }

    // sorted by player number
    Object.keys(players).sort(function(a, b) {
        return players[a].number - players[b].number;
    }).forEach((uuid) => {
        const player = players[uuid];
    // for (const [uuid, player] of Object.entries(players)) {
        const d = document.createElement('div');
        const i = document.createElement('input');
        i.setAttribute('id', uuid);
        i.setAttribute('type', 'checkbox');
        i.checked = team.players.includes(uuid);
        d.appendChild(i);
        const l = document.createElement('label');
        l.setAttribute('for', uuid);
        l.innerText = player.name + ' (' + player.number + ')';
        d.appendChild(l);
        teamPlayerList.appendChild(d);
    // }
    });

    showModal('team');
}

function closeTeamModal(save) {
    if (save) {
        const uuid = document.querySelector('#team-uuid').value;
        const team = teams[uuid];
        team.name = document.querySelector('#team-name').value;
        team.players = [];
        for (const [uuid, player] of Object.entries(players)) {
            const i = document.querySelector('input[type="checkbox"][id="' + uuid + '"]');
            if (i.checked) {
                team.players.push(uuid);
            }
        }
        initTeamList();
    }
    hideModal('team');
}

function swipeTeam(event) {
    const sc = event.target.parentNode;
    const uuid = sc.id;
    if (sc.scrollLeft > sc.clientWidth * SWIPE_TO_DELETE) {
        event.target.parentNode.remove();
        delete teams[uuid];
    }
}

/* games *********************************************************************/

function initGameList() {
    const gameList = document.querySelector('#game-list');
    while (gameList.hasChildNodes()) {
        gameList.removeChild(gameList.firstChild);
    }

    // sorted by game date
    Object.keys(games).sort(function(a, b) {
        return games[a].date - games[b].date;
    }).forEach((uuid) => {
        const game = games[uuid];
    // for (const [uuid, game] of Object.entries(games)) {
        const sc = document.createElement('div');
        sc.classList.add('swipe-container');
        sc.id = uuid;
        const si = document.createElement('div');
        si.classList.add('swipe-item');
        si.innerText =
            teams[game.team].name +
            (game.home ? ' vs ' : ' @ ') +
            game.opponent;
        sc.appendChild(si);
        const sa = document.createElement('div');
        sa.classList.add('swipe-action');
        const ia = document.createElement('i');
        ia.classList.add('bx', 'bx-arrow-to-left');
        sa.appendChild(ia);
        const it = document.createElement('i');
        it.classList.add('bx', 'bx-trash');
        sa.appendChild(it);
        sc.appendChild(sa);
        gameList.appendChild(sc);
    // }
    });
}

function addGame(event) {
    const uuid = generateUuid();
    // game[uuid] = { name:'', players:[] };
    // openGameModal(uuid);
}

function editGame(event) {
    const sc = event.target.parentNode;
    // const uuid = sc.id;
    // openGameModal(uuid);
}

function swipeGame(event) {
    const sc = event.target.parentNode;
    const uuid = sc.id;
    if (sc.scrollLeft > sc.clientWidth * SWIPE_TO_DELETE) {
        console.log("TODO: delete game: " + uuid);
        event.target.parentNode.remove();
    }
}

/* onload ********************************************************************/

window.addEventListener('load', (event) => {
    initPlayerList();
    initTeamList();
    initGameList();
});