using System.Collections.Generic;
using System.Linq;
using System.ServiceModel.Syndication;
using System.Text.RegularExpressions;
using System.Xml;
using UrbanMovement.Helpers;
using UrbanMovement.Models;

namespace UrbanMovement.Builders
{
    public class BlogPostBuilder
    {
        const string defaultImage = @"../../Images/UM-Headphones.jpg";
        SyndicationFeed feed;

        public List<BlogItem> Build()
        {
            if (SessionHelper.Exists("PostList"))
            {
                return SessionHelper.Get<List<BlogItem>>("PostList");
            }

            CreateNewsFeed();
            var blogItems = FetchBlogItems();
            SessionHelper.Add("PostList", blogItems);
            return blogItems;
        }

        void CreateNewsFeed()
        {
            var reader = XmlReader.Create(@"https://urbanmovemententertainment.wordpress.com/feed/");
            feed = SyndicationFeed.Load<SyndicationFeed>(reader);
        }

        List<BlogItem> FetchBlogItems()
        {
            var blogItems = feed.Items
                                .Where(x => x.Categories.Any(y => y.Name.ToLower() == "news" || 
                                                                  y.Name.ToLower() == "event"))
                                .Select(x => new BlogItem()
                                    {
                                        Title = x.Title.Text,
                                        LinkUrl = x.Links[0].Uri.ToString(),
                                        ImageUrl = ExtractImage(x.ElementExtensions),
                                        Body = ProcessBody(x.Summary.Text)
                                    }).ToList();
            return blogItems;
        }

        string ProcessBody(string body)
        {
            var noAnchors = RemoveAnchors(body);
            return RemoveImages(noAnchors);
        }

        string RemoveAnchors(string text)
        {
            return Regex.Replace(text, @"<a.*?</a>", string.Empty, RegexOptions.IgnoreCase);
        }

        string RemoveImages(string text)
        {
            return Regex.Replace(text, @"<img\s[^>]*>(?:\s*?</img>)?", string.Empty, RegexOptions.IgnoreCase);
        }

        string ExtractImage(IEnumerable<SyndicationElementExtension> extensions)
        {
            foreach (var extension in extensions.Where(e => e.OuterName == "content"))
            {
                var element = extension.GetObject<XmlElement>();

                if (element.HasAttributes)
                {
                    var url = element.GetAttribute("url").ToLower();

                    if (url.Contains(".jpg") || url.Contains(".png"))
                    {
                        return url;
                    }
                }
            }

            return defaultImage;
        }
    }
}