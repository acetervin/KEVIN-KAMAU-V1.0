// ── MINI-GAMES ────────────────────────────────────────
var mgEl=document.getElementById('minigame');
var mgContent=document.getElementById('mg-content');

function openGame(skill){
  mgEl.style.display='flex';
  document.body.style.overflow='hidden';
  (GAMES[skill]||gameGeneric)(skill);
}

function closeGame(){
  mgEl.style.display='none';
  document.body.style.overflow='';
}

mgEl.addEventListener('click',function(e){if(e.target===mgEl)closeGame();});
window.addEventListener('keydown',function(e){if(e.key==='Escape')closeGame();});

function quiz(skill,icon,qs){
  var qi=0,score=0;
  function render(){
    if(qi>=qs.length){
      mgContent.innerHTML='<div class="mg-title">'+icon+' '+skill+' Complete!</div><div class="mg-body">Score: <span style="color:#d4a84b;font-size:1.4rem;">'+score+'/'+qs.length+'</span></div><div class="mg-body">'+(score===qs.length?'<i class="fa-solid fa-trophy" aria-hidden="true"></i> Perfect!':score>=qs.length/2?'<i class="fa-solid fa-thumbs-up" aria-hidden="true"></i> Solid!':'<i class="fa-solid fa-book" aria-hidden="true"></i> Keep learning!')+'</div><button class="mg-btn" onclick="openGame(\'"+skill+"\')">Again</button> <button class="mg-btn" style="background:#333;color:#fff;" onclick="closeGame()">Close</button>';
      return;
    }
    var q=qs[qi];
    var opts=q.o.slice().sort(function(){return Math.random()-.5;});
    var h='<div class="mg-title">'+icon+' '+skill+'</div><div class="mg-score">Q'+(qi+1)+'/'+qs.length+' · Score: '+score+'</div><div class="mg-body">'+q.q+'</div>';
    opts.forEach(function(o){h+='<button class="mg-btn" data-ans="'+o+'" data-correct="'+q.a+'">'+o+'</button>';});
    mgContent.innerHTML=h;
    mgContent.querySelectorAll('.mg-btn[data-ans]').forEach(function(btn){
      btn.addEventListener('click',function(){
        var chosen=this.dataset.ans,correct=this.dataset.correct;
        mgContent.querySelectorAll('.mg-btn').forEach(function(b){b.disabled=true;});
        if(chosen===correct){this.classList.add('right');score++;}
        else{this.classList.add('wrong');mgContent.querySelectorAll('.mg-btn').forEach(function(b){if(b.dataset.ans===correct)b.classList.add('right');});}
        qi++;setTimeout(render,750);
      });
    });
  }
  mgContent.innerHTML='';render();
}

