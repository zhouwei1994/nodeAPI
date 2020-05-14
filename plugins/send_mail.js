//引入nodemailer
const nodemailer = require("nodemailer");
const config = require('./../config');
class sendMail {
    constructor() {
        this.smtpTransport = undefined;
        this.init();
    }
    init(callback) {
        this.smtpTransport = nodemailer.createTransport({
            service: config.mail_service,
            port: config.mail_port, // SMTP 端口
            secureConnection: true, // 使用 SSL
            auth: {
                user: config.mail_user,
                //这里密码不是qq密码，是你设置的smtp密码
                pass: config.mail_password
            }
        });
        callback && callback();
    }
    getMailVerificationHtml(data) {
        return `<table width="700" border="0" align="center" cellspacing="0" style="width:700px;">
            <tbody>
            <tr>
                <td>
                    <div style="width:700px;margin:0 auto;border-bottom:1px solid #ccc;margin-bottom:30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="700" height="39" style="font:12px Tahoma, Arial, 宋体;">
                            <tbody>
                            <tr>
                                <td width="210">
                                
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="width:680px;padding:0 10px;margin:0 auto;">
                        <div style="line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d;">
                            <strong style="display:block;margin-bottom:15px;">
                                亲爱的用户：
                                <span style="color:#f60;font-size: 16px;"></span>您好！
                            </strong>

                            <strong style="display:block;margin-bottom:15px;">
                                您正在${data.description}，请在验证码输入框中输入：
                                <span style="color:#f60;font-size: 24px">${data.code}</span>，以完成操作。
                            </strong>
                        </div>` +
                        `<div style="margin-bottom:30px;" >
                            <small style="display:block;margin-bottom:20px;font-size:12px;">
                                <p style="color:#747474;">
                                    注意：请在5分钟内按页面提示提交验证码。
                                    <br>（工作人员不会向你索取此验证码，请勿泄漏！)
                                </p>
                            </small>
                        </div>`
                    + `</div>
                    <div style="width:700px;margin:0 auto;">
                        <div style="padding:10px 10px 0;border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;">
                            <p>此为系统邮件，请勿回复<br>
                                请保管好您的邮箱，避免账号被他人盗用
                            </p>`
                            // < p > 阿里巴巴版权所有 < span style = "border-bottom:1px dashed #ccc;z-index:1" t = "7" onclick = "return false;" data = "1999-2014" > 1999 - 2014</span ></p >
                        +`</div>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>`;
    }
    send(user, data, resend = true) {
        return new Promise((resolve, reject) => {
            let title = data.title || "邮箱验证码";
            let html = data.html || this.getMailVerificationHtml(data);
            this.smtpTransport.sendMail({
                from: config.mail_user,
                to: user,
                subject: title,
                html: html
            }, (error, response) => {
                if (error) {
                    if (resend) {
                        this.init(() => {
                            this.send(user, data, false);
                        });
                    } else {
                        reject(error);
                    }
                } else {
                    resolve(response);
                }
            });
        });

    }
}
const mail = new sendMail();
module.exports = mail;