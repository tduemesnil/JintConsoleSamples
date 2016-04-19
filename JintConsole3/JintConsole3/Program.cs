using System;
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
            var source = @"function myRegexReplace( cToReplaceIn, cReplaceThis) {
                        var res = cToReplaceIn.replace(/microsoft/i, cReplaceThis);
                        return res;
                    }
                    ";

            var regExReplace = CreateEngine()
                        .Execute(source)
                        .GetValue("myRegexReplace");

            var cReplacedString = regExReplace.Invoke("Visit Microsoft!", "xBase.Future");
            Console.WriteLine(cReplacedString);
            // Console.WriteLine(cReplacedString.GetType());
            Console.ReadLine();

        }
    }
}
