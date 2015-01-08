using System;
using System.Web.Mvc;
using UrbanMovement.Builders;
using UrbanMovement.Models;
using Recaptcha.Web;
using Recaptcha.Web.Mvc;

// key : 6LegLAATAAAAAMMk-cKmyFy3QlIF3Fd9NNSRkJp6
// Secret : 6LegLAATAAAAAIfWB1Ffjau3yaoM8aIlX9S1PqbZ

namespace UrbanMovement.Controllers
{
    public class ContactController : UmController
    {
        public string GetContactView()
        {
            ViewBag.CaptchaMessage = string.Empty;

            return RenderPartialViewToString("_Contact", new Contact());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public String ContactUs(Contact model)
        {
            var captchaValid = IsCaptchaValid();

            if (!captchaValid.Valid)
            {
                return captchaValid.Message;
            }

            if (ModelState.IsValid)
            {
                new EmailBuilder(model).Send();
            }

            return string.Empty;
        }

        [ChildActionOnly]
        CaptchaValidation IsCaptchaValid()
        {
            var captchaValidation = new CaptchaValidation()
                {
                    Valid = true,
                    Message = string.Empty
                };

            var recaptchaHelper = this.GetRecaptchaVerificationHelper();

            if (String.IsNullOrEmpty(recaptchaHelper.Response))
            {
                captchaValidation.Message = "The captcha answer cannot be empty";
                captchaValidation.Valid = false;        
                return captchaValidation;
            }

            var recaptchaResult = recaptchaHelper.VerifyRecaptchaResponse();

            if (recaptchaResult != RecaptchaVerificationResult.Success)
            {
                captchaValidation.Message = "The captcha answer is invalid";
                captchaValidation.Valid = false;
                return captchaValidation;
            }

            return captchaValidation;
        }
    }

    public class CaptchaValidation
    {
        public bool Valid { get; set; }
        public string Message { get; set; }
    }
}