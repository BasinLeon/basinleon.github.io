import { EXAMPLES, KEYWORDS, score } from './model.mjs';
const byId = id => document.getElementById(id);
let current = EXAMPLES[0];
let lastSummary = '';
let announce;
function row() { return { company:current.company, name:current.name, title:byId('title-input').value, description:byId('description-input').value }; }
function list(id, values, empty) {
  const host = byId(id); host.replaceChildren();
  (values.length ? values : [empty]).forEach(text => { const li = document.createElement('li'); li.textContent = text === 'ae ' ? 'ae + space' : text; host.append(li); });
}
function update() {
  const result = score(row()); const baseline = score(current);
  byId('priority').textContent = result.priority;
  byId('priority').dataset.tier = result.priority;
  byId('reason').textContent = result.reason;
  byId('baseline').textContent = baseline.priority;
  byId('current-tier').textContent = result.priority;
  byId('friction-count').textContent = result.friction + ' / ' + KEYWORDS.friction.length;
  byId('category').textContent = result.category;
  byId('strength').textContent = result.strength + ' / 100';
  byId('technical-count').textContent = result.technicalMatches.length;
  byId('sales-count').textContent = result.salesMatches.length;
  byId('strength-reason').textContent = result.category === 'Mixed' ? 'Equal keyword counts use the prototype’s fixed score of 50.' : 'Winning keyword count × 20, capped at 100. This is not a probability.';
  list('friction-matches', result.frictionMatches, 'No sales/GTM keywords matched');
  list('technical-matches', result.technicalMatches, 'No technical keywords matched');
  list('sales-matches', result.salesMatches, 'No sales-profile keywords matched');
  document.querySelectorAll('[data-rule]').forEach(item => {
    const active = item.dataset.rule === result.priority;
    item.classList.toggle('active-rule', active);
    item.querySelector('[data-applied]').hidden = !active;
  });
  const summary = result.priority + '. ' + result.friction + ' sales/GTM matches. ' + result.category + ' category. ' + result.reason;
  if (summary !== lastSummary) {
    clearTimeout(announce);
    announce = setTimeout(() => { byId('score-status').textContent = summary; }, 250);
    lastSummary = summary;
  }
}
function load(id, announceLoad = false) {
  current = EXAMPLES.find(item => item.id === id) || EXAMPLES[0];
  byId('example-select').value = current.id;
  byId('company').textContent = current.company;
  byId('person').textContent = current.name + ' · fictional contact';
  byId('title-input').value = current.title;
  byId('description-input').value = current.description;
  update();
  if (announceLoad) byId('load-status').textContent = current.company + ' loaded. Change a field below to see the result.';
}
byId('load-example').addEventListener('click', () => {
  load('northstar', true);
  byId('workspace').scrollIntoView({block:'start'});
  byId('example-select').focus({preventScroll:true});
});
byId('example-select').addEventListener('change', e => load(e.target.value, true));
byId('reset-example').addEventListener('click', () => load(current.id, true));
byId('remove-signals').addEventListener('click', () => {
  byId('description-input').value = 'Security engineer building a product.';
  update();
});
byId('add-signals').addEventListener('click', () => {
  byId('description-input').value = 'Security engineer hiring account executive and SDR for revenue operations.';
  update();
});
['title-input', 'description-input'].forEach(id => byId(id).addEventListener('input', update));
byId('download-result').addEventListener('click', () => {
  const data = { example:'Synthetic Signal Architect demonstration', input:row(), result:score(row()), limits:'Keyword heuristics, not verified hiring or purchase intent.' };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2) + '\n'], {type:'application/json'}));
  const link = document.createElement('a'); link.href = url; link.download = 'signal-architect-example.json'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
document.querySelectorAll('[data-demo-control]').forEach(control => { control.disabled = false; });
load('northstar');
