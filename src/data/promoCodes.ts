export interface PromoCode {
  /** Altijd hoofdletters vergelijken — de klant kan het in elk geval intikken. */
  code: string;
  /** Kortingspercentage van het totaalbedrag, bv. 20 = 20%. */
  percentage: number;
  /** Optioneel label, puur voor jezelf — wordt nergens getoond aan de klant. */
  label?: string;
}

// EEN NIEUWE CODE TOEVOEGEN, STAP VOOR STAP (in GitHub, geen andere hulp nodig):
//   1. Open dit bestand op GitHub (src/data/promoCodes.ts) en klik op het
//      potloodje rechtsboven ("Edit this file").
//   2. Kopieer een bestaande regel tussen de [ ] hieronder en pas 'm aan:
//        { code: 'PRINTEMPS10', percentage: 10, label: 'Actie lente 2027' },
//      - code: wat de klant moet intikken (hoofdletters gebruiken wij hier
//        als gewoonte, maar de klant mag het in elk geval intikken).
//      - percentage: het kortingspercentage, bv. 15 = 15%.
//      - label: puur voor onszelf, wordt nooit aan de klant getoond.
//   3. Onderaan de pagina op GitHub: "Commit changes" (rechtstreeks naar de
//      main-branch, zoals we al deden) — klaar, geen build of upload nodig,
//      dat doet de hosting zelf.
//   Een code stopzetten: verwijder gewoon die hele regel en commit opnieuw.
//
// BELANGRIJK om te weten (geen technische instelling, gewoon hoe het werkt):
// een code wordt "gebruikt" onthouden op het TOESTEL/BROWSER van de klant
// zodra hij een bestelling verstuurt — niet centraal voor iedereen. Dat
// betekent: dezelfde klant kan een code niet nog een keer gebruiken op
// dezelfde telefoon/computer, maar iemand die de code doorstuurt naar een
// vriend kan er in theorie nog wel mee bestellen op hun eigen toestel. Voor
// een kleine kortingsactie is dat in de praktijk geen probleem — bij
// klantnamen persoonlijk toegekende codes (bv. per WhatsApp-bericht) is het
// misbruikrisico sowieso al laag, want de klant weet dat de code aan hem
// gekoppeld is.
export const PROMO_CODES: PromoCode[] = [
  { code: 'BIENVENUE20', percentage: 20, label: 'Réduction de bienvenue - première commande' },
];
