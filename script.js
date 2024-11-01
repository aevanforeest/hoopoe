function generateUuid() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const Actions = {
    TWO_POINTS_MADE: { uuid:'2PM', text:'2P Made' },
    THREE_POINTS_MADE: { uuid:'3PM', text:'3P Made' },
    FREE_THROW_MADE: { uuid:'FTM', text:'FT Made' },
    TWO_POINTS_MISS: { uuid:'2PA', text:'2P Missed' },
    THREE_POINTS_MISS: { uuid:'3PA', text:'3P Miss' },
    FREE_THROW_MISS: { uuid:'FTA', text:'FT Miss' },
    OFFENSIVE_REBOUND: { uuid:'OREB', text:'Offensive Rebound' },
    DEFENSIVE_REBOUND: { uuid:'DREB', text:'Defensive Rebound' },
    FOUL_COMMITTED: { uuid:'FC', text:'Foul Committed' },
    ASSIST: { uuid:'AST', text:'Assist' },
    STEAL: { uuid:'STL', text:'Steal' },
    FORCED_FOUL: { uuid:'FF', text:'Forced Foul' },
    TURNOVER: { uuid:'TOV', text:'Turnover' },
    BLOCK: { uuid:'BLK', text:'Block' },
};

// TODO: should come from DB
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

const OPPONENT_UUID = '00000000-0000-0000-0000-000000000000';
const OPPONENT_NAME = 'Opponent';

var game = {
    teams: {
        home: 'Home Team',
        away: 'Away Team',
    },
    plays: {
        Q1: {},
        Q2: {},
        Q3: {},
        Q4: {},
        OT: {},
    }
};

var gameQuarter = 'Q1';

var playerUuid;

function playerClick(i) {
    if (i) {
        playerUuid = i;
    }

    // navigate to actions page
    document.querySelector('#game-players').className = 'inactive';
    document.querySelector('#game-actions').className = 'active';
    return true;
}

