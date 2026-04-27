let teams = [];
let fixtures = [];
let currentMatchday = 0;

const teamNames = [
  "Arsenal", "Chelsea", "Liverpool", "Man City", "Man United",
  "Tottenham", "Newcastle", "Aston Villa", "Brighton", "West Ham",
  "Everton", "Leicester", "Leeds", "Wolves", "Fulham",
  "Brentford", "Crystal Palace", "Bournemouth", "Burnley", "Forest"
];

/* ---------------- SAVE SYSTEM ---------------- */
function saveData() {
  localStorage.setItem("teams", JSON.stringify(teams));
  localStorage.setItem("fixtures", JSON.stringify(fixtures));
  localStorage.setItem("currentMatchday", currentMatchday);
}

function loadData() {
  let t = localStorage.getItem("teams");
  let f = localStorage.getItem("fixtures");
  let c = localStorage.getItem("currentMatchday");

  if (t) teams = JSON.parse(t);
  if (f) fixtures = JSON.parse(f);
  if (c) currentMatchday = Number(c);
}

/* ---------------- TEAMS ---------------- */
function generateTeams() {

  teams = [];

  let i = 0;
  while (i < 20) {

    teams.push({
      name: teamNames[i],
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    });

    i++;
  }

  saveData();
  renderTable();
}

/* ---------------- FIXTURES ---------------- */
function generateFixtures() {

  fixtures = [];

  let temp = teams.slice();

  let round = 0;

  while (round < 19) {

    let matchday = [];
    let i = 0;

    while (i < 10) {

      matchday.push({
        home: temp[i],
        away: temp[19 - i],
        homeScore: "",
        awayScore: "",
        played: false
      });

      i++;
    }

    fixtures.push(matchday);

    let last = temp.pop();
    temp.splice(1, 0, last);

    round++;
  }

  currentMatchday = 0;

  saveData();
}

/* ---------------- MATCHDAY UI ---------------- */
function renderMatchday() {

  let matches = fixtures[currentMatchday];

  let html = "";

  let i = 0;
  while (i < matches.length) {

    let m = matches[i];

    html += `
      <div>
        ${m.home.name}
        <input id="h${i}" value="${m.homeScore}">
        -
        <input id="a${i}" value="${m.awayScore}">
        ${m.away.name}
      </div>
    `;

    i++;
  }

  document.getElementById("matches").innerHTML = html;
}

/* ---------------- REMOVE OLD STATS ---------------- */
function removeStats(home, away, hg, ag) {

  home.played--;
  away.played--;

  home.goalsFor -= hg;
  home.goalsAgainst -= ag;

  away.goalsFor -= ag;
  away.goalsAgainst -= hg;

  if (hg > ag) {
    home.wins--;
    home.points -= 3;
    away.losses--;
  }

  else if (ag > hg) {
    away.wins--;
    away.points -= 3;
    home.losses--;
  }

  else {
    home.draws--;
    away.draws--;
    home.points--;
    away.points--;
  }
}

/* ---------------- SAVE ---------------- */
function saveMatchday() {

  let matches = fixtures[currentMatchday];

  let i = 0;

  while (i < matches.length) {

    let m = matches[i];

    let h = document.getElementById("h" + i).value;
    let a = document.getElementById("a" + i).value;

    if (m.played === true) {
      removeStats(m.home, m.away, m.homeScore, m.awayScore);
    }

    if (h !== "" && a !== "") {

      let homeGoals = Number(h);
      let awayGoals = Number(a);

      m.homeScore = homeGoals;
      m.awayScore = awayGoals;
      m.played = true;

      m.home.played++;
      m.away.played++;

      m.home.goalsFor += homeGoals;
      m.home.goalsAgainst += awayGoals;

      m.away.goalsFor += awayGoals;
      m.away.goalsAgainst += homeGoals;

      if (homeGoals > awayGoals) {
        m.home.wins++;
        m.home.points += 3;
        m.away.losses++;
      }

      else if (awayGoals > homeGoals) {
        m.away.wins++;
        m.away.points += 3;
        m.home.losses++;
      }

      else {
        m.home.draws++;
        m.away.draws++;
        m.home.points++;
        m.away.points++;
      }
    }

    i++;
  }

  saveData();
  renderTable();
}

/* ---------------- NEXT ---------------- */
function nextMatchday() {

  if (currentMatchday < fixtures.length - 1) {
    currentMatchday++;
    saveData();
    renderMatchday();
  } else {
    alert("Season Finished");
  }
}

/* ---------------- TABLE ---------------- */
function renderTable() {

  teams.sort(function (a, b) {
    return b.points - a.points;
  });

  let html = "";

  let i = 0;
  while (i < teams.length) {

    let t = teams[i];

    html += `
      <tr>
        <td>${t.name}</td>
        <td>${t.played}</td>
        <td>${t.points}</td>
      </tr>
    `;

    i++;
  }

  document.getElementById("table").innerHTML = html;
}

/* ---------------- INIT ---------------- */
loadData();
renderTable();
