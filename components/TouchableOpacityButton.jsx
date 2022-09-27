import { Text, View, TouchableOpacity } from "react-native";
import styles from "../styles/App.styles";

const TouchableOpacityButton = ({ title, onPress, style }) => {
    return (
        <View
            style={{
                ...style,
                ...styles.touchableOpacityButton,
            }}
        >
            <TouchableOpacity onPress={onPress}>
                <Text style={{ fontWeight: 'bold'}}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TouchableOpacityButton;
