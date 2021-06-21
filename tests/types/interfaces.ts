import {Collection} from 'mongodb'

export interface beforeAll {
  users: Collection;
  refreshTokens: Collection;
  accessTokens: Collection;
}