var GAMES={
  'HTML5':    function(s){quiz(s,'<i class="fa-brands fa-html5" aria-hidden="true"></i>',[{q:'Which tag creates a hyperlink?',a:'&lt;a&gt;',o:['&lt;a&gt;','&lt;link&gt;','&lt;href&gt;','&lt;url&gt;']},{q:'Which tag defines a table row?',a:'&lt;tr&gt;',o:['&lt;tr&gt;','&lt;td&gt;','&lt;th&gt;','&lt;row&gt;']},{q:'Attribute that makes input required?',a:'required',o:['required','mandatory','must','enforce']},{q:'DOCTYPE goes where?',a:'Before &lt;html&gt;',o:['Before &lt;html&gt;','In &lt;head&gt;','In &lt;body&gt;','Anywhere']}]);},
  'CSS3':     function(s){quiz(s,'<i class="fa-brands fa-css3-alt" aria-hidden="true"></i>',[{q:'Property for text colour?',a:'color',o:['color','text-color','font-color','colour']},{q:'Flexbox main axis?',a:'row',o:['row','column','inline','block']},{q:'z-index controls?',a:'Stack order',o:['Stack order','Zoom','Opacity','Position']},{q:'Unit relative to viewport width?',a:'vw',o:['vw','px','em','rem']}]);},
  'JavaScript':function(s){quiz(s,'<i class="fa-brands fa-js" aria-hidden="true"></i>',[{q:'typeof null returns?',a:'"object"',o:['"object"','"null"','"undefined"','"boolean"']},{q:'Add to end of array?',a:'.push()',o:['.push()','.append()','.add()','.insert()']},{q:'=== checks?',a:'Value & type',o:['Value & type','Value only','Type only','Reference']},{q:'Arrow function syntax?',a:'() => {}',o:['() => {}','function(){}','fn(){}','() -> {}']}]);},
  'Python':   function(s){quiz(s,'<i class="fa-brands fa-python" aria-hidden="true"></i>',[{q:'Comment in Python?',a:'#',o:['#','//','/*','--']},{q:'Python list is?',a:'Mutable',o:['Mutable','Immutable','Static','Fixed']},{q:'Define function with?',a:'def',o:['def','func','function','fn']},{q:'len([1,2,3]) = ?',a:'3',o:['3','2','4','Error']}]);},
  'Java':     function(s){quiz(s,'<i class="fa-brands fa-java" aria-hidden="true"></i>',[{q:'Java is ___ typed',a:'Statically',o:['Statically','Dynamically','Loosely','Weakly']},{q:'Which is NOT a primitive?',a:'String',o:['String','int','boolean','char']},{q:'OOP stands for?',a:'Object-Oriented Programming',o:['Object-Oriented Programming','Open-Origin Protocol','Object-Only Processing','Output-Oriented Process']},{q:'// in Java means?',a:'Comment',o:['Comment','Division','URL','Escape']}]);},
  'React':    function(s){quiz(s,'<i class="fa-brands fa-react" aria-hidden="true"></i>',[{q:'State updates are?',a:'Asynchronous',o:['Asynchronous','Synchronous','Immediate','Blocking']},{q:'JSX stands for?',a:'JavaScript XML',o:['JavaScript XML','Java Syntax Ext','JSON XML','JS Extra']},{q:'Hook for side effects?',a:'useEffect',o:['useEffect','useState','useMemo','useRef']},{q:'Virtual DOM purpose?',a:'Performance',o:['Performance','Security','Storage','Routing']}]);},
  'Node.js':  function(s){quiz(s,'<i class="fa-brands fa-node-js" aria-hidden="true"></i>',[{q:'Node.js runs on?',a:'V8 engine',o:['V8 engine','SpiderMonkey','Chakra','Nitro']},{q:'require() does what?',a:'Imports a module',o:['Imports a module','Exports','Deletes','Compiles']},{q:'npm stands for?',a:'Node Package Manager',o:['Node Package Manager','New Project Module','Node Process Mgr','Net Package Mod']},{q:'package.json stores?',a:'Metadata & deps',o:['Metadata & deps','Source code','Build output','Test results']}]);},
  'PostgreSQL':function(s){quiz(s,'<i class="fa-solid fa-database" aria-hidden="true"></i>',[{q:'SELECT * FROM means?',a:'All columns',o:['All columns','First column','Last row','Count rows']},{q:'JOIN combines?',a:'Rows from multiple tables',o:['Rows from multiple tables','Columns only','Two databases','Arrays']},{q:'PRIMARY KEY must be?',a:'Unique & not null',o:['Unique & not null','Only unique','Only not null','Indexed']},{q:'GROUP BY used with?',a:'Aggregate functions',o:['Aggregate functions','WHERE clause','ORDER BY','LIMIT']}]);},
  'Firebase': function(s){quiz(s,'<i class="fa-solid fa-fire" aria-hidden="true"></i>',[{q:'Firebase made by?',a:'Google',o:['Google','Meta','Microsoft','Amazon']},{q:'Firestore stores as?',a:'Documents',o:['Documents','Rows','Files','Nodes']},{q:'Real-time updates use?',a:'onSnapshot',o:['onSnapshot','getDoc','listen','subscribe']},{q:'Firebase Auth supports?',a:'Email, Google, GitHub+',o:['Email, Google, GitHub+','Email only','Social only','Phone only']}]);},
  'Git':      function(s){quiz(s,'<i class="fa-brands fa-github" aria-hidden="true"></i>',[{q:'git init does?',a:'Creates a new repo',o:['Creates a new repo','Clones a repo','Deletes history','Pushes code']},{q:'Undo last commit (keep changes)?',a:'git reset HEAD~1',o:['git reset HEAD~1','git revert HEAD','git undo','git rollback']},{q:'git stash does?',a:'Saves changes temporarily',o:['Saves changes temporarily','Deletes changes','Commits','Pushes']},{q:'Merge vs Rebase?',a:'Rebase rewrites history',o:['Rebase rewrites history','Merge rewrites history','Identical','Merge is faster']}]);},
  'Tailwind': function(s){quiz(s,'<i class="fa-brands fa-css3-alt" aria-hidden="true"></i>',[{q:'Tailwind is?',a:'Utility-first CSS',o:['Utility-first CSS','Component library','CSS-in-JS','Preprocessor']},{q:'p-4 sets padding to?',a:'1rem',o:['1rem','4px','4rem','0.4rem']},{q:'flex-col changes?',a:'Flex direction to column',o:['Flex direction to column','Adds columns','Flex wrap','Flex grow']},{q:'hover: applies on?',a:'Mouse hover',o:['Mouse hover','Focus','Active click','Always']}]);},
  'Figma':    function(s){quiz(s,'<i class="fa-brands fa-figma" aria-hidden="true"></i>',[{q:'Figma is for?',a:'UI/UX Design',o:['UI/UX Design','Code editing','DB design','Video']},{q:'Components allow?',a:'Reusable elements',o:['Reusable elements','Code generation','Animation only','Export only']},{q:'Auto Layout does?',a:'Responsive sizing',o:['Responsive sizing','Code export','Color mgmt','Font load']},{q:'Prototype mode?',a:'Simulate user flows',o:['Simulate user flows','Write code','Export assets','Manage fonts']}]);},
  'Cloud':    function(s){quiz(s,'<i class="fa-brands fa-aws" aria-hidden="true"></i>',[{q:'IaaS stands for?',a:'Infrastructure as a Service',o:['Infrastructure as a Service','Internet as a Service','Integration as a Service','Interface as a Service']},{q:'S3 in AWS is for?',a:'Object storage',o:['Object storage','Computing','Networking','Databases']},{q:'CDN stands for?',a:'Content Delivery Network',o:['Content Delivery Network','Central Data Node','Cloud Distribution Net','Content Data Node']},{q:'Serverless means?',a:'No server management',o:['No server management','No servers at all','Free servers','One server']}]);},
  'DevOps':   function(s){quiz(s,'<i class="fa-solid fa-gears" aria-hidden="true"></i>',[{q:'CI/CD stands for?',a:'Continuous Integration/Delivery',o:['Continuous Integration/Delivery','Code Inspection/Deployment','Central Integration/Dist','Custom Int/Delivery']},{q:'Docker containers are?',a:'Lightweight isolated envs',o:['Lightweight isolated envs','Full VMs','Linux only','Cloud storage']},{q:'Kubernetes orchestrates?',a:'Containers',o:['Containers','Databases','DNS','Files']},{q:'GitHub Actions is?',a:'CI/CD platform',o:['CI/CD platform','Code editor','Version control','Package manager']}]);},
  'TypeScript':function(s){quiz(s,'<i class="fa-brands fa-js" aria-hidden="true"></i>',[{q:'TypeScript is a superset of?',a:'JavaScript',o:['JavaScript','Java','Python','C#']},{q:'any type does?',a:'Disables type checking',o:['Disables type checking','Accepts one type','Makes faster','Enables strict mode']},{q:'TS files use?',a:'.ts',o:['.ts','.tsx','.js','.types']},{q:'interface vs type?',a:'interface is extendable',o:['interface is extendable','type is extendable','Identical','interface is faster']}]);},
  'PHP':      function(s){quiz(s,'<i class="fa-brands fa-php" aria-hidden="true"></i>',[{q:'PHP variables start with?',a:'$',o:['$','@','#','&']},{q:'echo does?',a:'Outputs text',o:['Outputs text','Returns value','Imports file','Defines function']},{q:'PHP runs on?',a:'Server',o:['Server','Browser','Both','Neither']},{q:'PHP file extension?',a:'.php',o:['.php','.ph','.php3','.phps']}]);},
  'Linux':    function(s){quiz(s,'<i class="fa-brands fa-linux" aria-hidden="true"></i>',[{q:'ls command does?',a:'Lists directory',o:['Lists directory','Loads system','Links files','Logs status']},{q:'chmod 777 means?',a:'Full permissions all',o:['Full permissions all','Read only','Owner only','No permissions']},{q:'grep searches?',a:'Patterns in files',o:['Patterns in files','Processes','GPU usage','Network']},{q:'sudo means?',a:'Super user do',o:['Super user do','System update','Safe user do','Startup daemon']}]);},
  'VSCode':   function(s){quiz(s,'<i class="fa-brands fa-microsoft" aria-hidden="true"></i>',[{q:'Command palette?',a:'Ctrl+Shift+P',o:['Ctrl+Shift+P','Ctrl+P','Alt+F4','Ctrl+Alt+P']},{q:'Multi-cursor?',a:'Alt+Click',o:['Alt+Click','Ctrl+Click','Shift+Click','Right Click']},{q:'Extensions tab?',a:'Ctrl+Shift+X',o:['Ctrl+Shift+X','Ctrl+E','Ctrl+X','Alt+E']},{q:'Integrated terminal?',a:'Ctrl+`',o:['Ctrl+`','Ctrl+T','Alt+T','Ctrl+Shift+T']}]);},
};

function gameGeneric(skill){
  quiz(skill,'💡',[
    {q:"Kevin Kamau studies at?",a:'Kirinyaga University',o:['Kirinyaga University','Nairobi University','KCA University','Strathmore']},
    {q:"Kevin's GitHub handle?",a:'@acetervin',o:['@acetervin','@kevinkamau','@kk_dev','@acedev']},
    {q:"Kevin is based in?",a:'Nairobi, Kenya',o:['Nairobi, Kenya','Lagos, Nigeria','Kampala, Uganda','Dar es Salaam']},
    {q:"Kevin's flagship project?",a:"Allen's Kitchen",o:["Allen's Kitchen",'Admin Dashboard','AraChat','FinFlow']},
  ]);
}
