const ut = {
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    random_str(count) {
        let res = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < count; i++) res += possible.charAt(Math.floor(Math.random() * possible.length));
        return res;
    },
    /**
     * Заменяет все вхождения search на replaceTo в строке str
     * @param {*} str исходная строка
     * @param {*} search искомая замена
     * @param {*} replaceTo на что будем менять
     */
    replaceAll(str, search, replaceTo) {
        return str.replace(new RegExp(search, 'g'), replaceTo);
    },

    /**
     * Получить значение дочернего свойства используя цепочку аргументов
     * Example:
     * let a = { b: {f:[0,1,2,{c:"text"}]}}
     * Example:
     *  if (a)&&(a.b)&&(a.b.f)&&(a.b.f[3])&&*(a.b.f[3].c)
     *      return a.b.f[3].c;
     *   else
     *      return 'not find';
     *  or
     *   return ut.get(a,'b','f',3,'c','find`t text');
     * @param  {...any} args args[0] - исходный объект, args[1]..args[n-1] - имена или индексы args[n] - значение по умолчанию.
     * @returns throw|any|default
     */
    get(...args) {
        if (args.length < 3) {
            throw new Error('ut.get must have more 2 args, (0)-object ,(1..n-1) - name or index, (n)-default maen');
        }

        let nameOrIndex;
        let obj = args[0];
        const defaultValue = args[args.length - 1];

        if (obj === undefined) {
            return defaultValue;
        }
        try {
            for (let i = 1; i < args.length - 1; i++) {
                nameOrIndex = obj[args[i]];
                if (nameOrIndex === undefined) {
                    return defaultValue;
                }
                obj = nameOrIndex;
            }
            return obj;
        } catch (e) {
            return defaultValue;
        }
    },
    /**
     * Возврат команды по ее алиасу(короткому описанию)
     * Ex: alias('direct',{direction:'direct'}) => direction
     * Ex: alias('direct',{direction:['direct','dir','d']}) => direction
     * Ex: alias('d',{direction:['direct','dir','d']}) => direction
     * Ex: alias('left',{direction:['direct','dir','d'],right:['r','noLeft']}) => left
     * Ex: alias('r',{direction:['direct','dir','d'],right:['r','noLeft']}) => right
     * @param {string} alias
     * @param {string|[]} conform
     * @returns {string|Exception}
     */
    alias(alias, conform) {
        const keys = Object.keys(conform);
        for (let k = 0; k < keys.length; k++) {
            const name = keys[k];
            const def = conform[name];
            if (Array.isArray(def)) {
                try {
                    for (let i = 0; i < def.length; i++) {
                        if (def[i] === alias) {
                            return name;
                        }
                    }
                } catch (e) {
                    console.error(e);
                    throw new Error(e);
                }
            } else if (typeof def === 'string') {
                if (alias === name) {
                    return name;
                }
            } else {
                throw new Error(`ut.alias [${def}] is not array of string`);
            }
        }
        return alias;
    },
    /**
     * перебор по элементам или свойствам
     * При переборе по объекту в ф-цию func передается 5 параметра
     * ( значение свойства, имя свойства, весь объект, порядковый номер,список свойств )
     *
     * @param {object|array} o
     * @param {function} func
     * @returns {obj|Exception}
     */
    each(o, func) {
        let msg = '';
        if (typeof func !== 'function') {
            msg = 'func in ut.each(..,func) must be function';
            console.error(msg);
            throw Error(msg);
        }

        if (Array.isArray(o)) {
            return o.find(func);
        }
        if (typeof o === 'object') {
            try {
                const keys = Object.keys(o);
                const res = keys.find((key, i) => func(o[key], key, o, i, keys));
                return (res ? o[res] : undefined);
            } catch (e) {
                console.error(e);
                throw Error(e);
            }
        }

        msg = 'o in ut.each(o,..) must be array or object';
        console.error(msg);
        throw Error(msg);
    },
    /**
     * Пересчет значения в одной СК в соотвествующее ей значение в другой СК,
     * что равносильно поиску пропорционального значения
     *
     * @param {*} y  - исходное значение
     * @param {*} y1 - левый экстремум исходной СК
     * @param {*} y2 - правый экстремум исходной СК
     * @param {*} x1 - левый экстремум СК искомого значения, соотвествует y1
     * @param {*} x2 x2 - правый экстремум СК искомого значения, соотвествует y2
     * @returns {number | Exception}
     */
    translate(y, y1, y2, x1, x2) {
        if (y2 == y1) {
            throw Error(' translate param y1 == y2 !');
        }
        return (x2 * (y - y1) + x1 * (y2 - y)) / (y2 - y1);
    },

    /**
     * Последовательное выполнение цепочки промисов заданных массивом funcs
     * @param {Function[]} funcs - массив функций
     * @param {any} param - параметр, передаваемый в первый промис
     * @returns {Promise}
     */
    promises(funcs, param = undefined) {
        let chain = Promise.resolve(param);
        funcs.map((func) => {
            chain = chain
                .then((p) => func(p));
        });
        return chain;
    },
    /** преобразует value в boolean
     * @param {any}
     * @returns {boolean}
     * Ex:
     * toBool(true) = true
     * toBool(0) = false
     * toBool(1) = false
     * toBool(null) = false
     * toBool(undefined) = false
     * toBool("1 ") = true
     * toBool(" true") = true
     * toBool("lkdw") = false
     * toBool(false) = false
    */
    toBool(value) {
        if (value === true || value === 1 || value === '1' || value === 'true') {
            return true;
        }
        if (value === false || value === 0 || value === null || value === undefined || value === '0' || value === 'false') {
            return false;
        }
        const str = (`${value}`).trim();
        if (str === 'true' || str === '1') {
            return true;
        }
        return false;
    },

    /** сравнение двух значений,
    *  если типы совпадают, то строгое сравнение
    *  если нет, то для строки и числа делается привидение (для null и undefined тоже)
    *  пустая строка НЕ равна 0 !
    *  в остальных случаях false
    */
    eq(val1, val2) {
        let a = val1;
        let b = val2;

        let typeA = typeof (a);
        let typeB = typeof (b);

        if (a === null) typeA = 'null';
        if (b === null) typeB = 'null';

        if ((typeA === 'number') && (Number.isNaN(a))) {
            typeA = 'NaN';
        }
        if ((typeB === 'number') && (Number.isNaN(b))) {
            typeB = 'NaN';
        }
        if (typeA === 'boolean') {
            a = a ? 1 : 0;
            typeA = 'number';
        }
        if (typeB === 'boolean') {
            b = b ? 1 : 0;
            typeB = 'number';
        }

        if (typeA === typeB) {
            if ((typeA === 'NaN') && (typeB === 'NaN')) {
                return true;
            }
            return (a === b);
        }
        const ts = (type1, type2) => {
            if (typeA === type1 && typeB === type2) {
                return true;
            }
            if (typeA === type2 && typeB === type1) {
                const c = b; b = a; a = c;
                const t = typeA; typeA = typeB; typeB = t;
                return true;
            }
            return false;
        };
        const isn = (val, type) => type === 'NaN' || val === undefined || val === null;

        if (ts('string', 'number')) {
            return (parseFloat(a) === b);
        }
        if (isn(a, typeA) && isn(b, typeB)) return true;

        return false;
    },
    /** приведение к bool и сравнение с true */
    True(val) {
        return ut.toBool(val);
    },
    /** приведение к bool и сравнение с false */
    False(val) {
        return !ut.toBool(val);
    },

};

export default ut;
