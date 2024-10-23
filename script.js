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

var game = {
    teams: {
        home: 'Home Team',
        away: 'Away Team',
    },
    quarter: 'Q1',
    plays: {
        Q1: {},
        Q2: {},
        Q3: {},
        Q4: {},
        OT: {},
    }
};

var playerUuid;

function playerClick(e) {
    if (!e.id) {
        return false;
    }

    playerUuid = e.id;

    // navigate to actions page
    document.querySelector('#game-players').className = 'inactive';
    document.querySelector('#game-actions').className = 'active';
    return true;
}

function actionClick(e) {
    if (e.id) {
        game.plays[game.quarter][generateUuid()] = { player:playerUuid, action:e.id };
        updatePlayByPlay();
        switch (e.id) {
        case 'M3P':
        case 'M2P':
        case 'MFT':
            updateScore();
            break;
        case 'FLC':
        case 'FFL':
            updateFouls();
            break;
        }
    }

    // navigate back to players page
    document.querySelector('#game-actions').className = 'inactive';
    document.querySelector('#game-players').className = 'active';
    return true;
}

function updatePlayByPlay() {
    // update play by play
    var pbp = document.querySelector('#game-play-by-play');
    var c;
    while (c = pbp.firstChild) {
        pbp.removeChild(c);
    }

    for (const play of Object.values(game.plays[game.quarter])) {
        var d;
        d = document.createElement('div');
        if (play.player != opponentUuid) {
            d.innerText = players[play.player].number + ' ' + players[play.player].name;
        } else {
            d.innerText = 'Opponent';
        }
        pbp.appendChild(d);
        d = document.createElement('div');
        d.innerText = document.querySelector('#' + play.action).innerText;
        pbp.appendChild(d);
    }
}

function updateScore() {
    // update team score
    var ts = 0, os = 0;
    for (const [q, qp] of Object.entries(game.plays)) {
        for (const p of Object.values(qp)) {
            if (p.player != opponentUuid) {
                ts += (p.action == 'M3P' ? 3 : p.action == 'M2P' ? 2 : p.action == 'MFT' ? 1 : 0);
            } else {
                os += (p.action == 'M3P' ? 3 : p.action == 'M2M' ? 2 : p.action == 'MFT' ? 1 : 0);
            }
        }
    }
    document.querySelector('#game-home-score').innerText = ts;
    document.querySelector('#game-away-score').innerText = os;
}

function updateFouls() {
    // update team fouls
    var tf = 0, of = 0;
    for (const play of Object.values(game.plays[game.quarter])) {
        if (play.player != opponentUuid) {
            tf += (play.action == 'FLC' ? 1 : 0);
            of += (play.action == 'FFL' ? 1 : 0);
        }
    }
    setDots(document.querySelector('#game-home-fouls'), tf);
    setDots(document.querySelector('#game-away-fouls'), of);

    // update player fouls
    for (const [uuid, player] of Object.entries(players)) {
        var pf = 0;
        for (const [quarter, plays] of Object.entries(game.plays)) {
            for (const play of Object.values(plays)) {
                if (play.player == uuid) {
                  pf += (play.action == 'FLC' ? 1 : 0);
                }
            }
        }
        setDots(document.querySelector('#' + uuid), pf);
    }
}

const MAX_TEAM_FOULS = 5;
const MAX_PLAYER_FOULS = 5;

function setDots(parent, count) {
    var ds = parent.querySelectorAll('.dot');
    var i = 1;
    for (var d of ds) {
        if (i <= count) {
            if (i == MAX_TEAM_FOULS) {
                d.className = 'dot red';
            } else {
                d.className = 'dot gold';
            }
        } else {
            d.className = 'dot';
        }
        i++;
    }
}

function initPlayers(players) {
    if (Object.entries(players).length > 12) {
        return false;
    }
    var i = 1;
    for (const [uuid, p] of Object.entries(players)) {
        var pb = document.querySelector('.player-button:nth-of-type(' + i + ')');
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
        i++;
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