
/*
1============
1+1, 
1-1, 
1*1,
1÷1

2============
2+1, 2+2, 
2-1, 2-2, 
2*1, 2*2, 
2÷1, 2÷2

3============
3+1, 3+2, 3+3, 2+1, 2+2, 
3-1, 3-2, 3-3, 2-1, 2-2
3*1, 3*2, 3*3, 2*1, 2*2
3÷1, 3÷2, 3÷3, 2÷1, 2÷2

4============
4+1, 4+2, 4+3, 4+4, 3+1, 3+2, 3+3, 2+1, 2+2, 2+1
4-1, 4-2, 4-3, 4-4, 3-1, 3-2, 3-3, 2-1, 2-2, 2-1
4*1, 4*2, 4*3, 4*4, 3*1, 3*2, 3*3, 2*1, 2*2, 2*1
4÷1, 4÷2, 4÷3, 4÷4, 3÷1, 3÷2, 3÷3, 2÷1, 2÷2, 2÷1
*/


const easyModeQuestions = [{
    operation: 'division',
    questions: [
        { question: '16 ÷ 4', answer: '4' },
        { question: '12 ÷ 4', answer: '3' },
        { question: '8 ÷ 4', answer: '2' },
        { question: '4 ÷ 4', answer: '1' },
        { question: '12 ÷ 3', answer: '4' },
        { question: '9 ÷ 3', answer: '3' },
        { question: '6 ÷ 3', answer: '2' },
        { question: '3 ÷ 3', answer: '1' },
        { question: '8 ÷ 2', answer: '2' },
        { question: '6 ÷ 2', answer: '3' },
        { question: '4 ÷ 2', answer: '2' },
        { question: '2 ÷ 2', answer: '1' },
    ]
}, {
    operation: 'multiplication',
    questions: [
        { question: '4 * 4', answer: '16' },
        { question: '4 * 3', answer: '12' },
        { question: '4 * 2', answer: '8' },
        { question: '4 * 1', answer: '4' },
        { question: '3 * 4', answer: '4' },
        { question: '3 * 3', answer: '9' },
        { question: '3 * 2', answer: '6' },
        { question: '3 * 1', answer: '3' },
        { question: '2 * 4', answer: '8' },
        { question: '2 * 3', answer: '6' },
        { question: '2 * 2', answer: '2' },
        { question: '2 * 1', answer: '1' },
    ]
}, {
    operation: 'addition',
    questions: [
        { question: '4 + 4', answer: '8' },
        { question: '4 + 3', answer: '7' },
        { question: '4 + 2', answer: '6' },
        { question: '4 + 1', answer: '5' },
        { question: '3 + 4', answer: '7' },
        { question: '3 + 3', answer: '6' },
        { question: '3 + 2', answer: '5' },
        { question: '3 + 1', answer: '4' },
        { question: '2 + 4', answer: '6' },
        { question: '2 + 3', answer: '5' },
        { question: '2 + 2', answer: '4' },
        { question: '2 + 1', answer: '3' },
    ]
}, {
    operation: 'subtraction',
    questions: [
        { question: '4 - 4', answer: '0' },
        { question: '4 - 3', answer: '1' },
        { question: '4 - 3', answer: '1' },
        { question: '4 - 2', answer: '2' },
        { question: '4 - 1', answer: '3' },
        { question: '3 - 3', answer: '0' },
        { question: '3 - 2', answer: '1' },
        { question: '3 - 1', answer: '2' },
        { question: '2 - 2', answer: '0' },
        { question: '2 - 1', answer: '1' },
    ]
}
]