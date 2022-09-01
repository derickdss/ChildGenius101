import { View, Button } from 'react-native';
import styles from '../styles/App.styles';

const AnswerButtons = ({answer, setAnswerValue, disabled}) => (
    <View style={styles.answers}>
        <Button title={answer} onPress={() => setAnswerValue(parseInt(answer))} disabled={disabled}>{answer}</Button>
    </View>
)

export default AnswerButtons;