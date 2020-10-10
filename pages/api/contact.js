import nodemailer from "nodemailer"

const emailPass = process.env.PASSWORD

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: emailPass
  }
})
//[1]

export default async (req, res) => {
  const { senderMail, name, content, recipientMail } = req.body
//[2]

  // Check if fields are all filled
  if (senderMail === "" || name === "" || content === "" || recipientMail === "") {
    res.status(403).send("")
    return
  }
//[3]

  const mailerRes = await mailer({ senderMail, name, text: content, recipientMail })
  res.send(mailerRes)
//[4]
}

const mailer = ({ senderMail, name, text, recipientMail }) => {
  const from = name && senderMail ? `${name} <${senderMail}>` : `${name || senderMail}`
  const message = {
    from,
    to: `${recipientMail}`,
    subject: `New message from ${from}`,
    text,
    replyTo: from
  }
//[5]

  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, info) =>
      error ? reject(error) : resolve(info)
    )
  })
//[6]
}