using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndoorTracking_DAL.Entity;
namespace IndoorTracking.Controllers
{
    public class DeviceGroupController : BaseController
    {
        // GET: DeviceGroup
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult _getDeviceGroup()
        {
            return Json(_unitOfWork.DeviceGroupRepository._getGroupdevice(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult _addOrEdit(tb_Group_device gr)
        {
            return Json(_unitOfWork.DeviceGroupRepository._addorEdit(gr), JsonRequestBehavior.AllowGet);
        }

        public JsonResult _disable(int id)
        {
            _unitOfWork.DeviceGroupRepository._disable(id);
            return Json("True");
        }
    }
}