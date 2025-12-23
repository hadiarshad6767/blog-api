import { RefreshTokenAuthGuard } from './refresh-token-auth.guard';

describe('RefreshTokenAuthGuard', () => {
  it('should be defined', () => {
    expect(new RefreshTokenAuthGuard()).toBeDefined();
  });
});
