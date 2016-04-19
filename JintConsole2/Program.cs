using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Jint;

namespace ConsoleApplication1
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
            var source = "function add(a, b) { return a + b; }";
            Jint.Native.JsValue add = new Engine()
                        .Execute(source)
                        .GetValue("add");

            var nResult = add.Invoke(1, 2); // -> 3
            Console.WriteLine("nResult: " + nResult);
            Console.WriteLine("add.GetType() " + add.GetType());
            Console.ReadLine();


        }
    }
}
