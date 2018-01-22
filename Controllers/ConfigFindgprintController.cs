using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndoorTracking_DAL.Model;

namespace IndoorTracking.Controllers
{
    public class ConfigFindgprintController : BaseController
    {
        // GET: ConfigFindgprint
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetAll()
        {
            return Json(_unitOfWork.GroupFindGprintRepository.GetAll(), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult Addnew(FindgprintModel model)
        {
            return Json(_unitOfWork.GroupFindGprintRepository.Addnew(model), JsonRequestBehavior.AllowGet);
        }
        public JsonResult ViewGroup(int id)
        {
            return Json(_unitOfWork.GroupFindGprintRepository.ViewGroup(id), JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteGroupF(int id)
        {
            _unitOfWork.GroupFindGprintRepository.Delete(id);
            return Json("true", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddRouter(RouterModel model)
        {
            return Json(_unitOfWork.GroupFindGprintRepository.AddRouter(model), JsonRequestBehavior.AllowGet);
        }

        public JsonResult ListRouter()
        {
            return Json(_unitOfWork.GroupFindGprintRepository.ListRouter(), JsonRequestBehavior.AllowGet);
        }
    }
}