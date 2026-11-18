const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(code);
const nodes = new Map();
const doc = { activeElement: null, querySelector: get, querySelectorAll: () => [], body: {append(){}} };
function get(key) { if (!nodes.has(key)) { const classes=new Set();nodes.set(key,{value:'',type:key==='#password'?'password':'text',textContent:'',hidden:false,disabled:false,checked:false,dataset:{},offsetWidth:240,getBoundingClientRect(){return {left:key.includes('lamp')?800:200,width:240}},style:{setProperty(){},removeProperty(){}},classList:{add(...v){v.forEach(x=>classes.add(x));},remove(...v){v.forEach(x=>classes.delete(x));},contains(v){return classes.has(v)},toggle(v,b){if(b===undefined)b=!classes.has(v);b?classes.add(v):classes.delete(v);}},events:{},addEventListener(k,fn){this.events[k]=fn;},setAttribute(k,v){this[k]=v;},focus(){doc.activeElement=this;this.events.focus?.();},querySelector(s){return get(key+' '+s);},reset(){get('#username').value='';get('#password').value='';get('#remember').checked=false;}});}return nodes.get(key); }
const timeouts=[];
vm.runInNewContext(code,{document:doc,window:{addEventListener(){}},matchMedia:()=>({matches:true,addEventListener(){}}),setTimeout(fn){timeouts.push(fn);return timeouts.length;},clearTimeout(){},requestAnimationFrame(){},innerWidth:1200,innerHeight:900});
function assert(v,m){if(!v)throw Error(m);}
get('#login-form').onsubmit({preventDefault(){}});
assert(get('#user-error').textContent && get('#pass-error').textContent,'Empty-field validation');
assert(doc.activeElement===get('#username'),'Focus first invalid field');
get('#password').focus();assert(get('.world').classList.contains('secret'),'Eyes closed on focus');
get('#toggle-password').onclick();assert(get('#password').type==='text','Reveal password');
doc.activeElement=get('#username');get('#password').events.blur();assert(get('.world').classList.contains('secret'),'Eyes stay closed while password visible');
get('#username').value='Test';get('#password').value='fictif';get('#login-form').onsubmit({preventDefault(){}});assert(get('#submit').disabled,'Loading state');timeouts.at(-1)();
assert(get('#password').value==='','Secret cleared');assert(get('#success-view').hidden===false && get('#login-view').hidden,'Success view');assert(get('#greeting').textContent==='Bienvenue, Test.','Greeting');
get('#restart').onclick();assert(get('#login-view').hidden===false,'Reset');
get('#lamp').onclick();assert(get('.world').classList.contains('lamp-on'),'Lamp toggle');
assert(!/localStorage|sessionStorage|fetch\(/.test(code),'No credential storage or transmission');
console.log('PASS: syntax, required fields, focus, password privacy, loading, success, clearing, reset, lamp, no credential storage.');
