import { View, Button } from 'react-native';
import styles from '../styles/App.styles';

const Buttons = ({ answer, setAnswerValue, disabled, style, color }) => (
    <View style={style || styles.answers}>
        <Button
            title={answer}
            onPress={() => setAnswerValue((answer % 1) != 0 ? parseFloat(answer).toFixed(2) :parseInt(answer))}
            disabled={disabled}
            color={color}
        >
            {answer}
        </Button>
    </View>
);

export default Buttons;