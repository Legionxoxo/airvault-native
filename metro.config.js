const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 🔧 Enable SVG component support
config.transformer.babelTransformerPath = require.resolve(
    "react-native-svg-transformer"
);

const assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");
const sourceExts = config.resolver.sourceExts.concat(["svg"]);

config.resolver.assetExts = assetExts;
config.resolver.sourceExts = sourceExts;

module.exports = withNativeWind(config, {
    input: "./app/globals.css",
});
