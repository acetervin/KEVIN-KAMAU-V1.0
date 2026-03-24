// ── MINI-GAMES ────────────────────────────────────────
var mgEl = document.getElementById('minigame');
var mgContent = document.getElementById('mg-content');

function openGame(skill) {
    mgEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    (GAMES[skill] || gameGeneric)(skill);
}

function closeGame() {
    mgEl.style.display = 'none';
    document.body.style.overflow = '';
}

mgEl.addEventListener('click', function (e) { if (e.target === mgEl) closeGame(); });
window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeGame(); });

function quiz(skill, icon, qs) {
    var qi = 0, score = 0;

    function render() {
        if (qi >= qs.length) {
            var resultIcon = score === qs.length ? '<i class="fa-solid fa-trophy"></i>' : score >= qs.length / 2 ? '<i class="fa-solid fa-medal"></i>' : '<i class="fa-solid fa-graduation-cap"></i>';
            var resultMsg = score === qs.length ? 'Perfect Score!' : score >= qs.length / 2 ? 'Well Done!' : 'Keep Practicing!';

            mgContent.innerHTML = `
        <div style="text-align:center; padding: 1rem 0;">
          <div class="mg-result-icon">${resultIcon}</div>
          <div class="mg-final-score">${score} / ${qs.length}</div>
          <div class="mg-final-label">${resultMsg}</div>
          <div class="mg-actions">
            <button class="mg-btn-pri" onclick="openGame('${skill}')">Try Again</button>
            <button class="mg-btn-sec" onclick="closeGame()">Exit Terminal</button>
          </div>
        </div>
      `;
            return;
        }

        var q = qs[qi];
        var opts = q.o.slice().sort(function () { return Math.random() - .5; });

        var h = `
      <div class="mg-title">${icon} <span>${skill}</span></div>
      <div class="mg-score">QUESTION ${qi + 1} OF ${qs.length} &nbsp;·&nbsp; SCORE: ${score}</div>
      <div class="mg-body">${q.q}</div>
      <div class="mg-btn-grid">
    `;

        opts.forEach(function (o) {
            h += `<button class="mg-btn" data-ans="${o}" data-correct="${q.a}">${o} <i class="fa-solid fa-chevron-right" style="font-size:0.6rem; opacity:0.3"></i></button>`;
        });

        h += `</div>`;
        mgContent.innerHTML = h;

        mgContent.querySelectorAll('.mg-btn[data-ans]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var chosen = this.dataset.ans, correct = this.dataset.correct;
                var allBtns = mgContent.querySelectorAll('.mg-btn');
                allBtns.forEach(function (b) { b.disabled = true; });

                if (chosen === correct) {
                    this.classList.add('right');
                    this.querySelector('i').className = 'fa-solid fa-check';
                    this.querySelector('i').style.opacity = '1';
                    score++;
                } else {
                    this.classList.add('wrong');
                    this.querySelector('i').className = 'fa-solid fa-xmark';
                    this.querySelector('i').style.opacity = '1';
                    allBtns.forEach(function (b) {
                        if (b.dataset.ans === correct) {
                            b.classList.add('right');
                            b.querySelector('i').className = 'fa-solid fa-check';
                            b.querySelector('i').style.opacity = '1';
                        }
                    });
                }
                qi++;
                setTimeout(render, 850);
            });
        });
    }
    mgContent.innerHTML = ''; render();
}

