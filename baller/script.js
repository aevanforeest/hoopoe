/* database ******************************************************************/

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
};

const teams = {
    'd72fba2e-2855-4b82-aa49-612ee5e13aa5': {
        name:'ZZ Leiden M12-1',
        players:[
            'd72fba2e-2855-4b82-aa49-612ee5e13a9a',
            'd72fba2e-2855-4b82-aa49-612ee5e13a9b',
            'd72fba2e-2855-4b82-aa49-612ee5e13a9c',
            'd72fba2e-2855-4b82-aa49-612ee5e13a9d',
            'd72fba2e-2855-4b82-aa49-612ee5e13a9e',
        ]
    },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa6': { name:'BS Leiden M16-3', players:[] },
};

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
    const n = document.querySelector('#menu-item-' + page);
    if (n) { n.classList.toggle('active'); }
}

// use open and close instead of toggle?
function toggleModal(modal) {
    const mc = document.querySelector('.modal-container');
    if (mc) { mc.classList.toggle('visible'); }
    const m = document.querySelector('#modal-' + modal);
    if (m) { m.classList.toggle('visible'); }
}

/* players *******************************************************************/

function initPlayerList() {
    const playerList = document.querySelector('#player-list');
    while (playerList.hasChildNodes()) {
        playerList.removeChild(playerList.firstChild);
    }
    for (const [uuid, player] of Object.entries(players)) {
        const sc = document.createElement('div');
        sc.classList.add('swipe-container');
        sc.id = uuid;
        const si = document.createElement('div');
        si.classList.add('swipe-item');
        si.innerText = player.number + ' ' + player.name;
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
    }
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
    toggleModal('player');
}

function okPlayerModal(event) {
    const uuid = document.querySelector('#player-uuid').value;
    players[uuid].name = document.querySelector('#player-name').value;
    players[uuid].number = document.querySelector('#player-number').value;
    // TODO: save changes and update player list
    initPlayerList();
    toggleModal('player');
}

function cancelPlayerModal(event) {
    toggleModal('player');
}

function swipePlayer(event) {
    const sc = event.target.parentNode;
    const uuid = sc.id;
    if (sc.scrollLeft > sc.clientWidth * 0.70) {
        console.log("TODO: delete player: " + uuid);
        event.target.parentNode.remove();
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
    for (const [uuid, player] of Object.entries(players)) {
        const i = document.createElement('input');
        i.setAttribute('id', uuid);
        i.setAttribute('type', 'checkbox');
        i.checked = team.players.includes(uuid);
        teamPlayerList.appendChild(i);
        const l = document.createElement('label');
        l.setAttribute('for', uuid);
        l.innerText = player.name;
        teamPlayerList.appendChild(l);
    }
    toggleModal('team');
}

function okTeamModal(event) {
    const uuid = document.querySelector('#team-uuid').value;
    teams[uuid].name = document.querySelector('#team-name').value;
    // TODO: save changes and update team list
    initTeamList();
    toggleModal('team');
}

function cancelTeamModal(event) {
    toggleModal('team');
}

function swipeTeam(event) {
    const sc = event.target.parentNode;
    const uuid = sc.id;
    if (sc.scrollLeft > sc.clientWidth * 0.70) {
        console.log("TODO: delete team: " + uuid);
        event.target.parentNode.remove();
    }
}

/* onload ********************************************************************/

window.addEventListener('load', (event) => {
    initPlayerList();
    initTeamList();
});