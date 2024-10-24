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
    TWO_POINTS_MADE: { uuid:'M2P', text:'2P Made' },
    THREE_POINTS_MADE: { uuid:'M3P', text:'3P Made' },
    FREE_THROW_MADE: { uuid:'MFT', text:'FT Made' },
    TWO_POINTS_MISS: { uuid:'X2P', text:'2P Miss' },
    THREE_POINTS_MISS: { uuid:'X3P', text:'3P Miss' },
    FREE_THROW_MISS: { uuid:'XFT', text:'FT Miss' },
    OFFENSIVE_REBOUND: { uuid:'ORB', text:'Offensive Rebound' },
    DEFENSIVE_REBOUND: { uuid:'DRB', text:'Defensive Rebound' },
    FOUL_COMMITTED: { uuid:'FLC', text:'Foul Committed' },
    FORCED_FOUL: { uuid:'FFL', text:'' },
    ASSIST: { uuid:'AST', text:'Assist' },
    STEAL: { uuid:'STL', text:'Steal' },
    TURNOVER: { uuid:'TOV', text:'Turnover' },
    BLOCK: { uuid:'BLK', text:'Block' },
};

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
          game.plays[gameQuarter][generateUuid()] = { player: OPPONENT_UUID, action: Actions.FOUL_COMMITTED.uuid };
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
    // delete play by play
    var pbp = document.querySelector('#game-play-by-play');
    var c;
    while (c = pbp.firstChild) {
        pbp.removeChild(c);
    }

    // add play by play for the current quarter
    for (const play of Object.values(game.plays[gameQuarter])) {
        var d;
        d = document.createElement('div');
        if (play.player != OPPONENT_UUID) {
            d.innerText = players[play.player].number + ' ' + players[play.player].name;
        } else {
            d.innerText = 'Opponent';
        }
        pbp.appendChild(d);
        d = document.createElement('div');
        d.innerText = document.querySelector('#' + play.action).innerText;
        pbp.appendChild(d);
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
        pb.addEventListener('click', event => { return playerClick(uuid); });
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
    pbo.addEventListener('click', event => { return playerClick(OPPONENT_UUID); });
    pbo.innerText = 'Opponent';
}

function initActions() {
    var i = 0;
    for (const a of Object.values(Actions)) {
        var ab = document.querySelector('.action-button:nth-of-type(' + (++i) + ')');
        ab.id = a.uuid;
        ab.innerText = a.text;
        ab.addEventListener('click', event => { return actionClick(event.target.id); });
    }
    var abc = document.querySelector('.action-button.cancel');
    abc.addEventListener('click', event => { return actionClick(); });
    abc.innerText = 'Cancel';
}

function initGame() {
    initPlayers();
    initActions();
    // quarter selector
    /*
    document.querySelector('#game-quarter').addEventListener('scrollsnapchange', event => {
      var q = event.snapTargetBlock.innerText;
      if (game.plays[q]) {
        gameQuarter = q;
        updatePlayByPlay();
        updateFouls();
      }
    });
    */
   const gq = document.querySelector('#game-quarter');
   gq.addEventListener('scroll', event => {
    const ds = document.querySelectorAll('#game-quarter div');
    const st = Math.floor(gq.scrollTop) + ds[0].offsetTop;
    for (const d of ds) {
      if (d.offsetTop == st) {
        gameQuarter = d.innerText;
        updatePlayByPlay();
        updateFouls();
        break;
      }
    }
   });
}

document.body.onload = function() {
    initGame();
}