import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

export const scoreAtom = atom({
    key:'scoreAtom',
    default: [],
    effects_UNSTABLE: [persistAtom],

})