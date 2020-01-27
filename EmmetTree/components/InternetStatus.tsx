import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { useNetInfo } from "@react-native-community/netinfo";

enum WifiColors {
    NotConnected = "#f00",
    Connected = "#000"
}

const InternetStatus: React.FC = () => {

    const [wifiColor, setWifiColor] = useState<WifiColors>();
    const netInfo = useNetInfo();

    /**
     * If Internet Reachability changes, then update WiFI symbol
     * color accordingly
     */
    useEffect(() => {
        if (netInfo.isInternetReachable) {
            setWifiColor(WifiColors.Connected);
        } else {
            setWifiColor(WifiColors.NotConnected);
        }
    }, [netInfo]);

    return (
        <View>
            <Icon
                name="ios-wifi"
                color={wifiColor}
                size={25}
            />
        </View>
    );
}

export default InternetStatus;