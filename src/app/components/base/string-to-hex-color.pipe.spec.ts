import { StringToHexColorPipe } from './string-to-hex-color.pipe';

describe('StringToHexColorPipe', () => {
  it('create an instance', () => {
    const pipe = new StringToHexColorPipe();
    expect(pipe).toBeTruthy();
  });
});
