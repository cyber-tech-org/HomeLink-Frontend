try {
    const { getDefaultConfig } = require("expo/metro-config");
    const { withNativeWind } = require("nativewind/metro");

    const config = getDefaultConfig(__dirname);
    const finalConfig = withNativeWind(config, { input: "./global.css" });
    console.log("Success: Full config loaded");
} catch (error) {
    console.error("Error loading full config:");
    console.error(error);
}
