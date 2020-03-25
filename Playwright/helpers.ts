// NOTE: Credit goes to SO user "bobince" - https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
export const escapeRegex = (text: string) => text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

export const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));
