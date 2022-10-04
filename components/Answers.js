import getRandomInt from "../utils/getRandomInt";

export const getAnswers = (operand1, operator, operand2) => {
    const answerArray = [];
    let answer = eval(operand1 + operator + operand2);
    let maxAnswerOptions = answer < 6 ? 6 : 1.5 * answer;
    while (answerArray.length < 4) {
        answerArray.indexOf(answer) < 0 ? answerArray.push(answer) : null;
        answer = getRandomInt(
            1,
            answerArray.length < 2 ? maxAnswerOptions / 2 : maxAnswerOptions
        );
    }
    return answerArray;
};