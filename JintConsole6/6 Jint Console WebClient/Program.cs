using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Jint;
using System.Net;

namespace JintConsole6
{
    class Program
    {
        public static void Print(object s)
        {
            if (s == null)
                s = "null";
            Console.WriteLine(s.ToString());
        }

        public static string DownloadData(object url)
        {
            string ReturnData = "nothing";
            // Create web client simulating IE6.
            using (WebClient client = new WebClient())
            {
                client.Headers["User-Agent"] =
                "Mozilla/4.0 (Compatible; Windows NT 5.1; MSIE 6.0) " +
                "(compatible; MSIE 6.0; Windows NT 5.1; " +
                ".NET CLR 1.1.4322; .NET CLR 2.0.50727)";

                // Download data.                
                ReturnData = client.DownloadString(url.ToString());
                // Write values.
                Console.WriteLine("--- WebClient result ---");
                Console.WriteLine(ReturnData.Length);
            }
            return ReturnData;
        }

        private static Engine CreateEngine()
        {
            return new Engine(cfg => cfg.AllowClr()).SetValue("print", new Action<object>(Print));
        }

        static void Main(string[] args)
        {
            var Engine = CreateEngine();
            var source = @"var file = new System.IO.StreamWriter('log.txt');                            
                            file.WriteLine('Hello World !');
                            file.Dispose();
                           ";        
            try
            {
                Engine.Execute(source);
            }
            catch (Exception ex)
            {
                // Ausgabe einer Fehlermeldung
                Console.WriteLine(ex.Message);
            }
            Console.WriteLine("File Created");
            Console.ReadLine();

            Engine.SetValue("getpage", new Func<object, string>(DownloadData));

            source = @"var content = getpage('http://aem1k.com/world/');
                       print(content.substring(1, 1025) );
                      ";
            try
            {
                Engine.Execute(source);
            }
            catch (Exception ex)
            {
                // Ausgabe einer Fehlermeldung
                Console.WriteLine(ex.Message);
            }

            Console.ReadLine();

        }
    }
}
