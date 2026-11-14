// Browser port of the public Python prototype's keyword and priority rules.
export const KEYWORDS = Object.freeze({
  friction: ['sales', 'account executive', 'ae ', 'sdr', 'bdr', 'business development', 'revenue'],
  technical: ['engineer', 'cto', 'vp engineering', 'developer', 'technical founder', 'phd', 'security', 'infosec'],
  sales: ['vp sales', 'cro', 'chief revenue', 'sales leader', 'head of sales']
});
export const EXAMPLES = Object.freeze([
  { id:'northstar', company:'Northstar Demo', name:'Taylor Example', title:'CTO and technical founder', description:'Security engineer hiring account executive and SDR for revenue operations.' },
  { id:'harbor', company:'Harbor Demo', name:'Morgan Example', title:'VP Sales', description:'Sales leader hiring BDR.' },
  { id:'meadow', company:'Meadow Demo', name:'Casey Example', title:'Operations owner', description:'Regional operations and customer service.' }
]);
export function score(row) {
  const text = [row.company, row.name, row.title, row.description].filter(x => x != null).map(String).join(' ').toLowerCase();
  const matches = words => words.filter(word => text.includes(word));
  const frictionMatches = matches(KEYWORDS.friction);
  const technicalMatches = matches(KEYWORDS.technical);
  const salesMatches = matches(KEYWORDS.sales);
  const technicalWins = technicalMatches.length > salesMatches.length;
  const salesWins = salesMatches.length > technicalMatches.length;
  const category = technicalWins ? 'Technical' : salesWins ? 'Sales' : 'Mixed';
  const strength = category === 'Mixed' ? 50 : Math.min((technicalWins ? technicalMatches.length : salesMatches.length) * 20, 100);
  const friction = frictionMatches.length;
  let priority, reason;
  if (friction >= 3 && technicalWins && strength >= 60) {
    priority = 'P0'; reason = 'At least 3 sales/GTM matches, a technical keyword majority, and rule strength of at least 60.';
  } else if (friction >= 2 && technicalWins) {
    priority = 'P1'; reason = 'At least 2 sales/GTM matches and a technical keyword majority. The P0 conditions are not all met.';
  } else if (friction >= 2 || technicalWins) {
    priority = 'P2'; reason = friction >= 2 ? 'At least 2 sales/GTM matches. There is no technical keyword majority.' : 'Technical keywords alone reach P2, even with fewer than 2 sales/GTM matches.';
  } else {
    priority = 'P3'; reason = 'Fewer than 2 sales/GTM matches and no technical keyword majority.';
  }
  return { priority, category, strength, friction, frictionMatches, technicalMatches, salesMatches, reason };
}