function actionClick(a) {
    if (a) {
        const p = { player: playerUuid, action: a };
        // special case - forced foul will automatically log committed foul for opponent
        if (p.player != OPPONENT_UUID && p.action == Actions.FORCED_FOUL.uuid) {
            const op = { player: OPPONENT_UUID, action: Actions.FOUL_COMMITTED.uuid };
            game.plays[gameQuarter][generateUuid()] = op;
            updateFouls();
        }

        game.plays[gameQuarter][generateUuid()] = p;
        updatePlayByPlay();

        switch (p.action) {
        case Actions.TWO_POINTS_MADE.uuid:
        case Actions.THREE_POINTS_MADE.uuid:
        case Actions.FREE_THROW_MADE.uuid:
            updateScore();
            break;
        case Actions.FOUL_COMMITTED.uuid:
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
    const pbp = document.querySelector('#game-play-by-play');

    // remove previous plays
    var c;
    while (c = pbp.firstElementChild) {
        c.remove();
    }

    // add play by play for the current quarter
    for (const [pid, p] of Object.entries(game.plays[gameQuarter])) {
        var od = document.createElement('div');
        od.id = pid;
        var pd = document.createElement('div');
        if (p.player != OPPONENT_UUID) {
            pd.innerText = players[p.player].number + ' ' + players[p.player].name;
        } else {
            pd.innerText = OPPONENT_NAME;
        }
        od.appendChild(pd);
        var ad = document.createElement('div');
        for (const a of Object.values(Actions)) {
            if (p.action == a.uuid) {
                ad.innerText = a.text;
                break;
            }
        }
        od.appendChild(ad);
        pbp.appendChild(od);
    }

    pbp.scrollTop = pbp.scrollHeight;
}

function updateScore() {
    // tally team scores for the game
    var ts = 0, os = 0;
    for (const [q, qp] of Object.entries(game.plays)) {
        for (const p of Object.values(qp)) {
            var pt = (p.action == Actions.TWO_POINTS_MADE.uuid ? 2 : p.action == Actions.THREE_POINTS_MADE.uuid ? 3 : p.action == Actions.FREE_THROW_MADE.uuid ? 1 : 0);
            if (p.player != OPPONENT_UUID) {
                ts += pt;
            } else {
                os += pt;
            }
        }
    }
    // update team scores
    document.querySelector('#game-home-score').innerText = ts;
    document.querySelector('#game-away-score').innerText = os;
}

function updateFouls() {
    // tally team fouls for the current quarter
    var tf = 0, of = 0;
    for (const play of Object.values(game.plays[gameQuarter])) {
        if (play.player != OPPONENT_UUID) {
            tf += (play.action == Actions.FOUL_COMMITTED.uuid ? 1 : 0);
        } else {
            of += (play.action == Actions.FOUL_COMMITTED.uuid ? 1 : 0);
        }
    }
    // update team fouls
    setDots(document.querySelector('#game-home-fouls'), tf);
    setDots(document.querySelector('#game-away-fouls'), of);

    // tally player fouls for the game
    for (const [uuid, player] of Object.entries(players)) {
        var pf = 0;
        for (const [quarter, plays] of Object.entries(game.plays)) {
            for (const play of Object.values(plays)) {
                if (play.player == uuid) {
                  pf += (play.action == Actions.FOUL_COMMITTED.uuid ? 1 : 0);
                }
            }
        }
        // update player fouls
        setDots(document.querySelector('#' + uuid), pf);
    }
}

const MAX_FOULS = 5;

function setDots(parent, count) {
    var ds = parent.querySelectorAll('.dot');
    var i = 1;
    for (var d of ds) {
        if (i <= count) {
            if (i == MAX_FOULS) {
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

function initPlayers() {
    if (Object.entries(players).length > 12) {
        return false;
    }
    var i = 0;
    for (const [uuid, p] of Object.entries(players)) {
        var pb = document.querySelector('.player-button:nth-of-type(' + (++i) + ')');
        pb.addEventListener('click', (event) => { return playerClick(uuid); });
        pb.id = uuid;
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
    pbo.addEventListener('click', (event) => { return playerClick(OPPONENT_UUID); });
    pbo.innerText = OPPONENT_NAME;
}

function initActions() {
    var i = 0;
    for (const a of Object.values(Actions)) {
        var ab = document.querySelector('.action-button:nth-of-type(' + (++i) + ')');
        ab.id = a.uuid;
        ab.innerText = a.text;
        ab.addEventListener('click', (event) => { return actionClick(event.target.id); });
    }
    var abc = document.querySelector('.action-button.cancel');
    abc.addEventListener('click', (event) => { return actionClick(); });
    abc.innerText = 'Cancel';
}

const LONG_PRESS_MS = 1000;

function initGame() {
    initPlayers();
    initActions();
    // quarter selector
    var to;
    const gq = document.querySelector('#game-quarter');
    gq.addEventListener('scroll', (event) => {
        if (to) {
           clearTimeout(to);
        }
        to = setTimeout(() => {
            const ds = gq.querySelectorAll('div');
            const st = gq.scrollTop + ds[0].offsetTop;
            for (const d of ds) {
                if (Math.abs(d.offsetTop - st) < 1) {
                    // update quarter
                    gameQuarter = d.id;
                    updatePlayByPlay();
                    updateFouls();
                    break;
                }
            }
        }, 100);
    });

    // slide action to delete
    const pbp = document.querySelector('#game-play-by-play');
    pbp.addEventListener('touchstart', (event) => {
        const e = event.target.parentNode;
        if (e.parentNode.id === 'game-play-by-play') {
            var sc = {
                x: event.changedTouches[0].clientX,
                y: event.changedTouches[0].clientY,
            };
            var touchMove = function(event) {
                var mc = {
                    x: event.changedTouches[0].clientX,
                    y: event.changedTouches[0].clientY,
                };
                if (sc.x - mc.x >= e.clientWidth * 0.10) {
                    e.style.left = (mc.x - sc.x) + 'px';
                }
                if (sc.x - mc.x >= e.clientWidth * 0.50) {
                    e.style.backgroundColor = 'red';
                } else {
                    e.style.backgroundColor = '';
                }
            }
            var touchEnd = function(event) {
                var ec = {
                    x: event.changedTouches[0].clientX,
                    y: event.changedTouches[0].clientY,
                };
                event.target.removeEventListener('touchmove', touchMove);
                event.target.removeEventListener('touchend', touchEnd);
                if (sc.x - ec.x >= e.clientWidth * 0.50) {
                    delete game.plays[gameQuarter][e.id];
                    updatePlayByPlay();
                    updateScore();
                    updateFouls();
                } else {
                    e.style.backgroundColor = '';
                    e.style.left = '';
                }
            }
            event.target.addEventListener('touchmove', touchMove);
            event.target.addEventListener('touchend', touchEnd);
        }
    });
}

// FGM FGA FG%
// 3PM 3PA 3P%
// OREB DREB REB
// AST TOV STL BLK
// FC FD
// EFF: (PTS + REB + AST + STL + BLK − (FGA-FGM) − (FTA-FTM) - TOV)
// PTS

// PIR: (PTS + REB + AST + STL + BLK + FD) - (FGA-FGM) - (FTA-FTM) - TOV - FC)

window.addEventListener('load', (event) => {
    initGame();
});