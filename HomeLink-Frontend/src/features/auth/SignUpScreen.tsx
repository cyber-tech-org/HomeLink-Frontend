import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '../../components/ThemedText';
import * as AppleAuthentication from 'expo-apple-authentication';

import { FontAwesome } from '@expo/vector-icons';

export default function SignUpScreen() {
    // We want the button on all devices, so we don't strictly hide it based on availability 
    // (though on recent Expo versions, signInAsync works on Android too via web).

    const handleAppleSignIn = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            // Handle successful login
            console.log(credential);
        } catch (e: any) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
                // handle that the user canceled the sign-in flow
            } else {
                // handle other errors
                console.error(e);
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1">
                    {/* Top Image Grid */}
                    <View className="w-full h-[55vh] overflow-hidden rounded-b-[30px] bg-white">
                        {/* Note: In the design, the images are usually individual cards. 
                    If splashImage.png is a single collage image, we display it as such.
                    The design shows rounded corners for individual images in a masonry layout.
                    Assuming splashImage.png is the pre-composed masonry image. 
                */}
                        <Image
                            source={require('../../../assets/splashImage.png')}
                            className="w-full h-full"
                            resizeMode="contain"
                        />
                    </View>

                    {/* Content Container */}
                    <View className="px-6 pt-6 pb-8 justify-between flex-1">
                        <View className="items-center">
                            <ThemedText className="text-gray text-base text-center uppercase tracking-widest mb-5">
                                Welcome to Real Scout
                            </ThemedText>

                            <ThemedText className="text-black text-3xl font-rubik-bold text-center leading-tight mb-4">
                                Let's Get You Closer {'\n'}To
                                <Text className="text-primary"> Your Ideal Home</Text>
                            </ThemedText>

                            {/* <ThemedText className="text-gray text-center text-base font-semibold mb-8">
                                Sign Up to Real Scout with Google
                            </ThemedText> */}


                            <TouchableOpacity
                                className="w-full bg-white border border-gray/20 rounded-full py-4 flex-row justify-center items-center shadow-sm relative"
                                activeOpacity={0.8}
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                }}
                            >
                                <Image
                                    source={require('../../../assets/GoogleIcon.png')}
                                    className="w-6 h-6 mr-3"
                                    resizeMode="contain"
                                />
                                <ThemedText className="text-black font-rubik-medium text-lg">
                                    Sign Up with Google
                                </ThemedText>
                            </TouchableOpacity>

                            <View className="w-full mt-4 h-16">
                                {Platform.OS === 'ios' ? (
                                    <AppleAuthentication.AppleAuthenticationButton
                                        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                                        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                                        cornerRadius={50}
                                        style={{ width: '100%', height: '100%' }}
                                        onPress={handleAppleSignIn}
                                    />
                                ) : (
                                    <TouchableOpacity
                                        className="w-full bg-black rounded-full py-4 flex-row justify-center items-center shadow-sm relative h-full"
                                        activeOpacity={0.8}
                                        onPress={handleAppleSignIn}
                                    >
                                        <FontAwesome name="apple" size={24} color="white" style={{ marginRight: 12 }} />
                                        <Text className="text-white font-medium text-lg" style={{ fontFamily: 'Rubik_500Medium' }}>
                                            Sign Up with Apple
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
