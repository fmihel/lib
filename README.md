# Библиотека ф-ций javascript (и для серверной и для броузерной части)
## Установка
`npm i fmihel-lib -D`
## Набор ф-ций 

## ut
|name|result|notes|
|-----|-----|-----|
|random(min,max)|int| случайное чисо в интервале [min,max] |
|random_str(count)|string| случайная строка длиной count |
|get(obj,n1,n2,..n,default)|any|извлечение значения дочернего свойства Ex: ``` ut.get(a,'b','f',3,'c','find`t text')  <==>  a.b.f[3].c ```|
|replaceAll(str,find,replaceTo)|string| замена всех вхождений find в строке str на replaceTo |
|each(obj,func)|any| цикл по полям объекта obj, объект может быть массивом или объектом. |
|eq(a,b)|boolean| Сравнение переменных с приведением  |
|toBool(a)|boolean| приведение к boolean   |
|True(a)|boolean| приведение и сравнение с true |
|False(a)|boolean| приведение и сравнение с false |
