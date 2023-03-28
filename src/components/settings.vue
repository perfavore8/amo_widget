<template>
    <div>
        <div class="scrm_widget_block_hr">
            <div class="scrm_widget_block">
                <button :disabled="!isConfirm" @click.prevent="demo"  class="button-input button-input_blue " v-bind:class="{ 'button-input-disabled' : isBlocked }" id="startcrm_widget_subscription_button" tabindex="" type="button">
                        <span class="button-input-inner ">
                            <span class="button-input-inner__text">
                                Попробовать бесплатно
                            </span>
                        </span>
                </button>
            </div>
            <div>
                <label class="control-checkbox" v-bind:class="{ 'is-checked' : isConfirm }" >
                    <div class="control-checkbox__body" >
                        <input v-on:click="check()" class="" data-value="" :checked="isConfirm" name="startcrm_confirm_checkbox" type="checkbox" value="">
                            <span class="control-checkbox__helper "></span>
                        </input>
                    </div>
                    <div class="control-checkbox__text element__text " title="Я согласен с передачей данных аккаунта amoCRM (адрес электронной почты, API-ключ, URL аккаунта)">
                        Я согласен с лицензионным соглашением и передачей данных аккаунта amoCRM (адрес электронной почты, API-ключ, URL аккаунта)
                    </div>
                </label>
            </div>
            <div>

            </div>
        </div>
        <div class="scrm_widget_footer">
            <p>
                * Стоимость подписки: 1490₽ / месяц. При оплате за год - 2 месяца в подарок!
            </p>
            <p>
                * Бесплатный период - 7 дней. Функционал виджета может быть ограничен.
            </p>
            <p style="margin-top: 7px;">
                Разработано в
                <a href="https://vk.com/startcrm" class="dot"  target="_blank">RestartCRM</a>. © 2017–2019
            </p>
            <p style="margin-top: 7px;">
                По вопросам технической работы виджета, пожалуйста, обращайтесь
                <br>
                на электронную почту
                <a class="dot" href="mailto:support@restart-crm.ru" >
                    support@start-crm.ru
                </a>
                </br>
            </p>
        </div>
    </div>
</template>

<script>
    import { Component, Vue } from 'vue-property-decorator';
    import { mapActions } from 'vuex';


    @Component({
        name: "Settings",
        computed: {

        }
    })
    export default class Settings extends Vue {

        static $el = '.widget-settings__desc-space';


        data() {
            return this.$parent.$store.state;
        }


        check() {
            this.$parent.$store.commit('changeConfirm');
        }

        get isBlocked() {
            return this.$parent.$store.getters.isBlocked
        }

        get isConfirm() {
            return this.$parent.$store.getters.isConfirm
        }






    }
</script>

<style>
    #save_startcrm_onedocs {
        display: none !important;
    }

    .scrm_widget_block {
        text-align: left;
        margin: 0px 0px 6px;
    }

    .scrm_widget_block  .button-input {
        margin-top: -2px;
    }

    .scrm_widget_block .widget-settings__textarea-fild {
        margin-top: 0px;
        margin-bottom: 0px;
        width: auto !important;
        height: 36px;
    }

    .scrm_widget_block_hr {
        border-top: 1px solid rgb(219, 222, 223);
        margin: 20px -30px -10px;
        padding: 20px 30px;
        padding-top: 20px;
        background: rgba(255,255,255,1);
    }

    .card-holder__fields .js-linked-has-actions .control-phone__formatted {
        text-decoration: none !important;
    }

    .card-holder__fields .region_data {
        position: absolute;
        right: 0px;
        top: 9px;
        color: #aaa;
        font-size: 9pt;
    }

    .scrm_widget_btn {
        border: 1px solid #4077d6;
        color: #4077d6;
    }

    .scrm_widget_btn.button-input-disabled {
        border: 1px solid #dbdedf;
    }

    .scrm_widget_block .control-checkbox__text {
        display: inline; font-size: 13px;
    }
    .scrm_widget_footer {
        border-top: 1px solid rgb(219, 222, 223);
        padding-top: 20px;
        margin: 10px -30px -10px;
        padding-left: 30px;
        font-style: normal;
        font-size: 13px;
        color: rgb(107, 109, 114);
    }
    .scrm_widget_footer a {
        color: #4077d6;
    }

    .scrm_control-checkbox{
        display: inline-flex;
        align-items: center;
        margin: 0 7px 0 0;
        padding: 0;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .scrm_control-checkbox__body {
        display: inline-flex;
    }
    .scrm_control-checkbox input {
        position: absolute;
        opacity: 0;
        z-index: 4;
        width: 20px;
        height: 20px;
    }
    .control-checkbox__text {
        display: inline-flex;
        font-size: 13px;
        line-height: 17px;
        margin: 0 0 0 7px;
        transform: translateY(1px);
    }

    .scrm_control-checkbox__helper {
        position: relative;
        width: 18px;
        height: 18px;
        display: inline-flex;
        z-index: 3;
        background-color: #fff;
        border: 1px solid #e8e8e8;
        border-radius: 3px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .is-checked .scrm_control-checkbox__helper {
        background: #fff url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJfeDIwMTRfX0l0ZW1fM…44NzEsMC40NjIsMTEuNDc2LDAuMTUxDQoJCQl6Ii8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo=) no-repeat;
        background-size: 70%;
        background-position: center;
    }

    a.dot {
        color: #444;
        text-decoration: none; /* Убираем подчеркивание */
        border-bottom: 1px dashed #444; /* Добавляем свою линию */
    }
    a.dot:hover {
        color: #000; /* Цвет ссылки при наведении на нее курсора */
    }


    .scrm_widget-settings__chat-and-handler-account-list {
        padding: 0px !important;
        border: none !important;
    }

    .scrm_page {
        background: #eee;
        border-radius: 50px;
    }

</style>