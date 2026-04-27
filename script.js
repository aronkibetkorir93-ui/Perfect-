const teamNames = [
    "IAN TOO", "BLAMEK", "KHOLS JUDE", "BOSCO", "KIBET ARON", 
    "BRALYN KIPKIRUI", "LINOO", "MANU KHEED", "HOLY PLUG", 
    "IANOHM", "FELLO MARK", "ANDERSCO KEVELYSON", "MANU JOSH", "ARLUSH"
];

// Initialize data structure
let teams = JSON.parse(localStorage.getItem('efl_teams')) || teamNames.map(name => ({
    name, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0
}));

function renderTable() {
    // Sort by Pts, then GD, then GF
    teams.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = teams.map((t, i) => `
        <tr>
            <td>${i + 1}</td>
            <td class="team-col">${t.name}</td>
            <td>${t.p}</td>
            <td>${t.w}</td>
            <td>${t.d}</td>
            <td>${t.l}</td>
            <td>${t.gf}</td>
            <td>${t.ga}</td>
            <td>${t.gd}</td>
            <td><strong>${t.pts}</strong></td>
        </tr>
    `).join('');
}

function checkAuth() {
    if(document.getElementById('admin-pass').value === "1234") { // Set your password here
        document.getElementById('admin-panel').style.display = "block";
        document.getElementById('admin-auth').style.display = "none";
        setupFixtureInputs();
    }
}

function setupFixtureInputs() {
    const container = document.getElementById('fixtures-input-list');
    // Simplified: Just shows all teams in pairs for input
    container.innerHTML = "";
    for(let i=0; i < teams.length; i+=2) {
        container.innerHTML += `
            <div style="margin: 10px 0;">
                <span>${teams[i].name}</span>
                <input type="number" id="score-${i}"> vs 
                <input type="number" id="score-${i+1}">
                <span>${teams[i+1].name}</span>
            </div>
        `;
    }
}

function processScores() {
    for(let i=0; i < teams.length; i+=2) {
        const s1 = parseInt(document.getElementById(`score-${i}`).value);
        const s2 = parseInt(document.getElementById(`score-${i+1}`).value);

        if(!isNaN(s1) && !isNaN(s2)) {
            updateTeamStats(teams[i], s1, s2);
            updateTeamStats(teams[i+1], s2, s1);
        }
    }
    localStorage.setItem('efl_teams', JSON.stringify(teams));
    renderTable();
    alert("Scores Updated!");
}

function updateTeamStats(team, gf, ga) {
    team.p += 1;
    team.gf += gf;
    team.ga += ga;
    team.gd = team.gf - team.ga;
    if (gf > ga) { team.w += 1; team.pts += 3; }
    else if (gf === ga) { team.d += 1; team.pts += 1; }
    else { team.l += 1; }
}

renderTable();
