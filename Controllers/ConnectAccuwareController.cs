using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndoorTracking.Models;
using System.Globalization;
using System.Net.Mail;
using IndoorTracking_DAL.Entity;

namespace IndoorTracking.Controllers
{
    public class ConnectAccuwareController : Controller
    {
        indoortrackEntities connect = new indoortrackEntities();
        //
        // GET: /ConnectAccuware/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult _SaveDataFromServer(string mac = "", string name = "", string lat = "", string lng = "", string battery = "", string source = "", string Current_date = "", int idf = 0)
        {
            string kq = "";
            try
            {
                Tracking_Devices device = new Tracking_Devices();
                device.Code_devices = mac;
                device.Name_device = name;
                device.Lat = lat;
                device.Lng = lng;
                device.Status = battery;
                device.Source = source;
                device.Date_time = DateTime.Parse(Current_date);
                device.Idf = idf;
                connect.Tracking_Devices.Add(device);
                connect.SaveChanges();
                kq = "True";

                #region check điều kiện gửi mail

                var batteryint = int.Parse(battery);
                if (batteryint <= 40)
                {
                    //send mail thông báo
                    string html = "";
                    html += "<p>Dear Sir,</p>";
                    html += "<p>Tracker battery alert";
                    html += "<p>Mac Code: " + mac + "</p>";
                    html += "<p>Battery: " + battery + " %</p>";
                    html += "<p>Time: " + DateTime.Parse(Current_date).ToString("yyyy-MM-dd hh:mm:ss") + "</p>";

                    //gui mail cho a tuan, a cuong
                    MailMessage mailTuansys = new MailMessage();
                    mailTuansys.From = new MailAddress("no-reply@siyosa-vn.com", "Siyosa Company Group");
                    mailTuansys.To.Add("tracker-log@siyosa-vn.com ");
                    mailTuansys.Body = html;
                    mailTuansys.Subject = "Hoya - Tracker battery alert";
                    mailTuansys.IsBodyHtml = true;
                    mailTuansys.Priority = MailPriority.High;
                    SmtpClient client = new SmtpClient();

                    //Add the Creddentials- use your own email id and password
                    client.UseDefaultCredentials = false;
                    client.Host = "mail.senseproperty.com"; //Or Your SMTP Server Address  
                    client.Port = 25;
                    client.EnableSsl = false;
                    client.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                    client.Credentials = new System.Net.NetworkCredential("no-reply@senseproperty.com", "spg#123");
                    try
                    {
                        client.Send(mailTuansys);
                    }
                    catch (Exception ex)
                    {
                        //convert data json to show maps
                    }
                }
                
                #endregion
            }
            catch (Exception ex)
            {
                kq = "";
            }
            
            return Json(kq, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveSendLastseen(string mac, string Current_date)
        {
            #region check điều kiện gửi mail

            //send mail thông báo
            string html = "";
            html += "<p>Dear Sir,</p>";
            html += "<p>Tracker battery alert";
            html += "<p>Mac Code: " + mac + "</p>";
            html += "<p>Last seen / second: " + Current_date + " Second</p>";

            //gui mail cho a tuan, a cuong
            MailMessage mailTuansys = new MailMessage();
            mailTuansys.From = new MailAddress("no-reply@siyosa-vn.com", "Siyosa Company Group");
            mailTuansys.To.Add("tracker-log@siyosa-vn.com");
            mailTuansys.To.Add("cuong.nguyenngoc@siyosa.net");
            mailTuansys.Body = html;
            mailTuansys.Subject = "Hoya - Tracker battery alert";
            mailTuansys.IsBodyHtml = true;
            mailTuansys.Priority = MailPriority.High;
            SmtpClient client = new SmtpClient();

            //Add the Creddentials- use your own email id and password
            client.UseDefaultCredentials = false;
            client.Host = "mail.senseproperty.com"; //Or Your SMTP Server Address  
            client.Port = 25;
            client.EnableSsl = false;
            client.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
            client.Credentials = new System.Net.NetworkCredential("no-reply@senseproperty.com", "spg#123");
            try
            {
                client.Send(mailTuansys);
            }
            catch (Exception ex)
            {
                //convert data json to show maps
            }

            #endregion
            return Json("true");
        }

        public JsonResult Report_divice(string star_date, string end_date, string device)
        {
            string kq = "";
            DateTime d = DateTime.Parse(star_date);
            DateTime d1 = DateTime.Parse(end_date);
            var report = (from re in connect.Tracking_Devices where re.Date_time >= d & re.Date_time <= d1 & re.Code_devices == device select new { re.Lat, re.Lng, re.ID, re.Date_time }).OrderByDescending(p => p.ID).ToList();
            return Json(report, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveFindGprint(int id, string lat, string lng)
        {
            var datap = new tb_DataFindGprint
            {
                IdF = id,
                Lat = lat,
                Lng = lng
            };
            connect.tb_DataFindGprint.Add(datap);
            connect.SaveChanges();
            return Json("true", JsonRequestBehavior.AllowGet);
        }

        public JsonResult GroupFindgprintDetail()
        {
            return Json(connect.tb_GroupFindgprintDetail, JsonRequestBehavior.AllowGet);
        }
        public JsonResult RouterFindgprint()
        {
            return Json(connect.tb_RouterFindgprint, JsonRequestBehavior.AllowGet);
        }
    }
}