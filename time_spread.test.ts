import { assertEquals } from '@std/assert';
import { spreadEntriesAcrossWeeks } from './time_spread.ts';

Deno.test('Spread multiple entries across multiple weeks.', () => {
  const entries = [
    {
      qualifikationen: ['Allgemeinbildende Fächer'],
      text: 'Prozesskette Lieferantenmanagement:\nDie verschiedenen Schritte im Lieferantenmanagement von der Analyse bis zur Auswahl.',
    },
    {
      qualifikationen: ['Allgemeinbildende Fächer'],
      text: 'Kriterien zur Analyse und Auswahl von Lieferanten:\nDie verschiedenen Kriterien zur Bewertung von Lieferanten wie Zuverlässigkeit, Fertigungsmöglichkeiten und Konditionen.',
    },
    {
      qualifikationen: ['Betriebswirtschaft'],
      text: 'Lieferantenbeziehungsmanagement:\nLangfristige Strategien zur Pflege von Geschäftsbeziehungen mit Lieferanten.',
    },
    {
      qualifikationen: ['Betriebswirtschaft'],
      text: 'Risikomanagement in der Lieferkette:\nIdentifikation und Bewertung von Risiken bei der Zusammenarbeit mit Lieferanten.',
    },
  ];

  const expected = [
    {
      datum: '2025-03-03',
      qualifikationen: ['Allgemeinbildende Fächer'],
      text: 'Prozesskette Lieferantenmanagement:\nDie verschiedenen Schritte im Lieferantenmanagement von der Analyse bis zur Auswahl.',
    },
    {
      datum: '2025-03-10',
      qualifikationen: ['Allgemeinbildende Fächer'],
      text: 'Kriterien zur Analyse und Auswahl von Lieferanten:\nDie verschiedenen Kriterien zur Bewertung von Lieferanten wie Zuverlässigkeit, Fertigungsmöglichkeiten und Konditionen.',
    },
    {
      datum: '2025-03-17',
      qualifikationen: ['Betriebswirtschaft'],
      text: 'Lieferantenbeziehungsmanagement:\nLangfristige Strategien zur Pflege von Geschäftsbeziehungen mit Lieferanten.',
    },
    {
      datum: '2025-03-24',
      qualifikationen: ['Betriebswirtschaft'],
      text: 'Risikomanagement in der Lieferkette:\nIdentifikation und Bewertung von Risiken bei der Zusammenarbeit mit Lieferanten.',
    },
  ];

  assertEquals(
    spreadEntriesAcrossWeeks(entries, {
      startDate: '2025-3-4',
      endDate: '2025-3-24',
    }),
    expected
  );
});

Deno.test('Spread one entry across multiple weeks.', () => {
  const entries = [
    {
      qualifikationen: ['Allgemeinbildende Fächer'],
      text: 'Prozesskette Lieferantenmanagement:\nDie verschiedenen Schritte im Lieferantenmanagement von der Analyse bis zur Auswahl.',
    },
  ];

  const expected = [
    {
      datum: '2025-03-03',
      qualifikationen: ['Allgemeinbildende Fächer'],
      text: 'Prozesskette Lieferantenmanagement:\nDie verschiedenen Schritte im Lieferantenmanagement von der Analyse bis zur Auswahl.',
    },
  ];

  assertEquals(
    spreadEntriesAcrossWeeks(entries, {
      startDate: '2025-3-4',
      endDate: '2025-3-24',
    }),
    expected
  );
});

Deno.test('Spread multiple entries across one week.', () => {
  const entries = [
    {
      qualifikationen: ['Allgemeinbildende Fächer'],
      text: 'Prozesskette Lieferantenmanagement:\nDie verschiedenen Schritte im Lieferantenmanagement von der Analyse bis zur Auswahl.',
    },
    {
      qualifikationen: ['Allgemeinbildende Fächer'],
      text: 'Kriterien zur Analyse und Auswahl von Lieferanten:\nDie verschiedenen Kriterien zur Bewertung von Lieferanten wie Zuverlässigkeit, Fertigungsmöglichkeiten und Konditionen.',
    },
    {
      qualifikationen: ['Betriebswirtschaft'],
      text: 'Lieferantenbeziehungsmanagement:\nLangfristige Strategien zur Pflege von Geschäftsbeziehungen mit Lieferanten.',
    },
  ];

  const expected = [
    {
      datum: '2025-03-03',
      qualifikationen: ['Allgemeinbildende Fächer'],
      text: 'Prozesskette Lieferantenmanagement:\nDie verschiedenen Schritte im Lieferantenmanagement von der Analyse bis zur Auswahl.',
    },
    {
      datum: '2025-03-03',
      qualifikationen: ['Allgemeinbildende Fächer'],
      text: 'Kriterien zur Analyse und Auswahl von Lieferanten:\nDie verschiedenen Kriterien zur Bewertung von Lieferanten wie Zuverlässigkeit, Fertigungsmöglichkeiten und Konditionen.',
    },
    {
      datum: '2025-03-03',
      qualifikationen: ['Betriebswirtschaft'],
      text: 'Lieferantenbeziehungsmanagement:\nLangfristige Strategien zur Pflege von Geschäftsbeziehungen mit Lieferanten.',
    },
  ];

  assertEquals(
    spreadEntriesAcrossWeeks(entries, {
      startDate: '2025-3-4',
      endDate: '2025-3-5',
    }),
    expected
  );
});
