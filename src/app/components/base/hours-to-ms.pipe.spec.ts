import { HoursToMsPipe } from './hours-to-ms.pipe';

describe('HoursToMsPipe', () => {
  it('create an instance', () => {
    const pipe = new HoursToMsPipe();
    expect(pipe).toBeTruthy();
  });
});
