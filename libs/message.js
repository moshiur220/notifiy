// const moment = require('moment');
import moment from "moment"

export function formatMessage(data, status) {
    return {
        toFirstName: data.firstName,
        toLastName: data.lastName,
        toEmail: data.email,
        toUserName: data.userName,
        fromUserName: data.from,
        fromFirstName: data.fromFirstName,
        fromLastName: data.fromLastName,
        text: data.text,
        userId: data.userId,
        status: status,
        time: moment().format('h:mm a')
    };
}

