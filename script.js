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
    TWO_POINTS_MADE: { code:'2PM', text:'2P Made' },
    THREE_POINTS_MADE: { code:'3PM', text:'3P Made' },
    FREE_THROW_MADE: { code:'FTM', text:'FT Made' },
    TWO_POINTS_MISS: { code:'2PA', text:'2P Missed' },
    THREE_POINTS_MISS: { code:'3PA', text:'3P Miss' },
    FREE_THROW_MISS: { code:'FTA', text:'FT Miss' },
    OFFENSIVE_REBOUND: { code:'OREB', text:'Offensive Rebound' },
    DEFENSIVE_REBOUND: { code:'DREB', text:'Defensive Rebound' },
    FOUL_COMMITTED: { code:'FC', text:'Foul Committed' },
    ASSIST: { code:'AST', text:'Assist' },
    STEAL: { code:'STL', text:'Steal' },
    FOUL_DRAWN: { code:'FD', text:'Foul Drawn' },
    TURNOVER: { code:'TOV', text:'Turnover' },
    BLOCK: { code:'BLK', text:'Block' },
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

var selectedQuarter = 'Q1';

// state values
var selectedPlayer;
var longPressInProgress;

function playerClick(i) {
    if (i) {
        selectedPlayer = i;
    }

    // navigate to actions page
    document.querySelector('#game-players').className = 'inactive';
    document.querySelector('#game-actions').className = 'active';
    return true;
}

function actionClick(a) {
    if (a) {
        const p = { player: selectedPlayer, action: a };
        // special case - forced foul will automatically log committed foul for opponent
        if (p.player != OPPONENT_UUID && p.action == Actions.FOUL_DRAWN.code) {
            const op = { player: OPPONENT_UUID, action: Actions.FOUL_COMMITTED.code };
            game.plays[selectedQuarter][generateUuid()] = op;
            updateFouls();
        }

        game.plays[selectedQuarter][generateUuid()] = p;
        updatePlayByPlay();

        switch (p.action) {
        case Actions.TWO_POINTS_MADE.code:
        case Actions.THREE_POINTS_MADE.code:
        case Actions.FREE_THROW_MADE.code:
            updateScore();
            break;
        case Actions.FOUL_COMMITTED.code:
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
    for (const [pid, p] of Object.entries(game.plays[selectedQuarter])) {
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
            if (p.action == a.code) {
                ad.innerText = a.text;
                break;
            }
        }
        od.appendChild(ad);
        //pbp.appendChild(od);
        pbp.insertBefore(od, pbp.firstChild);
    }

    //pbp.scrollTop = pbp.scrollHeight;
    pbp.scrollTop = 0;
}

function updateScore() {
    // tally team scores for the game
    var ts = 0, os = 0;
    for (const [q, qp] of Object.entries(game.plays)) {
        for (const p of Object.values(qp)) {
            var pt = (p.action == Actions.TWO_POINTS_MADE.code ? 2 : p.action == Actions.THREE_POINTS_MADE.code ? 3 : p.action == Actions.FREE_THROW_MADE.code ? 1 : 0);
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
    for (const play of Object.values(game.plays[selectedQuarter])) {
        if (play.player != OPPONENT_UUID) {
            tf += (play.action == Actions.FOUL_COMMITTED.code ? 1 : 0);
        } else {
            of += (play.action == Actions.FOUL_COMMITTED.code ? 1 : 0);
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
                  pf += (play.action == Actions.FOUL_COMMITTED.code ? 1 : 0);
                }
            }
        }
        // update player fouls
        setDots(document.querySelector('#' + uuid), pf);
    }
}

function setDots(parent, count) {
    var ds = parent.querySelectorAll('.dot');
    var i = 1;
    for (var d of ds) {
        if (i <= count) {
            if (i == 5) {
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
    // maximum 12 players
    if (Object.entries(players).length > 12) {
        return false;
    }
    var i = 0;
    for (const [uuid, p] of Object.entries(players)) {
        var pb = document.querySelector('.player-button:nth-of-type(' + (++i) + ')');
        pb.addEventListener('click', (event) => {
            if (!longPressInProgress) {
                return playerClick(uuid);
            }
        });
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
        ab.id = a.code;
        // var abCode = document.createElement('div');
        // abCode.className = 'action-button-code';
        // abCode.innerText = a.uuid;
        // ab.appendChild(abCode);
        // var abText = document.createElement('div');
        // abText.className = 'action-button-text';
        // abText.innerText = a.text;
        // ab.appendChild(abText);
        ab.innerText = a.text;
        ab.addEventListener('click', (event) => { return actionClick(event.target.id); });
    }
    var abc = document.querySelector('.action-button.cancel');
    abc.addEventListener('click', (event) => { return actionClick(); });
    abc.innerText = 'Cancel';
}

function initGame() {
    initPlayers();
    initActions();

    // quarter selector
    var gqto;
    const gq = document.querySelector('#game-quarter');
    gq.addEventListener('scroll', (event) => {
        if (gqto) {
           clearTimeout(gqto);
        }
        gqto = setTimeout(() => {
            const ds = gq.querySelectorAll('div');
            const st = gq.scrollTop + ds[0].offsetTop;
            for (const d of ds) {
                if (Math.abs(d.offsetTop - st) < 1) {
                    // update quarter
                    selectedQuarter = d.id;
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
        // clear any pending deletables
        const ds = document.querySelectorAll('#game-play-by-play > div.delete');
        for (const d of ds) {
            d.className = '';
        }

        const e = event.target.parentNode;
        if (e.parentNode.id !== 'game-play-by-play') {
            return false;
        }
        var sc = {
            x: event.changedTouches[0].clientX,
            y: event.changedTouches[0].clientY,
        };
        var click = function(event) {
            delete game.plays[selectedQuarter][e.id];
            updatePlayByPlay();
            updateScore();
            updateFouls();
        };
        var touchMove = function(event) {
            var mc = {
                x: event.changedTouches[0].clientX,
                y: event.changedTouches[0].clientY,
            };
            const dx = sc.x - mc.x;
            if (dx >= 0) {
                e.style.left = -dx + 'px';
                if (e.className === 'delete') {
                    if (dx < e.clientWidth * 0.25) {
                        e.removeEventListener('click', click);
                        e.className = '';
                    }
                } else {
                    if (dx >= e.clientWidth * 0.25) {
                        e.addEventListener('click', click);
                        e.className = 'delete';
                    }
                }
            }
        };
        var touchEnd = function(event) {
            var ec = {
                x: event.changedTouches[0].clientX,
                y: event.changedTouches[0].clientY,
            };
            e.style.left = 0;
            e.removeEventListener('touchmove', touchMove);
            e.removeEventListener('touchend', touchEnd);
        };
        e.addEventListener('touchmove', touchMove);
        e.addEventListener('touchend', touchEnd);
    });

    // long press user handler
    var ubto;
    const ubs = document.querySelectorAll('.player-button:not(.opponent)');
    for (const ub of ubs) {
        ub.addEventListener('touchstart', (event) => {
            longPressInProgress = true;
            ubto = setTimeout(() => {
                // toggle substitute
                if (event.target.parentNode.className.includes('bench')) {
                    event.target.parentNode.className = 'player-button';
                } else {
                    event.target.parentNode.className = 'player-button bench';
                }
            }, 500);
        });
        ub.addEventListener('touchend', (event) => {
            clearTimeout(ubto);
            longPressInProgress = false;
        });
    }
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