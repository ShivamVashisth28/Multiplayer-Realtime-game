import { atom } from "recoil";

export const userAtom = atom({
    key:"userAtom",
    default:{
        userid:localStorage.getItem('userName'),
        color:localStorage.getItem('userColor')
    }
})

