using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Diagnostics;

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
        public JsonResult AddNumbers([FromForm] string addedNumbers, bool ascending)
        {
            //stopwatch for operations
            Stopwatch sw;
            sw = Stopwatch.StartNew();
            string[] separatedNumbers = addedNumbers.Split(' ');
            //convert string array to int array
            int[] separatedNumbersInts = Array.ConvertAll(separatedNumbers, int.Parse);

            int[] sorted = new int[separatedNumbersInts.Length];
            for (int i = 0; i < separatedNumbersInts.Length; i++)
            {
                sorted[i] = separatedNumbersInts[i];
            }
            Array.Sort(sorted);

            // reverse array for descending
            if (!ascending)
            {
                Array.Reverse(sorted);
            }

            //int array to strings
            string[] result = sorted.Select(x => x.ToString()).ToArray();
            string sortedNumbers = string.Join(" ", result);
            sw.Stop();

            string query = "insert into numbers values(@newNumbers, @ascending, @sortTime)";
            DataTable dt = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("numberSorterDBCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDatasource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@newNumbers", sortedNumbers);
                    myCommand.Parameters.AddWithValue("@ascending", ascending);
                    myCommand.Parameters.AddWithValue("@sortTime", sw.ElapsedMilliseconds);


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
