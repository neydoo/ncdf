import { UserRespository } from './user.respository';

describe('UserRespository', () => {
  it('should be defined', () => {
    expect(new UserRespository()).toBeDefined();
  });
});
