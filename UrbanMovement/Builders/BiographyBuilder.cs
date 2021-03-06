﻿using System.Net.Http;
using System.Text.RegularExpressions;
using UrbanMovement.Helpers;

namespace UrbanMovement.Builders
{
    public class BiographyBuilder
    {
        public string Build()
        {
            if (SessionHelper.Exists("Biography"))
            {
                return SessionHelper.Get<string>("Biography");
            }

            var content = string.Empty;

            using (var client = new HttpClient())
            {
                var response = client.GetAsync("http://urbanmovemententertainment.wordpress.com/biography/").Result;
                content = RemoveAnchors(response.Content.ReadAsStringAsync().Result);
            }

            var start = content.IndexOf(@"<!--fromhere-->") + 15;
            var end = content.IndexOf(@"<!--tohere-->");

            var result = content.Substring(start, end - start);

            SessionHelper.Add("Biography", result);

            return result;
        }

        string RemoveAnchors(string text)
        {
            return Regex.Replace(text, @"<a.*?</a>", string.Empty, RegexOptions.IgnoreCase);  
        }
    }
}