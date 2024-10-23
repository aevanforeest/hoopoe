function generateUuid() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

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

const opponentUuid = '00000000-0000-0000-0000-000000000000';

var playByPlay = {
    'Q1': {},
    'Q2': {},
    'Q3': {},
    'Q4': {},
    'OT': {},
};

var playerUuid;

function playerClick(e) {
    alert('playerClick e.id = ' + e.id);
    if (!e.id) {
        return false;
    }

    playerUuid = e.id;

    // navigate to actions page
    navigator.vibrate(20);
    document.querySelector('#game-players').className = 'inactive';
    document.querySelector('#game-actions').className = 'active';
    return true;
}

function actionClick(e) {
    if (!e.id) {
        return false;
    }

    updatePlayByPlay({ player:playerUuid, action:e.id });

    switch (e.id) {
    case '3PM':
    case '2PM':
    case 'FTM':
        updateScore();
        break;
    case 'FLC':
    case 'FFL':
        updateFouls();
        break;
    }

    // navigate to players page
    navigator.vibrate(20);
    document.querySelector('#game-actions').className = 'inactive';
    document.querySelector('#game-players').className = 'active';
    return true;
}

function updateScore() {
    // tally score
    var ts = 0, os = 0;
    for (const [q, qp] of Object.entries(playByPlay)) {
        for (const p of Object.values(qp)) {
            if (p.player == opponentUuid) {
                os += (p.action == '3PM' ? 3 : p.action == '2PM' ? 2 : p.action == 'FTM' ? 1 : 0);
            } else {
                ts += (p.action == '3PM' ? 3 : p.action == '2PM' ? 2 : p.action == 'FTM' ? 1 : 0);
            }
        }
    }
    // update score
    document.querySelector('#game-home-score').innerText = ts;
    document.querySelector('#game-away-score').innerText = os;
}

function updatePlayByPlay(play) {
    playByPlay['Q1'][generateUuid()] = play;
}

function initPlayers(players) {
    if (Object.entries(players).length > 12) {
        return false;
    }
    var i = 0;
    for (const [uuid, p] of Object.entries(players)) {
        var pb = document.querySelector('.player-button:nth-of-type(' + (++i) + ')');
        pb.id = uuid;
        pb.onclick = function() { return playerClick(this); }
        var pbNumber = document.createElement('div');
        pbNumber.className = 'player-button-number';
        pbNumber.innerText = p.number;
        pb.appendChild(pbNumber);
        var pbName = document.createElement('div');
        pbName.className = 'player-button-name';
        pbName.innerText = p.name;
        pb.appendChild(pbName);
        var pbFouls = document.createElement('div');
        for (var j = 0; j < 5; j++) {
        var pbFoul = document.createElement('div');
        pbFoul.className = 'dot';
        pbFouls.appendChild(pbFoul);
        }
        pb.appendChild(pbFouls);
    }
    var pbo = document.querySelector('.player-button.opponent');
    pbo.id = '00000000-0000-0000-0000-000000000000';
    pbo.onclick = function() { return playerClick(this); }
    pbo.innerText = 'Opponent';
}

function initActions() {
    var abs = document.querySelectorAll('.action-button');
    for (var i = 0; i < abs.length; i++) {
        var ab = abs[i];
        ab.onclick = function() { return actionClick(this); }
    }
}

function initGame() {
    initPlayers(players);
    initActions();
}

document.body.onload = function() {
    initGame();
}
