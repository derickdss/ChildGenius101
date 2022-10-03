import { View, Button } from 'react-native';
import styles from '../styles/App.styles';

const Buttons = ({ answer, setAnswerValue, disabled, style, color }) => (
    <View style={style || styles.answers}>
        <Button
            title={answer}
            onPress={() => setAnswerValue(parseInt(answer))}
            disabled={disabled}
            color={color}
        >
            {answer}
        </Button>
    </View>
);

export default Buttons;