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
    'd72fba2e-2855-4b82-aa49-612ee5e13aa5': { name:'ZZ Leiden M12-1' },
    'd72fba2e-2855-4b82-aa49-612ee5e13aa6': { name:'BS Leiden M16-3' },
};

function initPlayerList() {
    const playerList = document.querySelector('#page-players #player-list');
    for (const [id, player] of Object.entries(players)) {
        const li = document.createElement('li');
        const name = document.createElement('name');
        name.innerText = player.name;
        li.appendChild(name);
        const number = document.createElement('number');
        number.innerText = player.number;
        li.appendChild(number);
        playerList.appendChild(li);
    }
}

function initTeamList() {
    const teamList = document.querySelector('#page-teams #team-list');
    for (const [id, team] of Object.entries(teams)) {
        const li = document.createElement('li');
        const name = document.createElement('name');
        name.innerText = team.name;
        li.appendChild(name);
        teamList.appendChild(li);
    }
}

const pages = document.querySelectorAll('.page');

function slide(page) {
    const p = document.querySelector('#page-' + page);
    if (p) {
        pages.forEach((page) => {
            page.style.transform = `translateX(${-p.offsetLeft}px)`;
        });
    }
    const na = document.querySelector('.menu-item.active');
    if (na) { na.classList.toggle('active'); }
    const np = document.querySelector('#menu-item-' + page);
    if (np) { np.classList.toggle('active'); }
}

function openModal() {
    const ms = document.querySelector('.modals');
    ms.classList.toggle('visible');
    const m = document.querySelector('.modal#modal-player');
    m.classList.toggle('visible');
}

function closeModal() {
    const m = document.querySelector('.modal#modal-player');
    m.classList.toggle('visible');
    const ms = document.querySelector('.modals');
    ms.classList.toggle('visible');
}

window.addEventListener('load', (event) => {
    initPlayerList();
    initTeamList();
});