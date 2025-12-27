try {
    const { getDefaultConfig } = require("expo/metro-config");
    const config = getDefaultConfig(__dirname);
    console.log("Success: expo/metro-config loaded");
} catch (error) {
    console.error("Error loading expo/metro-config:");
    console.error(error);
}
