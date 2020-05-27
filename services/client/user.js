const mail = require('../../plugins/send_mail');
module.exports = function (services, models) {
    services.getMailboxUser = function (data) {
        console.log(this);
        return services.check(data, ["mailbox"], function (resolve, reject) {
            models.getMailboxUser(data).them(res => {
                
            }, err => {
                    
            });
        });
    }
    services.sendMail = function (data) {
        console.log(this);
        return services.check(data, ["mailbox"], function (resolve, reject) {
            mail.send(data.mailbox, {
                description: "注册",
                code: 12358
            });
        });
    }
    services.userRegisterWrite = function (data) {
        console.log(this);
        return services.check(data, ["mailbox", "password", "code"], function (resolve, reject) {
            models.userRegisterWrite(data).them(res => {
                
            }, err => {
                    
            });
        });
    }
}