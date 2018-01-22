using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndoorTracking.Common;
using IndoorTracking.Models;
using IndoorTracking_DAL.Common;
using IndoorTracking_DAL.Entity;

namespace IndoorTracking.Controllers
{
    public class TrackingsController : BaseController
    {
        indoortrackEntities connect = new indoortrackEntities();
        //
        // GET: /Trackings/
        public ActionResult Index()
        {
            Session["tb_GroupFindgprintDetail"] = null;
            Session["tb_RouterFindgprint"] = null;
            ViewBag.permition = _unitOfWork.UserRepository._getPermitionbyUsername(Command.GetUserCookie());
            ViewBag.device = _unitOfWork.DeviceRepository._getDevice().ToList();
            return View();
        }

        public JsonResult LoadGroupDevice()
        {
            return Json(connect.tb_Group_device.Where(p => p.Flag == "True").OrderByDescending(p => p.ID_Group).ToList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddorEdit(string mac = "", string name = "", string dec = "", int GroupID = 0, string devicecolor = "")
        {
            string kq = "";
            if(GroupID == 0) // add new
            {
                //check trung
                var check = connect.tb_Group_device.Where(p => p.Mac_Group == mac).Count();
                if (check > 0)
                    kq = "Trung";
                else
                {
                    tb_Group_device divec = new tb_Group_device();
                    divec.Mac_Group = mac;
                    divec.Name_Group = name;
                    divec.Description = dec;
                    divec.Flag = "True";
                    connect.tb_Group_device.Add(divec);
                    connect.SaveChanges();
                    kq = "True";
                }
            }
            else
            {
                var up = connect.tb_Group_device.Where(p => p.ID_Group == GroupID).First();
                up.Mac_Group = mac;
                up.Name_Group = name;
                up.Description = dec;
                connect.SaveChanges();
                kq = "True";
            }

            return Json(kq, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteGroupDevice(int GroupID = 0)
        {
            string kq = "";

            //check group device
            var check_device = connect.tb_Device.Where(p => p.ID_Group == GroupID).Count();
            if (check_device > 0)
                kq = "False";
            else
            {
                var delete = connect.tb_Group_device.Where(p => p.ID_Group == GroupID).First();
                delete.Flag = "False";
                connect.SaveChanges();
                kq = "True";
            }
            return Json(kq, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadDevice()
        {
            var data = (from di in connect.tb_Device
                        join gr in connect.tb_Group_device
                        on di.ID_Group equals gr.ID_Group
                        where di.Flag == "True"
                        select new { di.Device_mac, gr.Name_Group, di.ID_Group, di.Device_ID }).ToList();
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddoreditDevice(string Device_mac = "", int Group_mac = 0, int DeviceID = 0)
        {
            string kq = "";
            if(DeviceID == 0) // add new
            {
                //check trung
                var check = connect.tb_Device.Where(p => p.Device_mac == Device_mac).Count();
                if (check > 0)
                    kq = "Trung";
                else
                {
                    tb_Device de = new tb_Device();
                    de.Device_mac = Device_mac;
                    de.ID_Group = Group_mac;
                    de.Flag = "True";
                    connect.tb_Device.Add(de);
                    connect.SaveChanges();
                    kq = "Trueadd";
                }               
            }
            else
            {
                var up = connect.tb_Device.Where(p => p.Device_mac == Device_mac).First();
                up.ID_Group = Group_mac;
                connect.SaveChanges();
                kq = "Trueedit";
            }

            return Json(kq, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteDevice(string Device_mac = "")
        {
            var delete = connect.tb_Device.Where(p => p.Device_mac == Device_mac).First();
            connect.tb_Device.Remove(delete);
            connect.SaveChanges();
            return Json("ok", JsonRequestBehavior.AllowGet);
        }


	}
}