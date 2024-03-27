import getRandomInt, { getRandomFloat } from "../utils/getRandomInt";

export const getAnswer = (operand1, operator, operand2, threeDecimalPlaces) => {
    const answer = eval(operand1 + operator + operand2);
    if(operand1 % 1 != 0 && operand2 % 1 != 0 ) {
        return answer.toFixed(threeDecimalPlaces ? 3 : 2 );
    }
    return answer;
} 

export const getAnswersArray = (operand1, operator, operand2, mixedDecimal=false, threeDecimalPlaces=false) => {
    const answerArray = [];
    let answer = getAnswer(operand1, operator, operand2, threeDecimalPlaces)
    answerArray.push(answer);
    let answerOption = answer;
    let maxAnswerOptions = (operand1 % 1 != 0 && operand2 % 1 != 0 ) ? 0.99 : (answer < 6 ? 6 : 1.5 * answer);
    
    while (answerArray.length < 4) {
        if(answerArray.indexOf(answerOption) < 0) {
            answerArray.push(answerOption)
        }
        if( operand1 % 1 != 0 && operand2 % 1 != 0 ) {
            answerOption = getRandomFloat(
                mixedDecimal,
                threeDecimalPlaces
            )
        } else {
            answerOption = getRandomInt(
                1,
                answerArray.length < 2 ? maxAnswerOptions / 2 : maxAnswerOptions,
                mixedDecimal,
            );
        }    
    }
    return answerArray;
};