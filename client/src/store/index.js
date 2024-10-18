import { create } from "zustand";
import { createAuthSlice } from "./slice/AuthSlice";

export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
}))