var GAMES = {
    'HTML5': function (s) { quiz(s, '<i class="fa-brands fa-html5"></i>', [{ q: 'Which tag creates a hyperlink?', a: '<a>', o: ['<a>', '<link>', '<href>', '<url>'] }, { q: 'Which tag defines a table row?', a: '<tr>', o: ['<tr>', '<td>', '<th>', '<row>'] }, { q: 'Attribute that makes input required?', a: 'required', o: ['required', 'mandatory', 'must', 'enforce'] }, { q: 'DOCTYPE goes where?', a: 'Before <html>', o: ['Before <html>', 'In <head>', 'In <body>', 'Anywhere'] }]); },
    'CSS3': function (s) { quiz(s, '<i class="fa-brands fa-css3-alt"></i>', [{ q: 'Property for text colour?', a: 'color', o: ['color', 'text-color', 'font-color', 'colour'] }, { q: 'Flexbox main axis?', a: 'row', o: ['row', 'column', 'inline', 'block'] }, { q: 'z-index controls?', a: 'Stack order', o: ['Stack order', 'Zoom', 'Opacity', 'Position'] }, { q: 'Unit relative to viewport width?', a: 'vw', o: ['vw', 'px', 'em', 'rem'] }]); },
    'JavaScript': function (s) { quiz(s, '<i class="fa-brands fa-js"></i>', [{ q: 'typeof null returns?', a: '"object"', o: ['"object"', '"null"', '"undefined"', '"boolean"'] }, { q: 'Add to end of array?', a: '.push()', o: ['.push()', '.append()', '.add()', '.insert()'] }, { q: '=== checks?', a: 'Value & type', o: ['Value & type', 'Value only', 'Type only', 'Reference'] }, { q: 'Arrow function syntax?', a: '() => {}', o: ['() => {}', 'function(){}', 'fn(){}', '() -> {}'] }]); },
    'Python': function (s) { quiz(s, '<i class="fa-brands fa-python"></i>', [{ q: 'Comment in Python?', a: '#', o: ['#', '//', '/*', '--'] }, { q: 'Python list is?', a: 'Mutable', o: ['Mutable', 'Immutable', 'Static', 'Fixed'] }, { q: 'Define function with?', a: 'def', o: ['def', 'func', 'function', 'fn'] }, { q: 'len([1,2,3]) = ?', a: '3', o: ['3', '2', '4', 'Error'] }]); },

    'React': function (s) { quiz(s, '<i class="fa-brands fa-react"></i>', [{ q: 'State updates are?', a: 'Asynchronous', o: ['Asynchronous', 'Synchronous', 'Immediate', 'Blocking'] }, { q: 'JSX stands for?', a: 'JavaScript XML', o: ['JavaScript XML', 'Java Syntax Ext', 'JSON XML', 'JS Extra'] }, { q: 'Hook for side effects?', a: 'useEffect', o: ['useEffect', 'useState', 'useMemo', 'useRef'] }, { q: 'Virtual DOM purpose?', a: 'Performance', o: ['Performance', 'Security', 'Storage', 'Routing'] }]); },
    'Node.js': function (s) { quiz(s, '<i class="fa-brands fa-node-js"></i>', [{ q: 'Node.js runs on?', a: 'V8 engine', o: ['V8 engine', 'SpiderMonkey', 'Chakra', 'Nitro'] }, { q: 'require() does what?', a: 'Imports a module', o: ['Imports a module', 'Exports', 'Deletes', 'Compiles'] }, { q: 'npm stands for?', a: 'Node Package Manager', o: ['Node Package Manager', 'New Project Module', 'Node Process Mgr', 'Net Package Mod'] }, { q: 'package.json stores?', a: 'Metadata & deps', o: ['Metadata & deps', 'Source code', 'Build output', 'Test results'] }]); },
    'PostgreSQL': function (s) { quiz(s, '<i class="fa-solid fa-database"></i>', [{ q: 'SELECT * FROM means?', a: 'All columns', o: ['All columns', 'First column', 'Last row', 'Count rows'] }, { q: 'JOIN combines?', a: 'Rows from multiple tables', o: ['Rows from multiple tables', 'Columns only', 'Two databases', 'Arrays'] }, { q: 'PRIMARY KEY must be?', a: 'Unique & not null', o: ['Unique & not null', 'Only unique', 'Only not null', 'Indexed'] }, { q: 'GROUP BY used with?', a: 'Aggregate functions', o: ['Aggregate functions', 'WHERE clause', 'ORDER BY', 'LIMIT'] }]); },
    'Firebase': function (s) { quiz(s, '<i class="fa-solid fa-fire"></i>', [{ q: 'Firebase made by?', a: 'Google', o: ['Google', 'Meta', 'Microsoft', 'Amazon'] }, { q: 'Firestore stores as?', a: 'Documents', o: ['Documents', 'Rows', 'Files', 'Nodes'] }, { q: 'Real-time updates use?', a: 'onSnapshot', o: ['onSnapshot', 'getDoc', 'listen', 'subscribe'] }, { q: 'Firebase Auth supports?', a: 'Email, Google, GitHub+', o: ['Email, Google, GitHub+', 'Email only', 'Social only', 'Phone only'] }]); },
    'Git': function (s) { quiz(s, '<i class="fa-brands fa-github"></i>', [{ q: 'git init does?', a: 'Creates a new repo', o: ['Creates a new repo', 'Clones a repo', 'Deletes history', 'Pushes code'] }, { q: 'Undo last commit (keep changes)?', a: 'git reset HEAD~1', o: ['git reset HEAD~1', 'git revert HEAD', 'git undo', 'git rollback'] }, { q: 'git stash does?', a: 'Saves changes temporarily', o: ['Saves changes temporarily', 'Deletes changes', 'Commits', 'Pushes'] }, { q: 'Merge vs Rebase?', a: 'Rebase rewrites history', o: ['Rebase rewrites history', 'Merge rewrites history', 'Identical', 'Merge is faster'] }]); },
    'Tailwind': function (s) { quiz(s, '<i class="fa-brands fa-css3-alt"></i>', [{ q: 'Tailwind is?', a: 'Utility-first CSS', o: ['Utility-first CSS', 'Component library', 'CSS-in-JS', 'Preprocessor'] }, { q: 'p-4 sets padding to?', a: '1rem', o: ['1rem', '4px', '4rem', '0.4rem'] }, { q: 'flex-col changes?', a: 'Flex direction to column', o: ['Flex direction to column', 'Adds columns', 'Flex wrap', 'Flex grow'] }, { q: 'hover: applies on?', a: 'Mouse hover', o: ['Mouse hover', 'Focus', 'Active click', 'Always'] }]); },
    'Figma': function (s) { quiz(s, '<i class="fa-brands fa-figma"></i>', [{ q: 'Figma is for?', a: 'UI/UX Design', o: ['UI/UX Design', 'Code editing', 'DB design', 'Video'] }, { q: 'Components allow?', a: 'Reusable elements', o: ['Reusable elements', 'Code generation', 'Animation only', 'Export only'] }, { q: 'Auto Layout does?', a: 'Responsive sizing', o: ['Responsive sizing', 'Code export', 'Color mgmt', 'Font load'] }, { q: 'Prototype mode?', a: 'Simulate user flows', o: ['Simulate user flows', 'Write code', 'Export assets', 'Manage fonts'] }]); },
    'Cloud': function (s) { quiz(s, '<i class="fa-brands fa-aws"></i>', [{ q: 'IaaS stands for?', a: 'Infrastructure as a Service', o: ['Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Interface as a Service'] }, { q: 'S3 in AWS is for?', a: 'Object storage', o: ['Object storage', 'Computing', 'Networking', 'Databases'] }, { q: 'CDN stands for?', a: 'Content Delivery Network', o: ['Content Delivery Network', 'Central Data Node', 'Cloud Distribution Net', 'Content Data Node'] }, { q: 'Serverless means?', a: 'No server management', o: ['No server management', 'No servers at all', 'Free servers', 'One server'] }]); },
    'DevOps': function (s) { quiz(s, '<i class="fa-solid fa-gears"></i>', [{ q: 'CI/CD stands for?', a: 'Continuous Integration/Delivery', o: ['Continuous Integration/Delivery', 'Code Inspection/Deployment', 'Central Integration/Dist', 'Custom Int/Delivery'] }, { q: 'Docker containers are?', a: 'Lightweight isolated envs', o: ['Lightweight isolated envs', 'Full VMs', 'Linux only', 'Cloud storage'] }, { q: 'Kubernetes orchestrates?', a: 'Containers', o: ['Containers', 'Databases', 'DNS', 'Files'] }, { q: 'GitHub Actions is?', a: 'CI/CD platform', o: ['CI/CD platform', 'Code editor', 'Version control', 'Package manager'] }]); },
    'TypeScript': function (s) { quiz(s, '<i class="fa-brands fa-js"></i>', [{ q: 'TypeScript is a superset of?', a: 'JavaScript', o: ['JavaScript', 'Java', 'Python', 'C#'] }, { q: 'any type does?', a: 'Disables type checking', o: ['Disables type checking', 'Accepts one type', 'Makes faster', 'Enables strict mode'] }, { q: 'TS files use?', a: '.ts', o: ['.ts', '.tsx', '.js', '.types'] }, { q: 'interface vs type?', a: 'interface is extendable', o: ['interface is extendable', 'type is extendable', 'Identical', 'interface is faster'] }]); },
    'PHP': function (s) { quiz(s, '<i class="fa-brands fa-php"></i>', [{ q: 'PHP variables start with?', a: '$', o: ['$', '@', '#', '&'] }, { q: 'echo does?', a: 'Outputs text', o: ['Outputs text', 'Returns value', 'Imports file', 'Defines function'] }, { q: 'PHP runs on?', a: 'Server', o: ['Server', 'Browser', 'Both', 'Neither'] }, { q: 'PHP file extension?', a: '.php', o: ['.php', '.ph', '.php3', '.phps'] }]); },
    'Linux': function (s) { quiz(s, '<i class="fa-brands fa-linux"></i>', [{ q: 'ls command does?', a: 'Lists directory', o: ['Lists directory', 'Loads system', 'Links files', 'Logs status'] }, { q: 'chmod 777 means?', a: 'Full permissions all', o: ['Full permissions all', 'Read only', 'Owner only', 'No permissions'] }, { q: 'grep searches?', a: 'Patterns in files', o: ['Patterns in files', 'Processes', 'GPU usage', 'Network'] }, { q: 'sudo means?', a: 'Super user do', o: ['Super user do', 'System update', 'Safe user do', 'Startup daemon'] }]); },
    'VSCode': function (s) { quiz(s, '<i class="fa-brands fa-microsoft"></i>', [{ q: 'Command palette?', a: 'Ctrl+Shift+P', o: ['Ctrl+Shift+P', 'Ctrl+P', 'Alt+F4', 'Ctrl+Alt+P'] }, { q: 'Multi-cursor?', a: 'Alt+Click', o: ['Alt+Click', 'Ctrl+Click', 'Shift+Click', 'Right Click'] }, { q: 'Extensions tab?', a: 'Ctrl+Shift+X', o: ['Ctrl+Shift+X', 'Ctrl+E', 'Ctrl+X', 'Alt+E'] }, { q: 'Integrated terminal?', a: 'Ctrl+`', o: ['Ctrl+`', 'Ctrl+T', 'Alt+T', 'Ctrl+Shift+T'] }]); },
};

function gameGeneric(skill) {
    quiz(skill, '<i class="fa-solid fa-lightbulb"></i>', [
        { q: "Kevin Kamau is based in?", a: 'Nairobi, Kenya', o: ['Nairobi, Kenya', 'Mombasa, Kenya', 'Kisumu, Kenya', 'Nakuru, Kenya'] },
        { q: "Kevin's GitHub handle?", a: '@acetervin', o: ['@acetervin', '@kevinkamau', '@kk_dev', '@acedev'] },
        { q: "Kevin is based in?", a: 'Nairobi, Kenya', o: ['Nairobi, Kenya', 'Lagos, Nigeria', 'Kampala, Uganda', 'Dar es Salaam'] },
        { q: "Kevin's flagship project?", a: "Allen's Kitchen", o: ["Allen's Kitchen", 'Admin Dashboard', 'AraChat', 'FinFlow'] },
    ]);
}
