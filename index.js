require('dotenv').config()
const { utcToZonedTime } = require('date-fns-tz')
var opt = {polling:true};
const telegramBot = require('node-telegram-bot-api'),
    token = process.env.TELEGRAM_API,
    bot = new telegramBot(token, opt);

const horariosIdaSemana = ['06:30', '06:45', '06:50', '07:00', '07:10', '07:15', '07:20', '07:25', '07:25 #',
    '07:35', '07:40 #', '07:45', '08:00', '08:10', '08:20', '08:30', '08:40', '08:50', '09:00', '09:10', '09:20', '09:30',
    '09:40', '09:45', '10:05', '10:15', '10:30', '10:45', '11:00', '11:20', '11:30', '11:45', '12:00', '12:15',
    '12:20', '12:35', '12:45', '13:00', '13:05', '13:20', '13:30', '13:45', '14:00', '14:15', '14:30',
    '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00 #', '17:30', '17:45',
    '18:00', '18:10', '18:20', '18:25', '18:30', '18:40', '18:55', '19:00', '19:15', '19:25', '19:35', '19:50',
    '20:10', '20:30', '20:45', '22:50']

const horariosVoltaSemana = ['07:20', '07:40', '08:00', '08:25', '08:45', '09:00', '09:30', '09:50', '10:00', '10:15',
    '10:40', '11:05', '11:15', '11:30', '11:45', '11:55', '12:00', '12:20', '12:30', '12:45', '12:50', '13:00',
    '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00',
    '16:15', '16:30', '16:45', '17:15', '17:30', '17:40 #', '17:45', '17:50 #', '18:00 (B)', '18:15', '18:20 (C)',
    '18:30 (B)', '18:40', '18:50 (C)', '19:05', '19:10 (B)', '19:25 (C)', '19:35', '19:45 (B)', '20:05 (C)',
    '20:20 (B)', '20:40 (C)', '20:50 (B)', '21:00 (C)', '21:25 (B)', '21:35 (C)', '21:55', '22:00 (B)', '22:10 (C)',
    '22:20', '22:30 (B)', '22:35', '22:45', '23:05', '23:15', '23:25', '23:35 (C)', '23:45 (B)']

const horariosIdaSabado = ['07:30', '08:30', '11:30', '13:30']

const horariosVoltaSabado = ['10:00', '12:15', '14:00', '16:00', '18:00']

bot.on("polling_error", console.log);
bot.on('message', (msg) => {
    let userID = msg.chat.id,
        messageUser = msg.text.toLowerCase(),
        answer = ''
    let date = new Date()
    const timeZone = 'America/Sao_Paulo'
    const dataAtual = utcToZonedTime(date, timeZone)
    let feira = dataAtual.getDay()
    let horas = dataAtual.getHours()
    let minutos = dataAtual.getMinutes()
    let listaProximos = []
    let validMessage = (message) => {
        if (message === 'ida' || message === 'volta') {
            return true;
        }
        else { return false; }
    }
    if (!validMessage(messageUser)) {
        answer = 'comando inválido, tente ida para horários saindo da Moradia ou volta para horários saindo da Unicamp'
    } else {
        if (feira !== 0 && feira !== 6) {
            if (messageUser === 'ida') {
                if (horas >= 22 && minutos > 50) {
                    listaProximos.push(horariosIdaSemana[0])
                } else {
                    horariosIdaSemana.map((h) => {
                        let horaBus = h[0] + h[1]
                        let minBus = h[3] + h[4]
                        if (horas == horaBus && minBus > minutos) {
                            listaProximos.push(h)
                        }
                        if (horas < horaBus && horaBus <= horas + 1) {
                            listaProximos.push(h)
                        }
                    })
                }
            } else if (messageUser === 'volta') {
                if (horas >= 23 && minutos > 45) {
                    listaProximos.push(horariosVoltaSemana[0])
                } else {
                    horariosVoltaSemana.map((h) => {
                        let horaBus = h[0] + h[1]
                        let minBus = h[3] + h[4]
                        if (horas == horaBus && minBus > minutos) {
                            listaProximos.push(h)
                        }
                        if (horas < horaBus && horaBus <= horas + 1) {
                            listaProximos.push(h)
                        }
                    })
                }
            }
        } else if (feira == 6) {
            if (messageUser === 'ida') {
                if (horas >= 13 && minutos > 30) {
                    answer = 'Os horários para ida no fim de semana acabaram, o proximo ônibus sai às 6:30 de segunda'
                } else {
                    horariosIdaSabado.map((h) => {
                        let horaBus = h[0] + h[1]
                        let minBus = h[3] + h[4]
                        if (horas == horaBus && minBus > minutos) {
                            listaProximos.push(h)
                        }
                        if (horas < horaBus && horaBus <= horas + 1) {
                            listaProximos.push(h)
                        }
                    })
                }
            } else if (messageUser === 'volta') {
                if (horas >= 18 && minutos > 00) {
                    answer = 'Os horários para volta no fim de semana acabaram, o proximo ônibus sai às 10:00 de segunda'
                } else {
                    horariosVoltaSabado.map((h) => {
                        let horaBus = h[0] + h[1]
                        let minBus = h[3] + h[4]
                        if (horas == horaBus && minBus > minutos) {
                            listaProximos.push(h)
                        }
                        if (horas < horaBus && horaBus <= horas + 1) {
                            listaProximos.push(h)
                        }
                    })
                }

            }
        } else if (feira == 0) {
            answer = 'Os ônibus da moradia não funcionam aos domingos'
        }

    }

    if (listaProximos.length > 0 && answer === '') {
        answer = 'Próximos horários: ' + listaProximos.join(', ') + '\n\n(#) IDA: Ônibus circula até o CAISM (via Escola Sérgio Porto), somente com paradas na Creche (Praça da Paz) e Área da Saúde (6h30; 7h25; e 8h00);\n(#) VOLTA: Saída na Av. Pref. José R. Magalhães Teixeira (Escola Sérgio Porto - BOX 17), atendendo posteriormente Área da Saúde, Creche (Praça da Paz) e o RU\n(B) – VIA TERM. BARÃO GERALDO\n(C) – VIA CENTRO MÉDICO'
    }
    bot.sendMessage(userID, answer).catch((error) => {
        bot.sendMessage(userID, error.message);
    });
});

