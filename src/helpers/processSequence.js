/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
 import Api from '../tools/api';
 import * as R from 'ramda'

 const api = new Api();

 const countIsLessTen = (count) => count < 10 
 const countIsMoreTwo = (count) => count > 2 
 const valueIsPositive = (count) => count > 0 
 const stringToFloat = (value) => parseFloat(value)

 const intToString = (value) => value.toString();
 const countOfSymbols = (str) => str.length;
 const isCountNumbersLessTen = (N) => countIsLessTen(N.length);
 const isCountNumbersMoreTwo = (N) => countIsMoreTwo(N.length);
 const checkPositive = R.pipe(stringToFloat, valueIsPositive);
 const isValuePositive = (N) => checkPositive(N)
 const isMatchReg = (N) => N.match(/^[0-9.]{3,9}/g);
 const getFirstElement = (arr) => R.nth(0, arr);
 const matchResultAfterRegex = R.pipe(isMatchReg, getFirstElement)


 const validateValue = (N) => {
    const isValueEqualRegex = matchResultAfterRegex(N);
    const equalWithValue = R.equals(isValueEqualRegex);
    return R.allPass([isCountNumbersLessTen, isCountNumbersMoreTwo, isValuePositive, equalWithValue])(N)
 }

const stringToNumber = (N) => parseFloat(N);
const roundToInt = (N) => Math.round(N);
const pipeCountOfSymbols = R.pipe(intToString, countOfSymbols);
const getApiResult = R.prop('result');
const getPromiseAnimal = (N) => api.get(`https://animals.tech/${N}`,{});
const getPromiseNumber = (N) => api.get('https://api.tech/numbers/base', {from: 10, to: 2, number: N});
const promiseAnimalPipe = R.pipe(
    getPromiseAnimal, 
    R.andThen(getApiResult)
);

const promiseNumberPipe = R.pipe(
    getPromiseNumber, 
    R.andThen(getApiResult)
);

const promiseFunction = (fn) => new Promise (async (res, rej) => {
    R.tryCatch(res, rej)(fn);
});

const squaring = (N) => N*N;
const modThree = (N) => N%3;

 const processSequence = ({value, writeLog, handleSuccess, handleError}) => {

    const validationError = () => handleError('ValidationError');
    const tapWriteLog = R.tap(writeLog);

    writeLog(value);
    const getAnimal = (N) => promiseFunction(promiseAnimalPipe(N))
    const getNumberByApi = (N) => promiseFunction(promiseNumberPipe(N))
        
    const process = R.pipe(
        stringToNumber,
        roundToInt,
        tapWriteLog,
        getNumberByApi,
        R.andThen(tapWriteLog),
        R.andThen(pipeCountOfSymbols),
        R.andThen(tapWriteLog),
        R.andThen(squaring),
        R.andThen(tapWriteLog),
        R.andThen(modThree),
        R.andThen(tapWriteLog),
        R.andThen(getAnimal),
        R.andThen(handleSuccess)
    );
    const sequence = R.ifElse(validateValue, process, validationError);
    sequence(value);   
 }

export default processSequence;
