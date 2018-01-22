using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndoorTracking.Models;
using IndoorTracking_DAL;
using IndoorTracking_DAL.Entity;

namespace IndoorTracking.Controllers
{
    public class BaseController : Controller
    {
        public indoortrackEntities connect = new indoortrackEntities();
        public UnitOfWork _unitOfWork = new UnitOfWork();
        protected override void ExecuteCore()
        {
            try
            {

                base.ExecuteCore();
            }
            catch (Exception)
            {
                
                throw;
            }
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (Request.Cookies["userInfo"] == null)
            {
                filterContext.Result = RedirectToAction("Login", "Home");
            }
        }

        protected override bool DisableAsyncSupport
        {
            get
            {
                return true;
            }
        }
    }
}