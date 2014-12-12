using System.Web;

namespace UrbanMovement.Helpers
{
    public static class SessionHelper
    {
        public static bool Add<T>(string key, T value)
        {
            var current = HttpContext.Current;
            if (current == null)
            {
                return false;
            }

            current.Session.Add(key, value);
            return true;
        }

        public static T Get<T>(string key)
        {
            var current = HttpContext.Current;
            if (current == null)
            {
                return default(T);
            }

            var value = current.Session[key];
            if (value != null)
            {
                return (T)value;
            }

            return default(T);
        }

        public static bool Remove(string key)
        {
            var current = HttpContext.Current;
            if (current == null)
            {
                return false;
            }
            current.Session.Remove(key);
            return true;
        }

        public static bool Exists(string key)
        {
            var current = HttpContext.Current;
            if (current == null)
            {
                return false;
            }

            return current.Session[key] != null;
        }
    }
}