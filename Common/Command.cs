using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IndoorTracking.Common
{
    public static class Command
    {
        public static string GetUserCookie()
        {
            var httpCookie = HttpContext.Current.Request.Cookies["userInfo"];
            return httpCookie != null ? httpCookie["Username"] : string.Empty;
        }
    }
}