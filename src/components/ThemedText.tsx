import React from 'react';
import { Text, TextProps } from 'react-native';

export function ThemedText(props: TextProps) {
    const { className, ...otherProps } = props;
    return <Text className={`font-rubik ${className || ''}`} {...otherProps} />;
}
