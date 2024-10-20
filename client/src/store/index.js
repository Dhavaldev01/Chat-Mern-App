import { create } from "zustand";
import { createAuthSlice } from "./slice/authSlice.js";
import { createChatSlice } from "./slice/chatSlice.js";


export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}))