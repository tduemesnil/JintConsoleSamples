using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
            // Mehrfacher Aufruf der Execute Methode kann dem Engine weiter Funktionen zufügen.
            var cScript1 = "function add(a,b) { return a + b; }";
            var cScript2 = "function loop(n, z) { return add(n,z); }";

            var includeEngine = CreateEngine()
                                .Execute(cScript1)
                                .Execute(cScript2);
            // Hier stehen die Funktionen für einen Aufruf bereit
            Console.WriteLine(includeEngine
                                .Execute("loop(2,4)")
                                .GetCompletionValue());
            // Console.WriteLine(includeEngine.Execute("loop(2,4)").GetCompletionValue().GetType());            
            Console.ReadLine();
        }
    }
}
