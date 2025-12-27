import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '../../components/ThemedText';

export default function SignUpScreen() {
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
                            <ThemedText className="text-gray text-xs text-center uppercase tracking-widest mb-5">
                                Welcome to Real Scout
                            </ThemedText>

                            <ThemedText className="text-black text-3xl font-rubik-bold text-center leading-tight mb-4">
                                Let's Get You Closer {'\n'}To
                                <Text className="text-primary"> Your Ideal Home</Text>
                            </ThemedText>

                            <ThemedText className="text-gray text-center text-base">
                                Login to Real Scout with Google
                            </ThemedText>
                        </View>

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
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
