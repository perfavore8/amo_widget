# amoCRM widget template (Vue.js)

Шаблон виджета для amoCRM с поддержкой *Vue*, *Vuex* и автоматической сборкой архива *widget.zip*

## 1. Установка и сборка

Требует [Node.js](https://nodejs.org/) 10+ для запуска.


```sh
$ git clone https://github.com/iamkuper/amocrm-vue-widget.git ./widget
$ cd widget
$ npm install
```
Далее создать виджет внутри amoCRM и сгенерировать код виджета + ключ.
Ключи указываются в файле **/dist/manifest.json**
Далее выполнить сборку виджета.

```sh
$ npm build
```
Залить готовый виджет **widget.zip** в amoCRM

## 2. Для работы через webpack-dev-server:
*Для разработки на локальном сервере без перезагрузки виджета в amoCRM*

Заменить пути в файле **/dist/script.js**:
`./app.js` на `http://localhost:8080/dist/app.js`

и запустить локальный вебсервер

```sh
$ npm build && npm dev
```

**Не забудьте повторно залить виджет с новыми путями!**
