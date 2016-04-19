using System;
using System.IO;
using Jint;

namespace JintConsole3
{
    class Program
    {
        public static void Print(object s)
        {
            if (s == null)
                s = "null";
            Console.WriteLine(s.ToString());
        }

        private static Engine CreateEngine()
        {
            return new Engine().SetValue("print", new Action<object>(Print));
        }

        static void Main(string[] args)
        {
            string cJsFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "jsvattest.js");
            string cScriptFile = File.ReadAllText(cJsFile);

            var vatEngine = CreateEngine();
            try {
                vatEngine.Execute(cScriptFile);
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
