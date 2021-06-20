import {Itokens, Iroom, Iuser, IreturnInfo} from './index';
// import {User, Room, }
export type UgenerateTokens = Itokens | void;
export type Umodels = Iuser | Iroom | IreturnInfo;
export type Urefresh = string | string[] | undefined;