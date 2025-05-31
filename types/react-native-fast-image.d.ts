declare module "react-native-fast-image" {
    import { ImageStyle, StyleProp } from "react-native";

    export interface FastImageProps {
        source: { uri: string } | number;
        resizeMode?: "contain" | "cover" | "stretch" | "center";
        fallback?: boolean;
        onLoadStart?(): void;
        onProgress?(event: {
            nativeEvent: { loaded: number; total: number };
        }): void;
        onLoad?(): void;
        onError?(): void;
        onLoadEnd?(): void;
        style?: StyleProp<ImageStyle>;
        tintColor?: string;
    }

    export interface FastImageStatic {
        resizeMode: {
            contain: "contain";
            cover: "cover";
            stretch: "stretch";
            center: "center";
        };
        priority: {
            low: "low";
            normal: "normal";
            high: "high";
        };
        cacheControl: {
            immutable: "immutable";
            web: "web";
            cacheOnly: "cacheOnly";
        };
        preload(sources: { uri: string }[]): Promise<void>;
        clearMemoryCache(): Promise<void>;
        clearDiskCache(): Promise<void>;
    }

    const FastImage: React.ComponentType<FastImageProps> & FastImageStatic;
    export default FastImage;
}
