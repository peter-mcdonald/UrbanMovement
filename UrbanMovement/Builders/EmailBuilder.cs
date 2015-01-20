using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using UrbanMovement.Models;

namespace UrbanMovement.Builders
{
    public class EmailBuilder
    {
        readonly Contact contact;

        public EmailBuilder(Contact contact)
        {
            this.contact = contact;
        }

        public void Send()
        {
            var client = GetClient();

            var fromAddress = new MailAddress("urbanmovement.web@gmail.com");
            var toAddress = new MailAddress("urbanmovementents@gmail.com");

            using (var mailMessage = new MailMessage(fromAddress, toAddress))
            {
                mailMessage.Subject = contact.Subject;
                mailMessage.Body = BuildMessageBody();
                client.Send(mailMessage);
            }
        }

        string BuildMessageBody()
        {
            var body = new StringBuilder();
            body.AppendLine("Contact Details : ");
            body.AppendLine("From : " + contact.Name);
            body.AppendLine("Email : " + contact.Email);
            body.AppendLine("Phone : " + contact.Phone);
            body.AppendLine("Message : " + Environment.NewLine);
            body.Append(contact.Message);
            return body.ToString();
        }

        static SmtpClient GetClient()
        {
            return new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential("urbanmovement.web@gmail.com", "7rTkKOyy(H[/AdD")
                };
        }
    }
}