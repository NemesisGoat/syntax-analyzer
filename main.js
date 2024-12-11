window.onload = function () {

    let flag, i, ch, ch1, s, expr, timeout;



    const vars = document.getElementById('vars');
    vars.value = 'a\nb1\nc_2\nde';
    let varsList = [];

    const expression = document.getElementById('expression');
    expression.value = 'if (a and b1) then if c_2 or de then $$$ else if (a and (not de)) then $$$';

    const errorBlock = document.getElementById('error');

    function error(cause = 'Всё фигня, переделывай') {
        if (!flag) {
            flag = true;
            errorBlock.innerHTML = cause;
        }
    }

    function readCh() {
        i++;
        ch = s[i];
    }

    function readCh1() {
        i++;
        ch1 = expr[i];
    }

    function var1() {
        let result = false;
        for (let j = 0; j < varsList.length; j++) {
            if (ch1 === varsList[j]) {
                result = true;
                return result;
            }
        }
    }

    function V() {
        if ([...'abcdefghijklmnopqrstuvwxyz'].includes(ch) || [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].includes(ch)) {
            readCh();
        } else {
            console.log(ch);
            error('Неправильное имя переменной');
        }
        while ([...'abcdefghijklmnopqrstuvwxyz'].includes(ch) || [...'0123456789'].includes(ch) || [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].includes(ch) || ch === '_') {
            if ([...'abcdefghijklmnopqrstuvwxyz'].includes(ch) || [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].includes(ch)) {
                readCh();
            } else {
                if ([...'0123456789'].includes(ch)) {
                    readCh();
                } else {
                    if (ch === '_') {
                        readCh();
                    } else {
                        error('Недопустимый символ');
                    }
                }
            }
        }
    }

    function E() {
        if (var1()) {
            readCh1()
        } else {
            if (ch1 === 'not') {
                readCh1();
                E();
            } else {
                if (ch1 === '(') {
                    readCh1();
                    E();
                    if (ch1 === ')') {
                        readCh1()
                    } else {
                        error('Ожидалось ")"');
                    }
                } else {
                    error('Ожидалась переменная, "not" или "("');
                }
            }
        }
        while (ch1 === 'and' || ch1 === 'or') {
            readCh1();
            E();
        }
    }

    function O() {
        if (ch1 === 'if') {
            readCh1()
        } else {
            error('Выражение должно начинаться с if');
        }
        E();
        if (ch1 === 'then') {
            readCh1();
        } else {
            error('После условия должно быть then');
        }
        if (ch1 === '$$$') {
            readCh1();
        } else {
            if (ch1 === 'if') {
                O();
            } else {
                error('После then должно быть действие или условие');
            }
        }
        if (ch1 === '@@@') {
            return;
        } else {
            if (ch1 === 'else') {
                readCh1();
                if (ch1 === '$$$') {
                    readCh1();
                } else {
                    if (ch1 === 'if') {
                        O();
                    } else {
                        error('После else должно быть действие или условие');
                    }
                }
            } else {
                error('После действия должно быть else или конец');
            }
        }
    }

    function razb(s) {
        let s1 = '';
        expr = [];
        s = s + ' ';
        for (let i = 0; i < s.length; i++) {
            if (!(['(', ')', ' '].includes(s[i]))) {
                s1 = s1 + s[i];
            } else {
                if (['(', ')'].includes(s[i])) {
                    if (s1 != '') {
                        expr.push(s1);
                        s1 = '';
                    }
                    expr.push(s[i]);
                }
                if (s[i] = ' ') {
                    if (s1 != '') {
                        expr.push(s1);
                        s1 = '';
                    }
                }
            }
        }
        expr.push('@@@');
    }

    const inputHandler = () => {

        errorBlock.innerHTML = '';
        flag = false;

        varsList = vars.value.split('\n');
        for (let j = 0; j < varsList.length; j++) {
            if (!flag) {
                s = varsList[j] + '@';
                if ((s === 'and@') || (s === 'or@') || (s === 'not@') || (s === 'if@') || (s === 'then@') || (s === 'else@') || s.includes('@@')) {
                    error(`${s.replace('@', '')}  нельзя использовать как имя переменной`)
                }
                i = -1;
                readCh();
                while ((!flag) && (ch !== '@')) {
                    V();
                }
            }
        }

        if (!flag) {
            razb(expression.value);
            i = -1;
            readCh1();
            while ((!flag) && (ch1 !== '@@@')) {
                O();
            }
        }

        if (!flag) {
            errorBlock.innerHTML = 'Всё верно!';
        }
    }

    expression.addEventListener('input', () => inputHandler());
    vars.addEventListener('input', () => inputHandler())


    inputHandler();
}
