import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: 'rgb(143,82,228)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    question: {
        flex: 1,
        flexDirection: 'row',
        margin: '2rem',
    },
    questionBlock: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'rgb(57, 61, 241)',
        // margin: 10,
        padding: 15,
        paddingBottom: 5
    },
    inputAnswer: {
        padding: 12,
        paddingBottom: 5,
        maxWidth: 84,
        borderWidth: 1, 
        borderColor: 'rgb(57, 61, 241)', 
        color: 'rgb(57, 61, 241)', 
        backgroundColor: 'lightgrey',
        fontSize: 40,
        fontWeight: 'bold', 
        marginTop: 8
    },
    operand: {
        // backgroundColor: 'lightblue'
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(57, 61, 241)',
    },
    operator: {
        // backgroundColor: 'yellow'
    },
    answer: {
        borderBottomWidth: 1,
        padding: 20,
        paddingBottom: 5,
        borderBottomColor: 'rgb(57, 61, 241)',
        backgroundColor: 'lightgrey',
    },
    answerCorrect: {
        backgroundColor: 'lightgreen'
    },
    answerInCorrect: {
        backgroundColor: 'red'
    },
    section: {
        //minHeight: '18.57%',
        // width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // borderColor: 'red',
        // borderWidth: 1,
        padding: 75,
    },
    answers: {
        margin: 4,
        width: 150
    },

    // button > {
    //     &::before {
    //         color: ${(props) => props.theme?.primaryColor} !important;
    //     }
    // }

    touchableOpacityButton: {
        // justifyContent: 'center',
        alignItems: 'center',
    },
})

export default styles;
