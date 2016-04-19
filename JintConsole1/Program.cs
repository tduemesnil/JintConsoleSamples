using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Jint;



namespace Jint_Console
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
            var source = @"
                var i,
                    s = 'Hello World From JavaScript ';

                for(i = 0; i < 4; i += 1) {
                    print(s + i);
                }                
                s; // Evaluate and return the expression
            ";
            var s = CreateEngine().Execute(source).GetCompletionValue();
            Console.WriteLine("From c# " + s.AsString());
            Console.ReadLine();
      
        }
    }
}
