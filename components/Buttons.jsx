import { View, Button } from 'react-native';
import styles from '../styles/App.styles';

const Buttons = ({answer, setAnswerValue, disabled, style }) => (
    <View style={style || styles.answers}>
        <Button title={answer} onPress={() => setAnswerValue(parseInt(answer))} disabled={disabled}>{answer}</Button>
    </View>
)

export default Buttons;