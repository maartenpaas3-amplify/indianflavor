export interface PromoCode {
  /** Altijd hoofdletters vergelijken — de klant kan het in elk geval intikken. */
  code: string;
  /** Kortingspercentage van het totaalbedrag, bv. 20 = 20%. */
  percentage: number;
  /** Optioneel label, puur voor jezelf — wordt nergens getoond aan de klant. */
  label?: string;
}

// Voeg hier gewoon een nieuwe regel toe voor een nieuwe code, of verwijder een
// regel om een code stop te zetten. Meer hoeft er niet aangepast te worden.
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
  { code: 'WELKOM20', percentage: 20, label: 'Welkomstkorting eerste bestelling' },
];
