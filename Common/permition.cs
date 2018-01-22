using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using IndoorTracking_DAL.Entity;

namespace IndoorTracking.Common
{
    public static class permition
    {
        public static indoortrackEntities _connect = new indoortrackEntities();
        private static string username =  Command.GetUserCookie();
        private static int idusergroup = _connect.tb_User.Single(p => p.Username.Equals(username)).Id_group_user.Value;
        private static string permitionall = _connect.tb_UserGroup.First(p => p.ID == idusergroup).Permition;

        public static bool checkmap()
        {
            var key = true;
            if (!permitionall.Contains("ac_map"))
                key = false;
            return key;
        }
    }
}