try {
    const { withNativeWind } = require("nativewind/metro");
    console.log("Success: nativewind/metro loaded");
} catch (error) {
    console.error("Error loading nativewind/metro:");
    console.error(error);
}
