// types.ts
import type { Asset } from "expo-media-library";

export interface PhotoGroup {
    month: string;
    year: number;
    photos: Asset[];
}
