import {display} from 'mathlifier';

export const formula = (formula: string): string => {
    return `<br /> ${display(formula, { overflowAuto: false })} <br />`;
}