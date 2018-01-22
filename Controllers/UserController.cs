using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndoorTracking.Models;
using IndoorTracking_DAL.Entity;

namespace IndoorTracking.Controllers
{
    public class UserController : BaseController
    {
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult _getAlldata()
        {
            return Json(_unitOfWork.UserRepository._getUser(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddorEdit(tb_User u)
        {
            u.Type = 1;
            return Json(_unitOfWork.UserRepository._AddorEdit(u), JsonRequestBehavior.AllowGet);
        }
        public JsonResult _getUserGroup()
        {
            return Json(_unitOfWork.UserGroupRepository._getUserGroup(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult _disable(int id)
        {
            _unitOfWork.UserRepository._Disable(id);
            return Json("True", JsonRequestBehavior.AllowGet);
        }
    }
}