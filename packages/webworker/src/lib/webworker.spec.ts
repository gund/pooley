import { webworker } from './webworker';

describe('webworker', () => {
  it('should work', () => {
    expect(webworker()).toEqual('webworker');
  });
});
