using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndoorTracking_DAL;
using IndoorTracking_DAL.Entity;

namespace IndoorTracking.Controllers
{
    public class HomeController : Controller
    {
        #region Constructor
        private readonly UnitOfWork _unitOfWork;
        public HomeController()
            : this(new UnitOfWork()) { }

        public HomeController(UnitOfWork uow)
        {
            this._unitOfWork = new UnitOfWork();
        }
        #endregion
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        #region Login, logout và chanpassword

        public ActionResult Login()
        {
            return View();
        }
        public ActionResult Logout()
        {
            if (Request.Cookies["userInfo"] != null)
            {
                Response.Cookies["userInfo"].Expires = DateTime.Now.AddDays(-1);
            }
            return RedirectToAction("Login", "Home");
        }

        public ActionResult CheckLogin(FormCollection form)
        {
            string username = form["Username"];
            var Login = _unitOfWork.UserRepository._Login(username, form["Password"]);
            if (Login)
            {
                HttpCookie cookie = new HttpCookie("userInfo");
                cookie.Values["username"] = username;
                Response.Cookies.Add(cookie);
                //return Redirect("http://hoya-indoortracking.siyosa-vn.com/")
                return RedirectToAction("Index", "Trackings");
            }
            else
                return RedirectToAction("Login", "Home");
            
        }

        [HttpPost]
        public ActionResult ChangePassword(tb_User u)
        {
            return Json(_unitOfWork.UserRepository._ChangePassword(u), JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}