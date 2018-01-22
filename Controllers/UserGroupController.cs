using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndoorTracking_DAL.Entity;

namespace IndoorTracking.Controllers
{
    public class UserGroupController : BaseController
    {
        // GET: UserGroup
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult AddorEdit(tb_UserGroup ur)
        {
            ur.Type = 1;
            return Json(_unitOfWork.UserGroupRepository._AddorEdit(ur), JsonRequestBehavior.AllowGet);
        }
        public JsonResult _getUserGroup()
        {
            return Json(_unitOfWork.UserGroupRepository._getUserGroup(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult _disable(int id)
        {
            _unitOfWork.UserGroupRepository._Disable(id);
            return Json("True", JsonRequestBehavior.AllowGet);
        }
    }
}