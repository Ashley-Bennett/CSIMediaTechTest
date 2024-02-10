using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;

namespace number_sorter.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NumbersController : ControllerBase
    {
        private IConfiguration _configuration;
        public NumbersController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("GetNumbers")]
        public JsonResult GetNumbers()
        {
            string query = "select * from numbers";
            DataTable dt = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("numberSorterDBCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDatasource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myReader = myCommand.ExecuteReader();
                    dt.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }

            };

            return new JsonResult(dt);
        }

        [HttpPost]
        [Route("AddNumbers")]
        public JsonResult AddNumbers([FromForm] string newNumbers, bool ascending)
        {
            string query = "insert into numbers values(@newNumbers, @ascending, @sortTime)";
            DataTable dt = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("numberSorterDBCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDatasource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@newNumbers", newNumbers);
                    myCommand.Parameters.AddWithValue("@ascending", ascending);
                    myCommand.Parameters.AddWithValue("@sortTime", 12);


                    myReader = myCommand.ExecuteReader();
                    dt.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }

            };

            return new JsonResult("Added Successfully");
        }
    }
}
