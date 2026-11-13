// Used only inside the isolated visual container, including prerendering.
const OriginalDate = Date;
const fixedTime = OriginalDate.parse('2026-01-15T12:00:00.000Z');
globalThis.Date = class extends OriginalDate {
  constructor(...args) {
    super(...(args.length ? args : [fixedTime]));
  }
  static now() { return fixedTime; }
};
