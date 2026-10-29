const fs=require('fs'),vm=require('vm'),assert=require('assert');
const el=new Map();const element=id=>{if(!el.has(id))el.set(id,{textContent:'',innerHTML:'',value:'all',hidden:false,disabled:false,style:{},classList:{toggle(){}},addEventListener(){},close(){this.open=false},showModal(){this.open=true}});return el.get(id)};
const storage=new Map(),context=vm.createContext({document:{getElementById:element,addEventListener(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},console,setTimeout,confirm:()=>true});
vm.runInContext(fs.readFileSync('dist/flashcards/questions.js','utf8'),context);vm.runInContext(fs.readFileSync('dist/flashcards/app.js','utf8'),context);
const run=s=>vm.runInContext(s,context);
assert.equal(run('questions.length'),224);assert.equal(run('questions.reduce((n,q)=>n+q.blanks,0)'),306);assert.equal(run('round.ids.length'),20);
assert(!element('sentence').innerHTML.includes('亞洲'));assert(element('sentence').innerHTML.includes('aria-label="空格"'));
run('flip()');assert(element('sentence').innerHTML.includes('亞洲'));run("mark('review')");assert.equal(run("record[1]"),'review');assert.equal(run('round.index'),1);assert.equal(run('revealed'),false);
run("flip();mark('known')");assert.equal(run("record[2]"),'known');run('move(-1)');assert.equal(run('revealed'),false);
assert.equal(run("filtered({...defaults,deck:'review'}).length"),1);assert.equal(run("filtered({...defaults,deck:'new'}).length"),222);
for(const topic of run('topics.map(t=>t.id)')){assert(run(`filtered({...defaults,topic:'${topic}'}).every(q=>q.topic===${topic})`))}
run("begin({...defaults,size:'all'}); for(let i=0;i<224;i++){flip();mark(i%2?'known':'review')}");assert.equal(run('round.index'),224);assert.equal(element('summary').hidden,false);assert.equal(run('Object.keys(record).length'),224);
const saved=JSON.parse(storage.get('taiwan-social-flashcards-v1'));assert.equal(saved.round.ids.length,224);assert.equal(saved.round.index,224);
run("begin({...defaults,deck:'review',size:'all',random:true})");assert.equal(run('round.ids.length'),112);assert.equal(run('new Set(round.ids).size'),112);
assert.equal(run('filledSentence("題目{{<script>}}",true).includes("<script>")'),false);
console.log('PASS: 224 cards, 306 blanks; hidden/revealed answers; rating and round completion; topic/review filters; shuffle; persisted progress; safe rendering');
