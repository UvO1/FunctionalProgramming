/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import * as R from 'ramda'

const keysOfObject = (obj) => Object.keys(obj);
const lengthOfObject = (obj) => obj.length;
const countOfFilteredObject = R.pipe(keysOfObject, lengthOfObject);
const filterByFunction = R.pipe(R.filter, countOfFilteredObject);
const curryFilterByFunction = R.curry(filterByFunction);

const isEqualsTwo = R.equals(2);
const isEqualsOne = R.equals(1);

const isFigureBlue = R.equals('blue');
const isFigureRed = R.equals('red');
const isFigureOrange = R.equals('orange');
const isFigureGreen = R.equals('green');
const isFigureWhite = R.equals('white');

const isQuantityMoreThenTwo = (count) => count >= 2
const isQuantityMoreThenThree = (count) => count >= 3

const equalsSomething = (elem) => R.equals(elem)
const curryEqualsSomething = R.curry(equalsSomething);

const sumOfRedFigures = (shapes) => curryFilterByFunction(isFigureRed)(shapes);
const sumOfGreenFigures = (shapes) => curryFilterByFunction(isFigureGreen)(shapes);
const sumOfOrangeFigures = (shapes) => curryFilterByFunction(isFigureOrange)(shapes);
const sumOfBlueFigures = (shapes) => curryFilterByFunction(isFigureBlue)(shapes);

const isSumOfRedFiguresMoreThree = R.pipe(sumOfRedFigures, isQuantityMoreThenThree);
const isSumOfGreenFiguresMoreThree = R.pipe(sumOfGreenFigures, isQuantityMoreThenThree);
const isSumOfOrangeFiguresMoreThree = R.pipe(sumOfOrangeFigures, isQuantityMoreThenThree);
const isSumOfBlueFiguresMoreThree = R.pipe(sumOfBlueFigures, isQuantityMoreThenThree);

const isSumOfGreenFiguresIsTwo = R.pipe(sumOfGreenFigures, isEqualsTwo);
const isSumOfRedFiguresIsOne = R.pipe(sumOfRedFigures, isEqualsOne);

const hasGreenTriangle = R.propEq('triangle', 'green');

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({star, square, triangle, circle}) => {
    const isRedStarAndGreenSquare =  R.and(isFigureRed(star), isFigureGreen(square));
    const isTwoFiguresWhite =  R.and(isFigureWhite(triangle), isFigureWhite(circle));
    return R.and(isRedStarAndGreenSquare, isTwoFiguresWhite)
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) => {
    const moreThanTwoFiguresGreen = R.pipe(
        sumOfGreenFigures,
        isQuantityMoreThenTwo
    );
    return moreThanTwoFiguresGreen(shapes)
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => {
    const countRed = sumOfRedFigures(shapes);
    const countBlue = sumOfBlueFigures(shapes);
    return curryEqualsSomething(countRed)(countBlue)
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = ({star, square, triangle, circle})  => {
    const isBlueCircleAndRedStar =  R.and(isFigureBlue(circle), isFigureRed(star));
    return R.and(isBlueCircleAndRedStar, isFigureOrange(square))
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (shapes) => {
    return R.anyPass([isSumOfRedFiguresMoreThree, 
        isSumOfGreenFiguresMoreThree, 
        isSumOfOrangeFiguresMoreThree, 
        isSumOfBlueFiguresMoreThree
    ])(shapes);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (shapes) => {
    return R.allPass([isSumOfGreenFiguresIsTwo, 
        isSumOfRedFiguresIsOne, 
        hasGreenTriangle
    ])(shapes)
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = ({star, square, triangle, circle}) => {
    return R.all(isFigureOrange)([star, square, triangle, circle])
}

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({star, square, triangle, circle}) => {  
    return R.anyPass([isFigureBlue, 
        isFigureOrange, 
        isFigureGreen
    ])(star)
}

// 9. Все фигуры зеленые.
export const validateFieldN9 = ({star, square, triangle, circle}) => {
    return R.all(isFigureGreen)([star, square, triangle, circle])
}

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({star, square, triangle, circle}) => {
    const triangleIsNotWhite = R.pipe(isFigureWhite, R.not)(triangle);
    const triangleIsEqualSquare = curryEqualsSomething(triangle)(square);
    return R.and(triangleIsEqualSquare, triangleIsNotWhite);
}
